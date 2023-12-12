import SidePanel from "../components/SidePanel.svelte";
import '../app.pcss'
import type {Talk} from "../storage";

type ContentScriptMessage = {
    started: Talk
}
async function render() {
    const target = document.getElementById("app");
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    if (target) {
        if (tab?.id) {
            try {
                // Trying to understand if the script is already injected
                const response = await chrome.tabs.sendMessage(tab.id, { status: "have you started yet?" });
                // Content script only responds with ContentScriptMessage
                console.log(response)
                new SidePanel({
                    target,
                    props: {
                        selectedTalk: response.started,
                        submitInitialized: true
                    }
                })
            } catch (e) {
                console.log('The tab has not yet started the submission process')
                new SidePanel({
                    target,
                })
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", render);
