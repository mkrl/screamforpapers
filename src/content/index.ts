import FillSelector from "../components/FillSelector.svelte";
import type {PersonalInfo, Talk} from "../storage";

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import "./styles.css";

const createTooltip = () => {
    const tooltip = document.createElement('div')
    const container = document.createElement('div')
    tooltip.id = 'sfp-tooltip'
    tooltip.innerHTML = `<div class="sfp-tooltip-arrow" data-popper-arrow></div>`
    tooltip.append(container)
    document.body.prepend(tooltip)

    return container
}

const init = async () => {
    await chrome.runtime.sendMessage({ requestTalk: 'please' });
    chrome.runtime.onMessage.addListener(
        async function(request: { targetTalk: Talk, personalInfo: PersonalInfo }, sender, sendResponse) {
            const { targetTalk, personalInfo } = request
            console.log('Initiating submission process with the following data: ', { targetTalk, personalInfo })

            const target = createTooltip()
            new FillSelector({ target, props: { activeTalk: targetTalk, personalInfo } })

            // @TODO this is where we inject popper
        }
    );
}

console.log('I have arrived!')
init()

