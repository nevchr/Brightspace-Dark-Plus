"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const popupSource = fs.readFileSync(path.join(__dirname, "..", "popup.js"), "utf8");

function createElement() {
  return {
    dataset: {},
    textContent: "",
    hidden: false,
    disabled: false,
    listeners: {},
    addEventListener(type, listener) {
      this.listeners[type] = listener;
    },
  };
}

async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

async function runScenario({ looksLikeBrightspace, initiallyGranted = false }) {
  const status = createElement();
  const detail = createElement();
  const action = createElement();
  const requested = [];
  const removed = [];
  const injected = [];
  let granted = initiallyGranted;
  let registered = [];

  const context = {
    URL,
    console,
    setTimeout,
    clearTimeout,
    document: {
      querySelector(selector) {
        return {
          "#status": status,
          "#detail": detail,
          "#site-action": action,
        }[selector];
      },
    },
    chrome: {
      tabs: {
        async query() {
          return [{ id: 7, url: "https://learn.example.edu/d2l/home" }];
        },
      },
      permissions: {
        async contains() {
          return granted;
        },
        async request(value) {
          requested.push(value);
          granted = true;
          return true;
        },
        async remove(value) {
          removed.push(value);
          granted = false;
          return true;
        },
      },
      scripting: {
        async executeScript(options) {
          if (options.func) return [{ frameId: 0, result: looksLikeBrightspace }];
          injected.push(options);
          return [{ frameId: 0 }];
        },
        async getRegisteredContentScripts({ ids }) {
          return registered.filter((script) => ids.includes(script.id));
        },
        async registerContentScripts(scripts) {
          registered.push(...scripts);
        },
        async unregisterContentScripts({ ids }) {
          registered = registered.filter((script) => !ids.includes(script.id));
        },
      },
    },
  };

  vm.runInNewContext(popupSource, context, { filename: "popup.js" });
  await settle();
  return { action, detail, injected, registered: () => registered, removed, requested, status };
}

async function main() {
  const unrelated = await runScenario({ looksLikeBrightspace: false });
  assert.equal(unrelated.status.textContent, "Brightspace not detected");
  assert.equal(unrelated.action.hidden, true);
  assert.equal(unrelated.requested.length, 0);

  const detected = await runScenario({ looksLikeBrightspace: true });
  assert.equal(detected.status.textContent, "Brightspace detected");
  assert.equal(detected.action.dataset.action, "enable");
  assert.equal(detected.action.hidden, false);

  await detected.action.listeners.click();
  await settle();
  assert.equal(
    JSON.stringify(detected.requested),
    JSON.stringify([{ origins: ["https://learn.example.edu/*"] }]),
  );
  assert.equal(detected.registered().length, 1);
  assert.equal(detected.registered()[0].matches[0], "https://learn.example.edu/*");
  assert.equal(detected.registered()[0].runAt, "document_start");
  assert.equal(detected.registered()[0].allFrames, true);
  assert.equal(detected.registered()[0].matchOriginAsFallback, true);
  assert.equal(detected.injected[0].files[0], "inject.js");
  assert.equal(detected.status.textContent, "Dark theme enabled");
  assert.equal(detected.action.dataset.action, "disable");

  await detected.action.listeners.click();
  await settle();
  assert.equal(detected.registered().length, 0);
  assert.equal(
    JSON.stringify(detected.removed),
    JSON.stringify([{ origins: ["https://learn.example.edu/*"] }]),
  );
  assert.equal(detected.status.textContent, "Disabled on this site");

  const existing = await runScenario({ looksLikeBrightspace: false, initiallyGranted: true });
  assert.equal(existing.status.textContent, "Dark theme enabled");
  assert.equal(existing.registered().length, 1);
  assert.equal(existing.requested.length, 0);

  console.log("popup permission-flow tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
