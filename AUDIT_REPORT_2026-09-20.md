# Brightspace Dark+ visual audit

**Baseline build:** 0.2.7  
**Final verified build:** 0.2.9  
**Date:** 2026-09-20 (America/Toronto)  
**Environment:** Live Carleton Brightspace in desktop Chrome, signed-in student account  
**Scope:** Baseline visual audit, extension remediation, and live computed-style, contrast, overflow, frame, and console regression checks. No Brightspace data was changed.

## Executive summary

The 0.2.7 baseline audit covered 18 visual states across dashboards, course content, all four main calendar views, assignments, grades, discussions, quizzes, settings, progress, and common overlays. It identified **3 P1**, **6 P2**, and **2 P3** findings.

All 11 findings were addressed in builds 0.2.8 and 0.2.9. The final 0.2.9 live regression passed on the affected desktop student surfaces. No extension-generated console errors occurred, and the previously reported `customElements.whenDefined` error did not recur.

## Final remediation status — build 0.2.9

| Area | Final live result |
|---|---|
| Legacy `.vui-button` controls | Pass — Course Schedule and Calendar Agenda unselected controls now use dark surfaces, light text, and dark borders. |
| Embedded active tab | Pass — `rgb(13,14,15)` text on `rgb(86,180,248)`, measured **8.54:1**. |
| Visual Table of Contents titles | Pass — contrast-aware accent adjustment measured **4.83:1** on the audited course homepage. |
| Selected content-row gradient and arrow | Pass — light gradient/arrow removed and replaced with dark selection styling. |
| Calendar weekday labels | Pass — muted light text (`rgb(177,185,190)`) on the dark grid. |
| Course-authored red text | Pass — adjusted to `rgb(218,88,92)` on `rgb(22,23,24)`, measured **4.73:1**. |
| Calendar separators | Pass — converted to the restrained `rgb(73,76,78)` border token. |
| Discussion/Progress white strip | Pass — traced to `d2l-breadcrumbs::after`; the white overflow fade is now a dark-surface fade. |
| Course-card and banner fallbacks | Pass — image wrappers now use a dark fallback (`rgb(39,41,43)`). |
| TinyMCE first-paint fallback | Pass — editor iframe wrapper and loaded editing surface render dark. |
| Loading indicator | Pass — audited homepage loader uses the theme accent instead of white. |

Static validation also passed: `inject.js` parses successfully, and the manifest/script versions both report `0.2.9`.

### Severity

- **P1 — fix before sharing:** invisible controls or severe text-contrast failures.
- **P2 — fix before calling the theme polished:** clearly visible artifacts or contrast below the target.
- **P3 — hardening:** transient/fallback surfaces that may flash white while content loads or fails.

## Baseline findings — build 0.2.7

| Priority | Area | Finding and evidence | Recommended correction |
|---|---|---|---|
| P1 | Course Content → Course Schedule | The unselected **Full Schedule** legacy `.vui-button` renders `rgb(227,233,241)` text on the same `rgb(227,233,241)` background: **1.00:1**. The selected alternate button is readable. | Add an explicit dark background and light foreground for unselected legacy `.vui-button` states without overriding selected/disabled states. |
| P1 | Calendar → Agenda | The unselected **Course** and **Category** group-by `.vui-button` controls are also white-on-white at **1.00:1**. The selected **Date** control is readable. | Cover the shared unselected legacy button state; verify hover, focus, selected, and disabled variants afterward. |
| P1 | Embedded course content | A Bootstrap-style `.list-group-item.list-group-item-action.active` uses accent text `rgb(86,180,248)` on `rgb(0,111,191)`: **2.30:1**. | Use near-black text on the medium-blue active background, or darken the active background enough to meet 4.5:1. |
| P2 | Course homepage | Visual Table of Contents titles (`.d2l-vtoc-module-title`) use `rgb(0,111,191)` on `rgb(32,33,34)`: **3.09:1**. | Map these links to the theme's brighter accent, such as `#56b4f8`, while preserving visited/focus cues. |
| P2 | Course Content → Course Schedule | The selected sidebar row still draws a light gradient and white arrow. The selected anchor's `::before` contains a transparent-to-`rgb(227,233,241)` gradient; `::after` contains the light SVG arrow. | Override the selected anchor pseudo-elements directly. Replace the gradient with a dark selection gradient and recolor or replace the arrow asset. |
| P2 | Calendar → Week | Monday–Friday labels (`.d2l-le-calendar-header-abbr`) are `rgb(102,102,102)` on `rgb(32,33,34)`: **2.81:1**. | Raise weekday-label brightness to the normal secondary-text token and check inactive/today/weekend states separately. |
| P2 | Embedded course content | One normal-weight, 19px course-authored red span is `rgb(205,32,38)` on `rgb(22,23,24)`: **3.27:1**. Two bold red items at the same size are borderline. | Apply a contrast-aware adjustment to authored foreground colours on dark backgrounds instead of indiscriminately preserving hard-coded colours. Target at least 4.5:1 for normal text. |
| P2 | Calendar → Week | Two `.d2l-le-calendar-sep` strips remain near-white (`rgb(239,239,239)`) and look harsh against the dark grid. | Theme separators to a restrained border token while retaining enough structure to distinguish all-day and timed regions. |
| P2 | Legacy two-panel headers | A narrow vertical white strip is visibly present near the right edge of the header on both **Discussion Topic** and **Progress Summary**. DOM and pseudo-element inspection did not identify a normal light surface; it appears consistent with a native overflow/scroll/fade paint artifact. | Reproduce with DevTools paint flashing or layer inspection. Start with the page-actions/overflow boundary and legacy two-panel containers; avoid a broad global scrollbar rule. |
| P3 | Dashboard/course banners | `.d2l-organization-image` thumbnail wrappers and `.d2l-course-banner` retain a very light computed fallback (`rgb(249,251,255)`) underneath their images. Images cover it normally, but missing or slow images may flash white. | Give image containers a dark fallback background before the image loads. |
| P3 | Assignment submission editor | `.tox-edit-area__iframe` itself computes to white even though its loaded `srcdoc` document is correctly themed dark. This can produce a brief white editor flash. | Set the TinyMCE iframe element/background wrapper dark in addition to theming the frame's inner document. |

