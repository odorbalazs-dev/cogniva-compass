import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("all eleven languages are present",()=>{
  const app=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  const builder=fs.readFileSync(new URL("../scripts/build-banks.js",import.meta.url),"utf8");
  for(const lang of ["hu","en","de","it","es","zh","ja","ar","pl","pt","fr"]){
    assert.match(app,new RegExp(`${lang}:\\{language:`));
    assert.match(app,new RegExp(`${lang}:\\{patterns:`));
    assert.match(builder,new RegExp(`"${lang}"`));
  }
});

test("questionnaire content is localized without an English question fallback",()=>{
  const app=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  const index=fs.readFileSync(new URL("../public/index.html",import.meta.url),"utf8");
  assert.match(app,/selector\.getItems\(track,lang\)/);
  assert.doesNotMatch(app,/QUESTION_PACKS/);
  assert.match(index,/\/banks\/cogniva-banks\.v1\.js/);
  assert.match(index,/\/selection-engine\.js/);
  assert.match(index,/\/result-model\.js/);
  assert.match(index,/\/result-insights\.js/);
  assert.ok(index.indexOf("/banks/cogniva-banks.v1.js") < index.indexOf("/selection-engine.js"));
  assert.ok(index.indexOf("/selection-engine.js") < index.indexOf("/result-model.js"));
  assert.ok(index.indexOf("/result-model.js") < index.indexOf("/result-insights.js"));
  assert.ok(index.indexOf("/result-insights.js") < index.indexOf("/app.js"));
});

test("result UI is descriptive, accessible and stays client-side",()=>{
  const app=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  const readme=fs.readFileSync(new URL("../README.md",import.meta.url),"utf8");
  assert.match(app,/role="progressbar"/);
  assert.match(app,/aria-valuenow=/);
  assert.match(app,/aria-valuetext=/);
  assert.match(app,/querySelector\("#resultTitle"\)\.focus\(\{preventScroll:true\}\)/);
  assert.match(app,/window\.scrollTo\(\{top:0,behavior:"auto"\}\)/);
  assert.match(readme,/display bands are reflection aids, not norms/i);
  assert.doesNotMatch(app,/safeStorageSet\([^\n]*(answer|score|result)/i);
});

test("privacy and non-clinical boundaries are explicit",()=>{
  const readme=fs.readFileSync(new URL("../README.md",import.meta.url),"utf8");
  assert.match(readme,/not an IQ test/i);
  assert.match(readme,/answers and results stay in browser memory/i);
});

test("Webflow embed references only the independent Cogniva service",()=>{
  const embed=fs.readFileSync(new URL("../webflow/cogniva-compass-embed.html",import.meta.url),"utf8");
  const loader=fs.readFileSync(new URL("../public/webflow-loader.js",import.meta.url),"utf8");
  assert.match(embed,/cogniva-compass-production\.up\.railway\.app\/webflow-loader\.js/);
  assert.match(loader,/\/banks\/cogniva-banks\.v1\.js\?v=/);
  assert.match(loader,/\/selection-engine\.js\?v=/);
  assert.match(loader,/\/result-model\.js\?v=/);
  assert.match(loader,/\/result-insights\.js\?v=/);
  assert.match(loader,/\/app\.js\?v=/);
  assert.match(loader,/\/styles\.css\?v=/);
  assert.match(loader,/\/result-styles\.css\?v=/);
  assert.ok(loader.indexOf("/banks/cogniva-banks.v1.js") < loader.indexOf("/selection-engine.js"));
  assert.ok(loader.indexOf("/selection-engine.js") < loader.indexOf("/result-model.js"));
  assert.ok(loader.indexOf("/result-model.js") < loader.indexOf("/result-insights.js"));
  assert.ok(loader.indexOf("/result-insights.js") < loader.indexOf("/app.js"));
  assert.ok(embed.length < 300, "Webflow embed should stay small");
  assert.doesNotMatch(embed,/neuromap/i);
});
