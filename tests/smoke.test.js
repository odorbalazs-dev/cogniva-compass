import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("all eleven languages are present",()=>{
  const source=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  for(const lang of ["hu","en","de","it","es","zh","ja","ar","pl","pt","fr"]){
    assert.match(source,new RegExp(`${lang}:\\{language:`));
    assert.match(source,new RegExp(`${lang}:\\{cats:`));
  }
});

test("questionnaire content is localized without an English question fallback",()=>{
  const source=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  assert.match(source,/const QUESTION_PACKS=/);
  assert.doesNotMatch(source,/const EQ_OPTIONS=/);
  assert.doesNotMatch(source,/mode==="iq"\?IQ:EQ/);
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
  assert.match(loader,/\/app\.js\?v=/);
  assert.match(loader,/\/styles\.css\?v=/);
  assert.ok(embed.length < 300, "Webflow embed should stay small");
  assert.doesNotMatch(embed,/neuromap/i);
});
