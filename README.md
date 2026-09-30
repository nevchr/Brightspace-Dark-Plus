# Brightspace Dark+

An opt-in Chrome Manifest V3 extension that applies an adaptive dark theme to Brightspace learning environments. Version 1.1.0 supports modern components and legacy pages. It does not collect course records or operate an account.

## Install from source

1. Clone this repository.
2. Open Chrome extensions and enable Developer mode.
3. Choose **Load unpacked** and select this repository folder.
4. Open a Brightspace page and use the toolbar popup to enable the theme for its HTTPS site. Access is requested per site; the extension does not have automatic access to every website.

Run `node --test tests/popup.test.js` for the popup permission-flow checks. See [TEST_INSTRUCTIONS.md](TEST_INSTRUCTIONS.md), [PRIVACY_POLICY.md](PRIVACY_POLICY.md), and [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for verification and store preparation. Store submission is separate from source publication.

Historical packaged ZIPs remain local under the ignored `release/` directory; they are not needed to load this source extension.
