import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkspace } from '../dist/workspace.js';
test('Workshop unlock is shared with inventory and cannot award duplicates', () => {
  const workspace = createWorkspace();
  assert.equal(workspace.unlockBadge(), true);
  assert.equal(workspace.unlockBadge(), false);
  assert.equal(workspace.snapshot().items.length, 1);
  assert.equal(workspace.snapshot().credits, 50);
  assert.equal(workspace.snapshot().items[0].simulated, true);
});
test('Simulated craft spends exactly two credits and cannot overspend', () => {
  const workspace = createWorkspace();
  for (let i = 0; i < 25; i++) assert.equal(workspace.craftPin(), true);
  assert.equal(workspace.craftPin(), false);
  assert.equal(workspace.snapshot().credits, 0);
  assert.equal(workspace.snapshot().items[0].quantity, 25);
});
test('Copies cannot mutate store; reset clears only workspace state', () => {
  const workspace = createWorkspace();
  workspace.unlockBadge();
  workspace.snapshot().items[0].quantity = 999;
  assert.equal(workspace.snapshot().items[0].quantity, 1);
  workspace.craftPin(); workspace.reset();
  assert.equal(workspace.snapshot().credits, 50);
  assert.equal(workspace.snapshot().items.length, 0);
});
