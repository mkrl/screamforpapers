# Scream for Papers

![Scream for Papers](./media/icon-128-store.png)

Save up on time while filling out long and repetitive CFP forms. You deserve better!

The features include:

* Assisted form filling for your CFP and personal data
* Manual submission tracking in the dashboard
* Wishlist for CFPs you're interested in
* Store your CFPs in a Github repository and keep track of revisions you've submitted

## Installation

You can grab the latest published version from the [Chrome Web Store](https://chromewebstore.google.com/detail/scream-for-papers/dggogdpgelafkkaekbbggifhbfljlldb?hl=en).

This should work for any Chromium-based browser, including Brave, Arc, Vivaldi, etc.

If you're willing to modify and build it yourself, see below.

## Building

Start with installing the dependencies:

```bash
npm i
```

For development, you can run the following command to start a live-reload server:

```bash
npm run dev
```

To build the extension, run:

```bash
npm run build
```

Either way, the output will be in the `dist` folder. You can load an unpacked extension into your browser following [these instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Development

Typescript and Svete are used for development. Bear in mind this is my first time using Svelte so expect the code to not be "idiomatic". You're more than welcome to [contribute](./CONTRIBUTING.md) and make it better!

The extension relies on background scripts to communicate with the content script.
