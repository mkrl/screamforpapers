import FillSelector from "../components/FillSelector.svelte";
import type {PersonalInfo, Talk} from "../storage";
import { createPopper } from '@popperjs/core';
import { writable } from 'svelte/store';

import {type FocusableTarget, isElementVisible} from "../tools/helpers";

type WorkerMessage = {
    targetTalk: Talk,
    personalInfo: PersonalInfo
}
type PopupMessage = {
    status: string
}

const createTooltip = () => {
    const tooltip = document.createElement('div')
    const target = document.createElement('div')
    const shadowRoot = target.attachShadow({ mode: "open" })
    tooltip.id = 'sfp-tooltip'
    tooltip.append(target)
    tooltip.style.zIndex = '9999'
    document.body.append(tooltip)
    return { tooltip, target: shadowRoot, container: target }
}

const drawTooltip = (target: Element, content: HTMLElement) => {
    content.style.display = 'block'
    const popper = createPopper(target, content, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 2],
                },
            },
        ],
    });
    // close tooltip when esc is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popper.destroy()
            content.style.display = 'none'
        }
    })
}

const onStart = async (request: WorkerMessage | PopupMessage) => {
    if ('targetTalk' in request) {
        const {targetTalk, personalInfo} = request
        console.log('Initiating submission process with the following data: ', {targetTalk, personalInfo})

        // At this point we only expect messages from the popup
        chrome.runtime.onMessage.addListener(async (_, __, sendResponse) => {
            sendResponse({ started: targetTalk })
        })


        // @TODO: apply more sophisticated form detection method
        const formInputs = document.querySelectorAll<FocusableTarget>('input, textarea, [contenteditable]')
        const visibleInputs = Array.from(formInputs).filter(isElementVisible)

        const activeInput = writable(visibleInputs[0])

        const {target, tooltip, container} = createTooltip()
        new FillSelector({target, props: {activeTalk: targetTalk, personalInfo, activeInput}})


        drawTooltip(visibleInputs[0], tooltip)
        visibleInputs[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

        const width = visibleInputs[0].getBoundingClientRect().width
        container.style.width = `${width}px`

        visibleInputs.forEach(input => {
            input.setAttribute('autocomplete', 'one-time-code')
            input.addEventListener('focus', () => {
                const width = input.getBoundingClientRect().width
                container.style.width = `${width}px`
                activeInput.set(input)
                drawTooltip(input, tooltip)
            })
        })
    }
}

const init = async () => {
    await chrome.runtime.sendMessage({ requestTalk: 'please' });
    chrome.runtime.onMessage.addListener(onStart);
}

console.log('I have arrived!')
init()

