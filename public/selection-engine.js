(function (global) {
  "use strict";

  var ENGINE_VERSION = "v1";
  var PREFIX = "cogniva.selection." + ENGINE_VERSION;
  var FORM_SIZES = { cognitive: 20, emotional: 24 };
  var memoryLocal = Object.create(null);
  var memorySession = Object.create(null);

  function normaliseTrack(track) {
    var value = String(track || "").toLowerCase();
    if (value === "cognitive" || value === "iq") return "cognitive";
    if (value === "emotional" || value === "eq") return "emotional";
    throw new Error("Unknown Cogniva track: " + track);
  }

  function banks() {
    var value = global.COGNIVA_BANKS_V1;
    if (!value || !value.tracks) {
      throw new Error("COGNIVA_BANKS_V1 must be loaded before the selection engine is used.");
    }
    return value;
  }

  function safeKeyPart(value, fallback) {
    var text = String(value || fallback).replace(/[^a-zA-Z0-9_.-]/g, "-");
    return text || fallback;
  }

  function storageKey(kind, track) {
    var bank = banks();
    var schema = safeKeyPart(bank.schemaVersion, "schema-v1");
    var version = safeKeyPart(bank.bankVersion, "bank-v1");
    return [PREFIX, schema, version, kind, normaliseTrack(track)].join(".");
  }

  function storageObject(name) {
    try { return global[name] || null; } catch (error) { return null; }
  }

  function readJson(storageName, key, fallback, memory) {
    var stored;
    try {
      var storage = storageObject(storageName);
      stored = storage ? storage.getItem(key) : null;
    } catch (error) {
      stored = null;
    }
    if (stored === null && Object.prototype.hasOwnProperty.call(memory, key)) stored = memory[key];
    if (stored === null || typeof stored === "undefined") return fallback;
    try { return JSON.parse(stored); } catch (error) { return fallback; }
  }

  function writeJson(storageName, key, value, memory) {
    var encoded = JSON.stringify(value);
    memory[key] = encoded;
    try {
      var storage = storageObject(storageName);
      if (storage) storage.setItem(key, encoded);
    } catch (error) {}
  }

  function removeStored(storageName, key, memory) {
    delete memory[key];
    try {
      var storage = storageObject(storageName);
      if (storage) storage.removeItem(key);
    } catch (error) {}
  }

  function rawItems(track) {
    var canonical = normaliseTrack(track);
    var trackBank = banks().tracks[canonical];
    if (!trackBank || !Array.isArray(trackBank.items)) throw new Error("Missing item array for Cogniva track: " + canonical);
    var seen = new Set();
    return trackBank.items.filter(function (item) {
      if (!item || typeof item.id !== "string" || !item.id || seen.has(item.id)) return false;
      var status = String(item.status || "").toLowerCase();
      if (["disabled", "inactive", "retired", "rejected"].indexOf(status) !== -1) return false;
      seen.add(item.id);
      return true;
    });
  }

  function uniqueValues(items, field) {
    var found = [];
    items.forEach(function (item) {
      var value = item[field];
      if (typeof value !== "undefined" && found.indexOf(value) === -1) found.push(value);
    });
    return found;
  }

  function readHistory(track, items) {
    var valid = new Set(items.map(function (item) { return item.id; }));
    var stored = readJson("localStorage", storageKey("history", track), [], memoryLocal);
    if (!Array.isArray(stored)) return [];
    var reversed = [];
    var found = new Set();
    for (var index = stored.length - 1; index >= 0; index -= 1) {
      var id = stored[index];
      if (typeof id === "string" && valid.has(id) && !found.has(id)) {
        found.add(id);
        reversed.push(id);
      }
    }
    return reversed.reverse();
  }

  function writeHistory(track, history) {
    writeJson("localStorage", storageKey("history", track), history, memoryLocal);
  }

  function markSeen(track, itemIds, items) {
    var selected = new Set(itemIds);
    var history = readHistory(track, items).filter(function (id) { return !selected.has(id); });
    writeHistory(track, history.concat(itemIds));
  }

  function randomUnit() {
    try {
      if (global.crypto && typeof global.crypto.getRandomValues === "function") {
        var value = new Uint32Array(1);
        global.crypto.getRandomValues(value);
        return value[0] / 4294967296;
      }
    } catch (error) {}
    return Math.random();
  }

  function selectionWeight(item) {
    var value = Number(item.selectionWeight);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  function weightedChoice(items) {
    var total = items.reduce(function (sum, item) { return sum + selectionWeight(item); }, 0);
    var cursor = randomUnit() * total;
    for (var index = 0; index < items.length; index += 1) {
      cursor -= selectionWeight(items[index]);
      if (cursor < 0) return items[index];
    }
    return items[items.length - 1];
  }

  function weightedSample(items, count) {
    var pool = items.slice();
    var selected = [];
    while (pool.length && selected.length < count) {
      var item = weightedChoice(pool);
      selected.push(item);
      pool.splice(pool.indexOf(item), 1);
    }
    return selected;
  }

  function leastRecent(items, count, history, protectedIds) {
    var rank = new Map();
    history.forEach(function (id, index) { rank.set(id, index); });
    var sorted = items.slice().sort(function (left, right) {
      var leftRank = rank.has(left.id) ? rank.get(left.id) : -1;
      var rightRank = rank.has(right.id) ? rank.get(right.id) : -1;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.id.localeCompare(right.id);
    });
    var unprotected = sorted.filter(function (item) { return !protectedIds.has(item.id); });
    var chosen = unprotected.slice(0, count);
    if (chosen.length < count) {
      var chosenIds = new Set(chosen.map(function (item) { return item.id; }));
      chosen = chosen.concat(sorted.filter(function (item) { return !chosenIds.has(item.id); }).slice(0, count - chosen.length));
    }
    return chosen;
  }

  function chooseForQuota(candidates, count, state) {
    var available = candidates.filter(function (item) { return !state.chosenIds.has(item.id); });
    if (available.length < count) throw new Error("The Cogniva bank cannot satisfy a form quota without duplicate items.");
    var unseen = available.filter(function (item) { return !state.historySet.has(item.id); });
    var chosen = weightedSample(unseen, Math.min(count, unseen.length));
    if (chosen.length < count) {
      var chosenNow = new Set(chosen.map(function (item) { return item.id; }));
      var fallbackPool = available.filter(function (item) { return !chosenNow.has(item.id); });
      chosen = chosen.concat(leastRecent(fallbackPool, count - chosen.length, state.history, state.lastFormIds));
    }
    chosen.forEach(function (item) { state.chosenIds.add(item.id); });
    return chosen;
  }

  function selectionState(track, items) {
    var history = readHistory(track, items);
    var size = FORM_SIZES[normaliseTrack(track)];
    return { history: history, historySet: new Set(history), lastFormIds: new Set(history.slice(-size)), chosenIds: new Set() };
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(randomUnit() * (index + 1));
      var temporary = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temporary;
    }
    return copy;
  }

  function buildCognitiveForm(items) {
    var domains = uniqueValues(items, "domain");
    if (domains.length !== 4) throw new Error("The cognitive bank must contain exactly four domains.");
    var state = selectionState("cognitive", items);
    var selected = [];
    domains.forEach(function (domain) {
      [1, 2, 3, 4, 5].forEach(function (difficulty) {
        var candidates = items.filter(function (item) { return item.domain === domain && Number(item.difficulty) === difficulty; });
        selected = selected.concat(chooseForQuota(candidates, 1, state));
      });
    });
    return shuffle(selected);
  }

  function normaliseDirection(item) {
    var value = String(item.direction || "").toLowerCase();
    if (["positive", "direct", "forward", "keyed"].indexOf(value) !== -1) return "positive";
    if (["reverse", "reversed", "negative"].indexOf(value) !== -1) return "reverse";
    if (item.direction === 1 || item.reverseScored === false) return "positive";
    if (item.direction === -1 || item.reverseScored === true) return "reverse";
    throw new Error("Unknown emotional item direction for " + item.id + ".");
  }

  function buildEmotionalForm(items) {
    var domains = uniqueValues(items, "domain");
    if (domains.length !== 4) throw new Error("The emotional bank must contain exactly four domains.");
    var state = selectionState("emotional", items);
    var selected = [];
    domains.forEach(function (domain) {
      ["positive", "reverse"].forEach(function (direction) {
        var candidates = items.filter(function (item) { return item.domain === domain && normaliseDirection(item) === direction; });
        selected = selected.concat(chooseForQuota(candidates, 3, state));
      });
    });
    return shuffle(selected);
  }

  function createFormId(track) {
    var token;
    try { token = global.crypto && typeof global.crypto.randomUUID === "function" ? global.crypto.randomUUID() : null; } catch (error) { token = null; }
    if (!token) token = Date.now().toString(36) + "-" + Math.floor(randomUnit() * 1e12).toString(36);
    return normaliseTrack(track) + "-" + token;
  }

  function cloneForm(form) {
    return { formId: form.formId, track: form.track, itemIds: form.itemIds.slice() };
  }

  function validActiveForm(form, track, items) {
    if (!form || typeof form.formId !== "string" || form.track !== track) return false;
    if (!Array.isArray(form.itemIds) || form.itemIds.length !== FORM_SIZES[track]) return false;
    if (new Set(form.itemIds).size !== form.itemIds.length) return false;
    var validIds = new Set(items.map(function (item) { return item.id; }));
    return form.itemIds.every(function (id) { return validIds.has(id); });
  }

  function getOrCreateForm(track) {
    var canonical = normaliseTrack(track);
    var items = rawItems(canonical);
    var key = storageKey("active-form", canonical);
    var active = readJson("sessionStorage", key, null, memorySession);
    if (validActiveForm(active, canonical, items)) return cloneForm(active);
    if (active) removeStored("sessionStorage", key, memorySession);
    var selected = canonical === "cognitive" ? buildCognitiveForm(items) : buildEmotionalForm(items);
    var form = { formId: createFormId(canonical), track: canonical, itemIds: selected.map(function (item) { return item.id; }) };
    writeJson("sessionStorage", key, form, memorySession);
    markSeen(canonical, form.itemIds, items);
    return cloneForm(form);
  }

  function normaliseLanguage(lang) {
    var requested = String(lang || "en").toLowerCase().replace(/_/g, "-");
    var available = (banks().languages || []).map(function (value) { return String(value).toLowerCase(); });
    if (available.indexOf(requested) !== -1) return requested;
    var base = requested.split("-")[0];
    if (available.indexOf(base) !== -1) return base;
    return available.indexOf("en") !== -1 ? "en" : available[0] || base || "en";
  }

  function localiseItem(item, lang) {
    var locale = normaliseLanguage(lang);
    var locales = item.locales || {};
    var content = locales[locale];
    if (!content) throw new Error("Missing " + locale + " locale for Cogniva item " + item.id + ".");
    var result = {};
    Object.keys(item).forEach(function (key) { if (key !== "locales") result[key] = item[key]; });
    Object.keys(content).forEach(function (key) { result[key] = Array.isArray(content[key]) ? content[key].slice() : content[key]; });
    result.locale = locale;
    return result;
  }

  function getItems(track, lang) {
    var canonical = normaliseTrack(track);
    var form = getOrCreateForm(canonical);
    var byId = new Map(rawItems(canonical).map(function (item) { return [item.id, item]; }));
    return form.itemIds.map(function (id) { return localiseItem(byId.get(id), lang); });
  }

  function clearActiveForm(track) {
    var canonical = normaliseTrack(track);
    removeStored("sessionStorage", storageKey("active-form", canonical), memorySession);
  }

  function resetHistory(track) {
    var canonical = normaliseTrack(track);
    removeStored("localStorage", storageKey("history", canonical), memoryLocal);
  }

  global.COGNIVA_SELECTION_V1 = Object.freeze({
    version: ENGINE_VERSION,
    formSizes: Object.freeze({ cognitive: 20, emotional: 24 }),
    getOrCreateForm: getOrCreateForm,
    getItems: getItems,
    clearActiveForm: clearActiveForm,
    completeForm: clearActiveForm,
    resetHistory: resetHistory
  });
})(window);