## Baseline pages and states inspected

| Surface | Result |
|---|---|
| Main Brightspace homepage and My Courses cards | Pass, except P3 image fallbacks |
| Representative course homepage | Pass, except P2 Visual TOC title contrast and banner fallback |
| Course Content / Course Schedule legacy two-panel view | P1/P2 findings present |
| Individual topic shell and same-origin embedded lecture page | Shell passed; embedded active-tab and authored-red findings present |
| Calendar Week | Event-chip text is now black/readable; weekday and separator P2 findings remain |
| Calendar Month | Pass |
| Calendar Agenda | P1 group-by button failure present |
| Calendar List | Pass |
| Assignments list | Pass |
| Assignment submission form and TinyMCE editor | Pass, except P3 iframe fallback |
| Grades | Pass |
| Discussions list | Pass |
| Discussion topic | Pass, except recurring white-strip artifact |
| Quizzes list | Pass |
| Account Settings form | Pass |
| Progress Summary, side navigation, and charts | Pass, except recurring white-strip artifact |
| Course selector dropdown | Pass visually |
| Learner profile card overlay | Pass visually |

### Representative routes

- `https://brightspace.carleton.ca/d2l/home`
- `https://brightspace.carleton.ca/d2l/home/469115`
- `https://brightspace.carleton.ca/d2l/le/content/469115/Home`
- `https://brightspace.carleton.ca/d2l/le/content/451747/viewContent/4793114/View`
- `https://brightspace.carleton.ca/d2l/le/calendar/6606`
- `https://brightspace.carleton.ca/d2l/lms/dropbox/user/folders_list.d2l?ou=469115`
- `https://brightspace.carleton.ca/d2l/lms/dropbox/user/folder_submit_files.d2l?ou=469115&db=305591`
- `https://brightspace.carleton.ca/d2l/lms/grades/my_grades/main.d2l?ou=469115`
- `https://brightspace.carleton.ca/d2l/le/469115/discussions/List`
- `https://brightspace.carleton.ca/d2l/le/469115/discussions/topics/135951/View`
- `https://brightspace.carleton.ca/d2l/lms/quizzing/user/quizzes_list.d2l?ou=469115`
- `https://brightspace.carleton.ca/d2l/lp/preferences/preferences_main/preferences_main.d2l?ou=469115`
- `https://brightspace.carleton.ca/d2l/le/userprogress/151808/469115/Summary`

## Console and runtime observations

- Extension version `0.2.9` was confirmed on the final live regression pages.
- No errors attributable to Brightspace Dark+ appeared during the baseline or final verification.
- The previously reported `Cannot read properties of null (reading 'whenDefined')` error did not recur.
- Brightspace emitted a tooltip accessibility warning from D2L's `tooltip.js`.
- Kaltura emitted `$.ui.dialog not found` warnings from `jquery.patch.js`.
- Those two warnings originate from Brightspace/Kaltura scripts and are outside this extension's control.

## Completed remediation sequence

1. Fixed shared unselected `.vui-button` states and retested Course Schedule and Calendar Agenda.
2. Fixed embedded active-tab contrast.
3. Replaced the legacy selected-row gradient and arrow with dark styling.
4. Corrected Visual TOC and calendar weekday contrast.
5. Added contrast-aware handling for hard-coded course-authored colours.
6. Identified and replaced the breadcrumb overflow fade responsible for the white strip.
7. Softened calendar separators and added dark image/editor fallback surfaces.
8. Repeated the affected-route matrix on the final 0.2.9 build.

## Not verified in this pass

- Narrow/mobile layouts, browser zoom, or high text scaling.
- Calendar Day view as a separate mode; Week view covered the same grid family.
- Login/logout and logged-out pages.
- Notification/message/profile dropdown menus beyond the course selector and learner profile card.
- Starting or submitting a quiz, uploading/submitting an assignment, or creating a discussion post.
- Print views, instructor/admin-only tools, third-party LTI tools, and pages unavailable to this student account.
- Deliberately throttled slow-network first paint; P3 items are inferred from verified computed fallback colours.

## Release recommendation

Build 0.2.9 is suitable for a small tester rollout on the audited desktop student surfaces. The remaining risk is coverage rather than a known defect: mobile/narrow layouts, instructor/admin tools, logged-out pages, print views, third-party LTI tools, and intentionally throttled slow-network first paint remain unverified.

## Chrome Web Store packaging note

Release package 1.1.0 uses the same core injected theme logic that passed the final 0.2.9 live regression. It replaces the Carleton-only static match with an institution-neutral, permission-on-demand model: the popup checks the active page for general Brightspace/D2L markers, requests access only for the detected school's HTTPS origin, and registers the packaged theme for that user-enabled site. The Carleton wordmark correction is now explicitly restricted to Carleton's hostname so other institutional branding remains untouched.

The permission flow has automated coverage for unrelated pages, first-time enablement, persistent registration, immediate injection, and removal. Cross-institution visual compatibility is not yet verified because each school can customize Brightspace; Carleton remains the completed live regression environment. The package itself has not yet been uploaded to the Chrome Web Store or submitted for review.
