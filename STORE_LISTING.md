# Chrome Web Store Listing — Brightspace Dark+

## Product details

**Name**

Brightspace Dark+

**Summary**

A polished dark theme for Brightspace dashboards, courses, calendars, and legacy pages.

**Detailed description**

Brightspace Dark+ gives D2L Brightspace learning environments a consistent, comfortable dark appearance.

It automatically styles the areas students use most, while preserving readable contrast and the meaning of coloured calendar events.

Features:

- Dark styling for the home dashboard and course cards
- Improved course navigation and table-of-contents panels
- Dark calendar, assignment, content, and legacy-page surfaces
- Readable text on coloured calendar events
- Support for dynamically loaded content and embedded Brightspace frames
- Per-school site access that is granted only when the user enables it
- No tracking, analytics, advertising, or external data transmission

Install the extension, open your school's Brightspace site, click the Brightspace Dark+ toolbar icon, and choose **Enable on this Brightspace site**. Chrome grants access only to that school's HTTPS domain. The theme then applies automatically on future visits to the enabled site.

Institution-specific customizations can vary, so users are encouraged to report any surface that remains difficult to read.

This is an unofficial extension and is not affiliated with, endorsed by, or sponsored by D2L Corporation or any educational institution.

**Category**

Education

**Language**

English

## Graphic assets

- Store icon: `assets/icons/icon128.png`
- Screenshot 1: `store-assets/screenshot-dashboard-1280x800.png`
- Small promo tile: `store-assets/promo-small-440x280.jpg`
- Marquee promo tile: `store-assets/promo-marquee-1400x560.jpg`

The screenshot is an anonymized edit of the live extension experience. Course names, term labels, event titles, and counts were replaced with fictional examples; the dark-mode layout and styling remain representative. It contains no student information. Additional interface mockups in `store-assets/source` are design references and should not be uploaded as screenshots.

## Privacy practices

**Single purpose**

Applies an accessible dark visual theme to Brightspace pages on school sites that the user explicitly enables, including dashboards, courses, calendars, assignments, and embedded Brightspace content.

**Permission justification**

**`activeTab`** is used only when the user opens the extension popup. It checks the current page for general Brightspace/D2L interface markers and returns a yes-or-no result so the extension does not request access on unrelated websites.

**`scripting`** is required to register and run the packaged `inject.js` theme on a Brightspace site after the user grants access. It also applies the theme immediately to the current Brightspace tab.

**Optional host access (`https://*/*`)** allows the user to grant access to their school's specific HTTPS Brightspace domain at runtime. Brightspace supports both managed `*.brightspace.com` addresses and custom school domains, so the domain cannot be known when the extension is packaged. Access is requested only for the current detected Brightspace origin, never for every site at once, and it can be removed from the popup.

Page structure and visible content are processed locally in the browser only to update presentation and contrast. Nothing is stored or transmitted.

**Remote code**

No. All executable code is included in the extension package. The extension does not download or evaluate remote code.

**User data disclosure**

Disclose **Website content** because the extension locally processes the page DOM to apply its theme. Select **App functionality** as the only purpose. The extension does not collect or transmit this data off the user's device.

Certify that data is not sold, is not used outside the single purpose, is not used for creditworthiness or lending, and is not provided to people or third parties.

**Privacy policy URL**

`https://chrisneville.ca/brightspace-dark-plus/privacy/`

## Distribution

- Visibility for the first testing release: Unlisted
- Change to Public after the initial tester feedback is resolved
- Regions: All regions
- Pricing: Free
- In-app purchases: None

## Reviewer notes

Brightspace Dark+ has no account or external service. Open a Brightspace environment, click the toolbar icon, and select **Enable on this Brightspace site**. The popup first checks only for Brightspace/D2L markers, then Chrome requests permission for that exact HTTPS origin. Once granted, the packaged theme is registered for future visits and injected into the current tab. Reload once to cover embedded frames already present on the page.

On a non-Brightspace page, the popup reports **Brightspace not detected** and requests no site access. The package contains no remote code, analytics, tracking, advertisements, payments, storage, or network requests. Authenticated course surfaces require an account supplied by the reviewer's own Brightspace institution; no credentials are included.

## Optional links

- Homepage: `https://chrisneville.ca/brightspace-dark-plus/`
- Privacy policy: `https://chrisneville.ca/brightspace-dark-plus/privacy/`
- Support contact: `mailto:chris@chrisneville.ca`
