import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("all eleven languages are present",()=>{
  const source=fs.readFileSync(new URL("../public/app.js",import.meta.url),"utf8");
  for(const lang of ["hu","en","de","it","es","zh","ja","ar","pl","pt","fr"]){
    assert.match(source,new RegExp(`${lang}:\\{language:`));
  }
});

test("privacy and non-clinical boundaries are explicit",()=>{
  const readme=fs.readFileSync(new URL("../README.md",import.meta.url),"utf8");
  assert.match(readme,/not an IQ test/i);
  assert.match(readme,/answers and results stay in browser memory/i);
});
