import test from "node:test";
import assert from "node:assert/strict";

import {
  generateOrderOtp,
  normalizePayChanguStatus,
} from "../src/apps/orders/services/orders.js";

test("generateOrderOtp creates a 6-digit numeric code", () => {
  const otp = generateOrderOtp();

  assert.match(otp, /^\d{6}$/);
});

test("normalizePayChanguStatus maps PayChangu statuses to app statuses", () => {
  assert.equal(normalizePayChanguStatus("success"), "paid");
  assert.equal(normalizePayChanguStatus("paid"), "paid");
  assert.equal(normalizePayChanguStatus("pending"), "pending");
  assert.equal(normalizePayChanguStatus("failed"), "failed");
  assert.equal(normalizePayChanguStatus("cancelled"), "failed");
});
