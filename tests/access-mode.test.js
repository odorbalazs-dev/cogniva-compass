import test from "node:test";
import assert from "node:assert/strict";

import { resolveAssessmentAccessMode } from "../src/config.js";

test("assessment access mode is explicit and defaults fail-closed", () => {
  assert.equal(resolveAssessmentAccessMode(), "disabled");
  assert.equal(resolveAssessmentAccessMode(""), "disabled");
  assert.equal(resolveAssessmentAccessMode("unexpected"), "disabled");
  assert.equal(resolveAssessmentAccessMode("preview"), "preview");
  assert.equal(resolveAssessmentAccessMode(" PRODUCTION "), "production");
});
