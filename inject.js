// Brightspace Dark+ — native D2L dark mode plus legacy-surface fallbacks.
(() => {
  "use strict";

  const STYLE_ID = "__bdp__";
  const FLASH_STYLE_ID = "__bdp_flash__";
  const VERSION = "1.1.0";
  const SURFACE_ATTRIBUTE = "data-bdp-dark-surface";
  const TEXT_ATTRIBUTE = "data-bdp-dark-text";
  const GRADIENT_ATTRIBUTE = "data-bdp-dark-gradient";
  const CONTRAST_ATTRIBUTE = "data-bdp-dark-contrast";
  const INSTANCE = Symbol.for("brightspace-dark-plus.instance");

  if (window[INSTANCE]) {
    window[INSTANCE].refresh();
    return;
  }

  const TOKEN_DECLARATIONS = `
    color-scheme: dark !important;

    --bdp-page: #161718;
    --bdp-surface: #202122;
    --bdp-surface-raised: #27292b;
    --bdp-surface-hover: #303335;
    --bdp-sunken: #0d0e0f;
    --bdp-text: #e3e9f1;
    --bdp-text-muted: #b1b9be;
    --bdp-text-faint: #90989d;
    --bdp-border: #494c4e;
    --bdp-border-subtle: #303335;
    --bdp-accent: #56b4f8;
    --bdp-accent-hover: #8acbfa;
    --bdp-focus: #29a6ff;

    /* Current Brightspace UI semantic tokens. */
    --d2l-theme-background-color-base: var(--bdp-page) !important;
    --d2l-theme-background-color-elevated: var(--bdp-surface) !important;
    --d2l-theme-background-color-floating: var(--bdp-surface) !important;
    --d2l-theme-background-color-sunken: var(--bdp-sunken) !important;
    --d2l-theme-background-color-interactive-faint-default: var(--bdp-surface) !important;
    --d2l-theme-background-color-interactive-faint-hover: var(--bdp-surface-hover) !important;
    --d2l-theme-background-color-interactive-highlighted: var(--bdp-page) !important;
    --d2l-theme-background-color-interactive-secondary-default: var(--bdp-surface-hover) !important;
    --d2l-theme-background-color-interactive-secondary-hover: var(--bdp-surface) !important;
    --d2l-theme-background-color-interactive-tertiary-default: transparent !important;
    --d2l-theme-background-color-interactive-tertiary-hover: var(--bdp-surface-hover) !important;
    --d2l-theme-border-color-emphasized: #6e7477 !important;
    --d2l-theme-border-color-focus: var(--bdp-focus) !important;
    --d2l-theme-border-color-standard: var(--bdp-border) !important;
    --d2l-theme-border-color-subtle: var(--bdp-border-subtle) !important;
    --d2l-theme-brand-color-highlight: var(--bdp-page) !important;
    --d2l-theme-brand-color-primary-default: #29a6ff !important;
    --d2l-theme-brand-color-primary-hover: #56b4f8 !important;
    --d2l-theme-icon-color-faint: var(--bdp-border) !important;
    --d2l-theme-icon-color-standard: var(--bdp-text-muted) !important;
    --d2l-theme-text-color-interactive-default: var(--bdp-accent) !important;
    --d2l-theme-text-color-interactive-hover: var(--bdp-accent-hover) !important;
    --d2l-theme-text-color-static-faint: var(--bdp-text-faint) !important;
    --d2l-theme-text-color-static-inverted: var(--bdp-page) !important;
    --d2l-theme-text-color-static-standard: var(--bdp-text) !important;
    --d2l-theme-text-color-static-subtle: var(--bdp-text-muted) !important;
    --d2l-theme-badge-background-color: var(--bdp-surface-hover) !important;
    --d2l-theme-badge-text-color: var(--bdp-text) !important;

    /* Older component-level tokens still used by some Brightspace pages. */
    --d2l-card-background-color: var(--bdp-surface) !important;
    --d2l-card-content-background-color: var(--bdp-surface) !important;
    --d2l-dialog-background-color: var(--bdp-surface) !important;
    --d2l-dropdown-content-background-color: var(--bdp-surface) !important;
    --d2l-input-background-color: var(--bdp-surface-raised) !important;
    --d2l-menu-background-color: var(--bdp-surface) !important;
    --d2l-menu-background-color-hover: var(--bdp-surface-hover) !important;
    --d2l-table-background-color: var(--bdp-surface) !important;
    --d2l-tabs-background-color: var(--bdp-surface) !important;
  `;

  const INLINE_LIGHT_BACKGROUND_SELECTORS = `
    [style*="background-color: white" i],
    [style*="background-color: #fff" i],
    [style*="background-color: rgb(255, 255, 255)" i]
  `;

  const DOC_CSS = `
    :root {
      ${TOKEN_DECLARATIONS}
      accent-color: var(--bdp-accent);
      background: var(--bdp-page) !important;
    }

    html,
    body,
    #d2l_body,
    .d2l-body,
    .d2l-page-bg,
    .d2l-page-main {
      background-color: var(--bdp-page) !important;
      color: var(--bdp-text) !important;
    }

    body {
      scrollbar-color: var(--bdp-border) var(--bdp-page);
    }

    ::selection {
      background: #185f8f !important;
      color: #ffffff !important;
    }

    /* Carleton-specific wordmark correction; other institutions keep their branding untouched. */
    html[data-bdp-carleton] img[alt="My Home"][src*="/theme/viewimage/"] {
      filter: invert(0.9) hue-rotate(180deg) brightness(1.05) contrast(0.95) !important;
      opacity: 0.98;
    }

    a:not([role="button"]) {
      color: var(--bdp-accent) !important;
    }

    a:not([role="button"]):hover {
      color: var(--bdp-accent-hover) !important;
    }

    hr,
    .d2l-separator,
    d2l-page-header-separator {
      border-color: var(--bdp-border-subtle) !important;
    }

    /* Main Brightspace shells and legacy widgets. */
    .d2l-navigation,
    .d2l-navigation-s,
    .d2l-navigation-main-header,
    d2l-card,
    d2l-enrollment-card,
    d2l-my-courses-enrollment-card,
    .d2l-widget,
    .d2l-tile,
    .d2l-box,
    .d2l-box-layout,
    .d2l-container,
    .d2l-content-panel,
    .d2l-dialog,
    .d2l-dropdown-content,
    .d2l-datalist,
    .d2l-datalist-item-content,
    .d2l-itemlist,
    .d2l-grid-container,
    .d2l-collapsepane,
    .d2l-le-content-block,
    .d2l-le-TreeAccordionItem,
    .d2l-homepage-header-wrapper,
    [role="dialog"],
    [role="menu"],
    [role="listbox"],
    [role="tooltip"],
    [popover] {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    .d2l-navigation-s,
    .d2l-navigation-main-header,
    .d2l-widget,
    .d2l-tile,
    .d2l-dialog,
    [role="dialog"],
    [popover] {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.42) !important;
    }

    /* Unknown legacy surfaces found by the runtime color check. */
    [${SURFACE_ATTRIBUTE}] {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    [${TEXT_ATTRIBUTE}] {
      color: var(--bdp-text) !important;
    }

    [${TEXT_ATTRIBUTE}][aria-disabled="true"],
    [${TEXT_ATTRIBUTE}][disabled] {
      color: var(--bdp-text-faint) !important;
    }

    [${CONTRAST_ATTRIBUTE}] {
      color: var(--bdp-adaptive-color) !important;
    }

    html[data-bdp-dark-mode] .d2l-twopanelselector-side,
    html[data-bdp-dark-mode] [${GRADIENT_ATTRIBUTE}] {
      background-color: var(--bdp-surface) !important;
      background-image: linear-gradient(
        to right,
        rgba(32, 33, 34, 0.12) 0%,
        var(--bdp-surface) 320px
      ) !important;
    }

    ${INLINE_LIGHT_BACKGROUND_SELECTORS} {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    /* Tables, grading grids, discussion lists, and calendars. */
    table,
    thead,
    tbody,
    tfoot,
    tr,
    td,
    th,
    .d2l-table,
    .d2l-grid {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    thead,
    th,
    .d2l-grid-header {
      background-color: var(--bdp-surface-raised) !important;
    }

    tbody tr:hover,
    .d2l-datalist-item:hover,
    .d2l-grid-row:hover {
      background-color: var(--bdp-surface-hover) !important;
    }

    /* Legacy navigation and calendar controls have late-loading light rules. */
    html[data-bdp-dark-mode] #AgendaPageViewSelector,
    html[data-bdp-dark-mode] #DayPageViewSelector,
    html[data-bdp-dark-mode] #MonthPageViewSelector,
    html[data-bdp-dark-mode] #ListPageViewSelector,
    html[data-bdp-dark-mode] a.d2l-iterator-button {
      background-color: var(--bdp-surface-raised) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    html[data-bdp-dark-mode] #WeekPageViewSelector,
    html[data-bdp-dark-mode] .d2l-button-filter-selected,
    html[data-bdp-dark-mode] a.d2l-iterator-button:hover,
    html[data-bdp-dark-mode] a.d2l-iterator-button:focus {
      background-color: var(--bdp-surface-hover) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    html[data-bdp-dark-mode] .d2l-le-calendar-today {
      background-color: var(--bdp-surface-raised) !important;
      color: var(--bdp-text) !important;
    }

    html[data-bdp-dark-mode] .d2l-column-side-bg,
    html[data-bdp-dark-mode] .d2l-column-side {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    html[data-bdp-dark-mode] .d2l-twopanelselector-side-bg.d2l-twopanelselector-side-sep,
    html[data-bdp-dark-mode] .d2l-twopanelselector-side.d2l-twopanelselector-side-sep {
      border-color: var(--bdp-border-subtle) !important;
    }

    /* Brightspace uses a white edge fade when breadcrumbs overflow. */
    html[data-bdp-dark-mode] d2l-breadcrumbs::after {
      background: linear-gradient(
        to right,
        rgba(32, 33, 34, 0),
        var(--bdp-surface)
      ) !important;
    }

    /* Preserve course category colours while keeping event labels readable. */
    html[data-bdp-dark-mode] a.d2l-le-calendar-event,
    html[data-bdp-dark-mode] a.d2l-le-calendar-event:hover,
    html[data-bdp-dark-mode] a.d2l-le-calendar-event:focus,
    html[data-bdp-dark-mode] a.d2l-le-calendar-event *,
    html[data-bdp-dark-mode] a.d2l-le-calendar-event:hover *,
    html[data-bdp-dark-mode] a.d2l-le-calendar-event:focus * {
      color: #000000 !important;
      text-shadow: none !important;
    }

    /* Some courses add their selected-row gradient after the base theme. */
    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-Selected,
    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-SelectedRoot {
      background-color: var(--bdp-surface-hover) !important;
      background-image: linear-gradient(
        to right,
        var(--bdp-surface-hover),
        var(--bdp-surface-raised)
      ) !important;
      color: var(--bdp-text) !important;
    }

    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-Selected > .d2l-le-TreeAccordionItem-anchor::before,
    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-SelectedRoot > .d2l-le-TreeAccordionItem-anchor::before {
      background-color: var(--bdp-surface-hover) !important;
      background-image: linear-gradient(
        to right,
        var(--bdp-surface-hover),
        var(--bdp-surface-raised)
      ) !important;
    }

    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-Selected > .d2l-le-TreeAccordionItem-anchor::after,
    html[data-bdp-dark-mode] .d2l-le-TreeAccordionItem-SelectedRoot > .d2l-le-TreeAccordionItem-anchor::after {
      width: 0 !important;
      height: 0 !important;
      background: none !important;
      border-top: 15px solid transparent !important;
      border-bottom: 15px solid transparent !important;
      border-left: 16px solid var(--bdp-surface-raised) !important;
    }

    /* Legacy filter buttons can otherwise inherit a light foreground and
       background from separate late-loading stylesheets. */
    html[data-bdp-dark-mode] .vui-button:not(.vui-button-primary):not(.d2l-button-primary):not(.d2l-button-filter-selected):not([aria-pressed="true"]):not([disabled]) {
      background-color: var(--bdp-surface-raised) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    html[data-bdp-dark-mode] .vui-button:not(.vui-button-primary):not(.d2l-button-primary):not(.d2l-button-filter-selected):not([aria-pressed="true"]):not([disabled]):hover,
    html[data-bdp-dark-mode] .vui-button:not(.vui-button-primary):not(.d2l-button-primary):not(.d2l-button-filter-selected):not([aria-pressed="true"]):not([disabled]):focus {
      background-color: var(--bdp-surface-hover) !important;
      color: var(--bdp-text) !important;
    }

    html[data-bdp-dark-mode] .d2l-vtoc-module-title,
    html[data-bdp-dark-mode] .d2l-vtoc-module-title * {
      color: var(--bdp-accent) !important;
    }

    html[data-bdp-dark-mode] .list-group-item.list-group-item-action.active,
    html[data-bdp-dark-mode] .list-group-item.list-group-item-action.active * {
      color: var(--bdp-sunken) !important;
      text-shadow: none !important;
    }

    html[data-bdp-dark-mode] .list-group-item.list-group-item-action.active {
      background-color: var(--bdp-accent) !important;
      border-color: var(--bdp-accent) !important;
    }

    html[data-bdp-dark-mode] .d2l-le-calendar-header-abbr {
      color: var(--bdp-text-muted) !important;
    }

    html[data-bdp-dark-mode] .d2l-le-calendar-sep {
      background-color: var(--bdp-border) !important;
      border-color: var(--bdp-border) !important;
    }

    html[data-bdp-dark-mode] .d2l-organization-image,
    html[data-bdp-dark-mode] .d2l-course-banner,
    html[data-bdp-dark-mode] .tox-edit-area,
    html[data-bdp-dark-mode] iframe.tox-edit-area__iframe {
      background-color: var(--bdp-surface-raised) !important;
    }

    /* Native and legacy form controls. D2L web components use the tokens above. */
    input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
    select,
    textarea,
    option,
    button:not(.d2l-button-primary):not([primary]) {
      background-color: var(--bdp-surface-raised) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--bdp-text-faint) !important;
      opacity: 1 !important;
    }

    input:disabled,
    select:disabled,
    textarea:disabled,
    button:disabled {
      color: var(--bdp-text-faint) !important;
      opacity: 0.72 !important;
    }

    pre,
    code,
    kbd,
    samp,
    blockquote {
      background-color: var(--bdp-sunken) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    iframe {
      background-color: var(--bdp-page) !important;
      color-scheme: dark !important;
    }

    :focus-visible {
      outline-color: var(--bdp-focus) !important;
    }
  `;

  const SHADOW_CSS = `
    :host {
      ${TOKEN_DECLARATIONS}
      color: var(--bdp-text);
    }

    :host(d2l-card),
    :host(d2l-enrollment-card),
    :host(d2l-my-courses-enrollment-card) {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    *,
    *::before,
    *::after {
      border-color: var(--bdp-border-subtle);
    }

    a:not([role="button"]) {
      color: var(--bdp-accent) !important;
    }

    a:not([role="button"]):hover {
      color: var(--bdp-accent-hover) !important;
    }

    /* The university logo is a light raster asset, so invert luminance only. */
    img[alt="My Home"][src*="/theme/viewimage/"] {
      filter: invert(0.9) hue-rotate(180deg) brightness(1.05) contrast(0.95) !important;
      opacity: 0.98;
    }

    /* Brightspace's loader uses presentation fills instead of theme tokens. */
    :host(d2l-loading-spinner) .outer-circle,
    :host(d2l-loading-spinner) .slice path:first-child {
      fill: var(--bdp-surface-raised) !important;
    }

    :host(d2l-loading-spinner) .slice path:last-child {
      fill: var(--bdp-accent) !important;
    }

    :host(d2l-loading-spinner) .inner-circle {
      stroke: var(--bdp-accent) !important;
    }

    .d2l-card-container,
    d2l-card,
    d2l-enrollment-card,
    d2l-my-courses-enrollment-card,
    .d2l-card-link-container,
    .d2l-card-content,
    .d2l-card-header,
    .d2l-enrollment-card-content-flex,
    .d2l-dialog,
    .d2l-dialog-content,
    .dropdown-content-layout,
    .d2l-dropdown-content,
    .d2l-hierarchical-view-container,
    .d2l-menu,
    .d2l-menu-item,
    .d2l-table-wrapper,
    .d2l-tabs-layout,
    .d2l-tab-panel-content,
    [part~="container"],
    [part~="content"],
    [part~="surface"],
    [role="dialog"],
    [role="menu"],
    [role="listbox"],
    [role="tooltip"] {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    .d2l-card-container,
    .d2l-dialog,
    .dropdown-content-layout,
    [role="dialog"],
    [role="menu"],
    [role="listbox"] {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.42) !important;
    }

    [${SURFACE_ATTRIBUTE}] {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    [${TEXT_ATTRIBUTE}] {
      color: var(--bdp-text) !important;
    }

    [${CONTRAST_ATTRIBUTE}] {
      color: var(--bdp-adaptive-color) !important;
    }

    .d2l-twopanelselector-side,
    [${GRADIENT_ATTRIBUTE}] {
      background-color: var(--bdp-surface) !important;
      background-image: linear-gradient(
        to right,
        rgba(32, 33, 34, 0.12) 0%,
        var(--bdp-surface) 320px
      ) !important;
    }

    .d2l-organization-image,
    .d2l-course-banner,
    .tox-edit-area,
    iframe.tox-edit-area__iframe {
      background-color: var(--bdp-surface-raised) !important;
    }

    ${INLINE_LIGHT_BACKGROUND_SELECTORS} {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
    select,
    textarea,
    option {
      background-color: var(--bdp-surface-raised) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border) !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--bdp-text-faint) !important;
      opacity: 1 !important;
    }

    table,
    thead,
    tbody,
    tfoot,
    tr,
    td,
    th {
      background-color: var(--bdp-surface) !important;
      color: var(--bdp-text) !important;
      border-color: var(--bdp-border-subtle) !important;
    }

    thead,
    th {
      background-color: var(--bdp-surface-raised) !important;
    }

    :focus-visible {
      outline-color: var(--bdp-focus) !important;
    }
  `;

  const SURFACE_TAGS = new Set([
    "body",
    "main",
    "section",
    "article",
    "aside",
    "nav",
    "header",
    "footer",
    "dialog",
    "fieldset",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "td",
    "th",
  ]);

  const SURFACE_HINT = /(?:^|[-_\s])(card|container|content|dialog|drawer|dropdown|flyout|grid|header|footer|list|menu|modal|module|navigation|panel|popover|sidebar|surface|table|tile|toolbar|tooltip|widget)(?:$|[-_\s])/i;
  const STATUS_HINT = /(?:^|[-_\s])(alert|danger|error|info|success|warning)(?:$|[-_\s])/i;
  const TEXT_TAGS = new Set([
    "a",
    "button",
    "caption",
    "dd",
    "div",
    "dt",
    "em",
    "figcaption",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "label",
    "legend",
    "li",
    "p",
    "small",
    "span",
    "strong",
    "td",
    "th",
    "time",
  ]);

  const observedRoots = new WeakSet();
  const watchedCustomElements = new WeakSet();
  const pendingNodes = new Set();
  let flushScheduled = false;
  let lastUrl = location.href;

  function parseRgb(value) {
    const match = value.match(
      /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d+(?:\.\d+)?))?\s*\)$/i,
    );
    if (!match) return null;
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    };
  }

  function isLightNeutral(value) {
    const color = parseRgb(value);
    if (!color || color.a < 0.35) return false;
    const minimum = Math.min(color.r, color.g, color.b);
    const maximum = Math.max(color.r, color.g, color.b);
    return minimum >= 238 && maximum - minimum <= 18;
  }

  function isDarkNeutral(value) {
    const color = parseRgb(value);
    if (!color || color.a < 0.35) return false;
    const minimum = Math.min(color.r, color.g, color.b);
    const maximum = Math.max(color.r, color.g, color.b);
    return maximum <= 112 && maximum - minimum <= 42;
  }

  function hasLightNeutralGradient(value) {
    if (!/gradient/i.test(value) || /url\(/i.test(value)) return false;
    const colors = value.match(/rgba?\([^)]*\)/gi) || [];
    return colors.some(isLightNeutral);
  }

  function relativeLuminance(color) {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return (
      0.2126 * channel(color.r) +
      0.7152 * channel(color.g) +
      0.0722 * channel(color.b)
    );
  }

  function contrastRatio(first, second) {
    const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
    const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
    return (lighter + 0.05) / (darker + 0.05);
  }

  function compositeColor(foreground, background) {
    const alpha = Math.max(0, Math.min(1, foreground.a ?? 1));
    return {
      r: foreground.r * alpha + background.r * (1 - alpha),
      g: foreground.g * alpha + background.g * (1 - alpha),
      b: foreground.b * alpha + background.b * (1 - alpha),
      a: 1,
    };
  }

  function effectiveBackground(element) {
    const layers = [];
    for (let current = element; current; current = current.parentElement) {
      let color;
      try {
        color = parseRgb(getComputedStyle(current).backgroundColor);
      } catch {
        continue;
      }
      if (!color || color.a <= 0) continue;
      layers.push(color);
      if (color.a >= 0.99) break;
    }

    let result = { r: 22, g: 23, b: 24, a: 1 };
    for (let index = layers.length - 1; index >= 0; index -= 1) {
      result = compositeColor(layers[index], result);
    }
    return result;
  }

  function minimumTextContrast() {
    // Use the normal-text target everywhere. Large authored text can meet the
    // lower WCAG threshold and still look muddy against Brightspace surfaces.
    return 4.5;
  }

  function accessibleColor(foreground, background, minimum) {
    const target = relativeLuminance(background) < 0.5 ? 255 : 0;
    for (let step = 1; step <= 20; step += 1) {
      const amount = step / 20;
      const candidate = {
        r: foreground.r + (target - foreground.r) * amount,
        g: foreground.g + (target - foreground.g) * amount,
        b: foreground.b + (target - foreground.b) * amount,
        a: 1,
      };
      if (contrastRatio(candidate, background) >= minimum) {
        return `rgb(${Math.round(candidate.r)}, ${Math.round(candidate.g)}, ${Math.round(candidate.b)})`;
      }
    }
    return target === 255 ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
  }

  function elementDescriptor(element) {
    const className =
      typeof element.className === "string" ? element.className : "";
    return `${element.id || ""} ${className} ${element.getAttribute("role") || ""}`;
  }

  function isSurfaceCandidate(element) {
    const tag = element.localName;
    if (!tag || ["img", "picture", "svg", "canvas", "video", "source"].includes(tag)) {
      return false;
    }
    if (SURFACE_TAGS.has(tag)) return true;
    if (SURFACE_HINT.test(`${tag} ${elementDescriptor(element)}`)) return true;
    if (tag !== "div") return false;

    const hasDirectText = Array.from(element.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );
    return hasDirectText || (element.childElementCount > 0 && element.textContent.trim());
  }

  function isTextCandidate(element) {
    if (!TEXT_TAGS.has(element.localName)) return false;
    if (STATUS_HINT.test(elementDescriptor(element))) return false;
    return Array.from(element.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );
  }

  function patchLegacyElement(element) {
    if (!(element instanceof Element) || !element.isConnected) return;
    if (element.id === STYLE_ID || element.id === FLASH_STYLE_ID) return;

    let style;
    try {
      style = getComputedStyle(element);
    } catch {
      return;
    }

    if (
      !element.hasAttribute(SURFACE_ATTRIBUTE) &&
      style.backgroundImage === "none" &&
      isSurfaceCandidate(element) &&
      isLightNeutral(style.backgroundColor)
    ) {
      element.setAttribute(SURFACE_ATTRIBUTE, "");
    }

    if (
      !element.hasAttribute(GRADIENT_ATTRIBUTE) &&
      isSurfaceCandidate(element) &&
      hasLightNeutralGradient(style.backgroundImage)
    ) {
      element.setAttribute(GRADIENT_ATTRIBUTE, "");
    }

    if (
      !element.hasAttribute(TEXT_ATTRIBUTE) &&
      isTextCandidate(element) &&
      isDarkNeutral(style.color)
    ) {
      element.setAttribute(TEXT_ATTRIBUTE, "");
    }

    if (
      !element.hasAttribute(TEXT_ATTRIBUTE) &&
      !element.hasAttribute(CONTRAST_ATTRIBUTE) &&
      isTextCandidate(element) &&
      !element.matches('[aria-disabled="true"], [disabled]')
    ) {
      const foreground = parseRgb(style.color);
      if (foreground) {
        const spread = Math.max(foreground.r, foreground.g, foreground.b) -
          Math.min(foreground.r, foreground.g, foreground.b);
        if (spread > 42) {
          const background = effectiveBackground(element);
          const paintedForeground = compositeColor(foreground, background);
          const minimum = minimumTextContrast(style);
          if (contrastRatio(paintedForeground, background) < minimum) {
            element.style.setProperty(
              "--bdp-adaptive-color",
              accessibleColor(foreground, background, minimum),
            );
            element.setAttribute(CONTRAST_ATTRIBUTE, "");
          }
        }
      }
    }
  }

  function ensureStyle(root, css) {
    let style = root.querySelector?.(`#${STYLE_ID}`);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.setAttribute("data-brightspace-dark-plus", "");
      style.textContent = css;
      root.appendChild(style);
    } else if (style.textContent !== css) {
      style.textContent = css;
    }
  }

  function ensureDocumentStyle() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      if (existing.textContent !== DOC_CSS) existing.textContent = DOC_CSS;
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.setAttribute("data-brightspace-dark-plus", "");
    style.textContent = DOC_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function watchCustomElement(element) {
    const tag = element.localName;
    if (
      !tag?.includes("-") ||
      watchedCustomElements.has(element)
    ) {
      return;
    }

    let registry;
    let whenDefined;
    try {
      registry = element.ownerDocument?.defaultView?.customElements;
      whenDefined = registry?.whenDefined;
    } catch {
      return;
    }

    if (typeof whenDefined !== "function") return;
    watchedCustomElements.add(element);

    try {
      Promise.resolve(whenDefined.call(registry, tag))
        .then(() => {
          if (element.isConnected) queueNode(element);
        })
        .catch(() => {
          // A removed frame can invalidate its registry while this promise is
          // pending. Mutation sweeps will still handle connected components.
        });
    } catch {
      // Some Brightspace pages replace the native registry with a legacy
      // web-component loader. Mutations and scheduled sweeps still cover it.
    }
  }

  function observeRoot(root) {
    if (observedRoots.has(root)) return;
    observedRoots.add(root);
    observer.observe(root, {
      attributes: true,
      attributeFilter: [
        "aria-expanded",
        "class",
        "data-color-mode",
        "hidden",
        "open",
        "style",
      ],
      childList: true,
      subtree: true,
    });
  }

  function installShadowRoot(root) {
    if (!root) return;
    ensureStyle(root, SHADOW_CSS);
    observeRoot(root);
  }

  function processTree(startRoot) {
    if (!startRoot) return;

    const roots = [startRoot];
    const scannedRoots = new Set();

    while (roots.length) {
      const root = roots.pop();
      if (!root || scannedRoots.has(root)) continue;
      scannedRoots.add(root);

      if (root instanceof ShadowRoot) {
        try {
          installShadowRoot(root);
        } catch {
          // A single non-standard component must not stop the remaining scan.
        }
      }

      const processElement = (element) => {
        try {
          patchLegacyElement(element);
        } catch {
          // Continue through components with unusual computed-style behavior.
        }

        try {
          watchCustomElement(element);
        } catch {
          // Legacy web-component shims can expose incomplete registries.
        }

        try {
          if (element.shadowRoot) roots.push(element.shadowRoot);
        } catch {
          // Ignore inaccessible component roots and continue with their peers.
        }
      };

      if (root instanceof Element) processElement(root);

      let elements;
      try {
        elements = root.querySelectorAll?.("*") || [];
      } catch {
        continue;
      }

      for (const element of elements) processElement(element);
    }
  }

  function flushPendingNodes() {
    flushScheduled = false;
    const nodes = Array.from(pendingNodes);
    pendingNodes.clear();
    for (const node of nodes) processTree(node);
  }

  function queueNode(node) {
    if (!node || (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE)) {
      return;
    }
    pendingNodes.add(node);
    if (flushScheduled) return;
    flushScheduled = true;
    requestAnimationFrame(flushPendingNodes);
  }

  function forceNativeDarkMode() {
    const root = document.documentElement;
    if (!root) return;
    if (root.getAttribute("data-color-mode") !== "dark") {
      root.setAttribute("data-color-mode", "dark");
    }
    root.setAttribute("data-bdp-dark-mode", "");
    root.setAttribute("data-bdp-version", VERSION);
    if (window.location.hostname === "brightspace.carleton.ca") {
      root.setAttribute("data-bdp-carleton", "");
    } else {
      root.removeAttribute("data-bdp-carleton");
    }
  }

  function refresh() {
    forceNativeDarkMode();
    ensureDocumentStyle();
    queueNode(document);
  }

  function refreshComponentTrees() {
    forceNativeDarkMode();
    ensureDocumentStyle();
    processTree(document);
  }

  function scheduleFilterRefresh() {
    refreshComponentTrees();
    requestAnimationFrame(() => {
      refreshComponentTrees();
      requestAnimationFrame(refreshComponentTrees);
    });
    setTimeout(refreshComponentTrees, 150);
    setTimeout(refreshComponentTrees, 600);
    setTimeout(refreshComponentTrees, 1500);
  }

  function isCourseFilterControl(node) {
    if (!(node instanceof Element)) return false;
    return (
      node.getAttribute("role") === "tab" ||
      node.localName === "d2l-tab" ||
      node.id === "search-my-enrollments" ||
      node.id === "search-my-pinned-enrollments" ||
      node.id?.startsWith("BySemester")
    );
  }

  function handleCourseFilterInteraction(event) {
    if (event.composedPath().some(isCourseFilterControl)) {
      scheduleFilterRefresh();
    }
  }

  const observer = new MutationObserver((mutations) => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      refresh();
    }

    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "data-color-mode") forceNativeDarkMode();
        queueNode(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) queueNode(node);
    }
  });

  const flashStyle = document.createElement("style");
  flashStyle.id = FLASH_STYLE_ID;
  flashStyle.textContent = `
    html, body {
      background: #161718 !important;
      color-scheme: dark !important;
    }
  `;
  (document.head || document.documentElement).appendChild(flashStyle);

  forceNativeDarkMode();
  ensureDocumentStyle();
  observeRoot(document.documentElement);
  processTree(document);

  window[INSTANCE] = { refresh };

  const finishInitialPass = () => {
    refresh();
    requestAnimationFrame(() => {
      processTree(document);
      document.getElementById(FLASH_STYLE_ID)?.remove();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", finishInitialPass, { once: true });
  } else {
    finishInitialPass();
  }

  window.addEventListener("pageshow", refresh);
  window.addEventListener("load", () => {
    refresh();
    setTimeout(refresh, 500);
    setTimeout(refresh, 2000);
    setTimeout(refresh, 6000);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh();
  });

  document.addEventListener("click", handleCourseFilterInteraction, true);
  document.addEventListener("keyup", handleCourseFilterInteraction, true);

  console.info(
    `[Brightspace Dark+] v${VERSION} native dark mode and legacy fallbacks active.`,
  );
})();
