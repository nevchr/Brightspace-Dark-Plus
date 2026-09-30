"use strict";

const statusElement = document.querySelector("#status");
const detailElement = document.querySelector("#detail");
const actionButton = document.querySelector("#site-action");

let activeContext = null;

function setStatus(state, status, detail) {
  statusElement.dataset.state = state;
  statusElement.textContent = status;
  detailElement.textContent = detail;
}

function scriptIdForOrigin(origin) {
  let hash = 2166136261;
  for (const character of origin) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const hostname = new URL(origin).hostname.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `bdp-${hostname.slice(0, 38)}-${(hash >>> 0).toString(16)}`;
}

function patternForUrl(url) {
  return `${url.origin}/*`;
}

async function pageLooksLikeBrightspace(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const pathLooksRight = window.location.pathname.toLowerCase().startsWith("/d2l/");
      const generator = document.querySelector('meta[name="generator"]')?.content?.toLowerCase() || "";
      const hasD2lElement = Boolean(
        document.querySelector(
          "d2l-navigation, d2l-menu, d2l-card, [class^='d2l-'], [class*=' d2l-']",
        ),
      );
      const hasD2lScript = Array.from(document.scripts).some((script) => {
        const source = script.src.toLowerCase();
        return source.includes("/d2l/") || source.includes("brightspace");
      });
      return pathLooksRight || generator.includes("brightspace") || generator.includes("d2l") || hasD2lElement || hasD2lScript;
    },
  });
  return results.some((result) => result.result === true);
}

async function hasSiteAccess(pattern) {
  return chrome.permissions.contains({ origins: [pattern] });
}

async function ensureRegistered(context) {
  const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [context.scriptId] });
  if (existing.length) return;
  await chrome.scripting.registerContentScripts([
    {
      id: context.scriptId,
      matches: [context.pattern],
      js: ["inject.js"],
      runAt: "document_start",
      allFrames: true,
      matchOriginAsFallback: true,
      persistAcrossSessions: true,
    },
  ]);
}

function showEnable(context) {
  activeContext = { ...context, enabled: false };
  setStatus(
    "ready",
    "Brightspace detected",
    `Enable the dark theme only for ${context.url.hostname}.`,
  );
  actionButton.dataset.action = "enable";
  actionButton.textContent = "Enable on this Brightspace site";
  actionButton.hidden = false;
}

function showEnabled(context, newlyEnabled = false) {
  activeContext = { ...context, enabled: true };
  setStatus(
    "active",
    "Dark theme enabled",
    newlyEnabled
      ? `Enabled for ${context.url.hostname}. Reload the page if an embedded panel is still light.`
      : `Runs automatically whenever you visit ${context.url.hostname}.`,
  );
  actionButton.dataset.action = "disable";
  actionButton.textContent = "Disable on this site";
  actionButton.hidden = false;
}

async function initialize() {
  actionButton.hidden = true;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    setStatus("off", "No supported page", "Open your school's Brightspace site, then click this extension again.");
    return;
  }

  let url;
  try {
    url = new URL(tab.url);
  } catch {
    setStatus("off", "No supported page", "Open your school's Brightspace site, then click this extension again.");
    return;
  }

  if (url.protocol !== "https:") {
    setStatus("off", "HTTPS required", "Brightspace Dark+ only enables access on secure HTTPS sites.");
    return;
  }

  const pattern = patternForUrl(url);
  const context = {
    tabId: tab.id,
    url,
    pattern,
    scriptId: scriptIdForOrigin(url.origin),
  };

  if (await hasSiteAccess(pattern)) {
    await ensureRegistered(context);
    showEnabled(context);
    return;
  }

  let isBrightspace = false;
  try {
    isBrightspace = await pageLooksLikeBrightspace(tab.id);
  } catch {
    setStatus("off", "Page unavailable", "Chrome does not allow extensions to inspect this page.");
    return;
  }

  if (!isBrightspace) {
    setStatus("off", "Brightspace not detected", "No access was requested for this site.");
    return;
  }

  showEnable(context);
}

async function enableCurrentSite(context) {
  const granted = await chrome.permissions.request({ origins: [context.pattern] });
  if (!granted) {
    setStatus("off", "Access not granted", "The site was left unchanged. You can try again at any time.");
    return;
  }

  await ensureRegistered(context);
  await chrome.scripting.executeScript({
    target: { tabId: context.tabId },
    files: ["inject.js"],
  });
  showEnabled(context, true);
}

async function disableCurrentSite(context) {
  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [context.scriptId] });
  if (registered.length) {
    await chrome.scripting.unregisterContentScripts({ ids: [context.scriptId] });
  }
  await chrome.permissions.remove({ origins: [context.pattern] });
  activeContext = { ...context, enabled: false };
  setStatus(
    "off",
    "Disabled on this site",
    `Reload ${context.url.hostname} to remove the theme from the current page.`,
  );
  actionButton.dataset.action = "enable";
  actionButton.textContent = "Enable on this Brightspace site";
}

actionButton.addEventListener("click", async () => {
  if (!activeContext || actionButton.disabled) return;
  actionButton.disabled = true;
  try {
    if (activeContext.enabled) {
      await disableCurrentSite(activeContext);
    } else {
      await enableCurrentSite(activeContext);
    }
  } catch (error) {
    console.error("Brightspace Dark+ site access error", error);
    setStatus("error", "Could not update site access", "Chrome reported an unexpected permissions error. Please try again.");
  } finally {
    actionButton.disabled = false;
  }
});

initialize().catch((error) => {
  console.error("Brightspace Dark+ popup error", error);
  setStatus("error", "Could not inspect this tab", "Close the popup, reload Brightspace, and try again.");
});
