(function () {
  "use strict";

  if (window.COGNIVA_COMPASS_WEBFLOW_LOADED) return;
  window.COGNIVA_COMPASS_WEBFLOW_LOADED = true;

  var VERSION = "20260806-prelaunch-preview-v2";
  var BASE_URL = "https://cogniva-compass-production.up.railway.app";
  var loaderScript = document.currentScript;
  var LANGUAGES = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
  var LOAD_ERRORS = {
    hu: "A Cogniva Compass nem tölthető be. Frissítsd az oldalt.",
    en: "Cogniva Compass could not be loaded. Please refresh the page.",
    de: "Cogniva Compass konnte nicht geladen werden. Bitte aktualisiere die Seite.",
    it: "Impossibile caricare Cogniva Compass. Aggiorna la pagina.",
    es: "No se pudo cargar Cogniva Compass. Actualiza la página.",
    zh: "无法加载 Cogniva Compass。请刷新页面。",
    ja: "Cogniva Compassを読み込めませんでした。ページを更新してください。",
    ar: "تعذر تحميل Cogniva Compass. حدّث الصفحة.",
    pl: "Nie udało się wczytać Cogniva Compass. Odśwież stronę.",
    pt: "Não foi possível carregar o Cogniva Compass. Atualize a página.",
    fr: "Cogniva Compass n’a pas pu être chargé. Actualisez la page."
  };

  function preferredLanguage() {
    var requested = "";
    try { requested = new URL(window.location.href).searchParams.get("lang") || window.localStorage.getItem("cc_lang") || window.navigator.language; } catch (error) { requested = window.navigator.language; }
    var normalized = String(requested || "en").toLowerCase().split("-")[0];
    return LANGUAGES.indexOf(normalized) === -1 ? "en" : normalized;
  }

  function addStylesheet(path, id) {
    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        if (existing.sheet) resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      var link = document.createElement("link");
      link.addEventListener("load", resolve, { once: true });
      link.addEventListener("error", reject, { once: true });
      link.id = id;
      link.rel = "stylesheet";
      link.href = BASE_URL + path + "?v=" + VERSION;
      document.head.appendChild(link);
    });
  }

  function addScript(path, id) {
    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      var script = document.createElement("script");
      script.id = id;
      script.src = BASE_URL + path;
      script.addEventListener("load", function () {
        script.dataset.loaded = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.body.appendChild(script);
    });
  }

  function mount() {
    if (document.getElementById("cognivaCompassRoot")) return;

    var root = document.createElement("div");
    root.id = "cognivaCompassRoot";
    root.lang = preferredLanguage();
    root.dir = root.lang === "ar" ? "rtl" : "ltr";
    root.innerHTML = '<main id="ccApp" tabindex="-1"></main>';
    (loaderScript && loaderScript.parentElement ? loaderScript.parentElement : document.body).appendChild(root);

    function showLoadFailure() {
      root.innerHTML = '<p class="cc-load-failure" role="alert">' + LOAD_ERRORS[root.lang] + '</p>';
    }

    Promise.all([
      addStylesheet("/styles.css", "cogniva-compass-styles"),
      addStylesheet("/result-styles.css", "cogniva-compass-result-styles")
    ])
      .then(function () { return addScript("/legal-content.js?v=" + VERSION, "cogniva-compass-legal-content"); })
      .then(function () { return addScript("/app.js?v=" + VERSION, "cogniva-compass-app"); })
      .catch(showLoadFailure);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
