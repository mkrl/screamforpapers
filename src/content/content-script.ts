import FillSelector from "../components/FillSelector.svelte";
import type {PersonalInfo, Talk} from "../storage";
import { createPopper } from '@popperjs/core';
import { writable } from 'svelte/store';
import css from '../content-styles.pcss?inline'

import {type FocusableTarget, isElementVisible} from "../tools/helpers";

type WorkerMessage = {
    targetTalk: Talk,
    personalInfo: PersonalInfo
}
type SidebarMessage = {
    status: string
}

const createTooltip = () => {
    const tooltip = document.createElement('div')
    const target = document.createElement('div')
    tooltip.className = 'rounded-lg shadow-md py-2 px-3 text-sm bg-gray-700 font-medium'
    tooltip.id = 'sfp-tooltip'
    tooltip.innerHTML = `<div class="sfp-tooltip-arrow" data-popper-arrow></div>`
    tooltip.append(target)
    document.body.append(tooltip)
    return { tooltip, target }
}

const drawTooltip = (target: Element, content: HTMLElement) => {
    createPopper(target, content, {
        placement: 'left',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10],
                },
            },
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['right'],
                },
            },
        ],
    });
}

// @TODO this generates MASSIVE bundle (170kb+) for content script since it's not possible to only detect used styles while inlining, but it prevents style leaks
const injectCss = () => {
    let style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
}

const onStart = async (request: WorkerMessage | SidebarMessage) => {
    if ('targetTalk' in request) {
        const {targetTalk, personalInfo} = request
        console.log('Initiating submission process with the following data: ', {targetTalk, personalInfo})

        // At this point we only expect messages from sidebar
        chrome.runtime.onMessage.addListener(async (_, __, sendResponse) => {
            sendResponse({ started: targetTalk })
        })

        injectCss()
        // @TODO: apply more sophisticated form detection method
        const formInputs = document.querySelectorAll<FocusableTarget>('input, textarea, [contenteditable]')
        const visibleInputs = Array.from(formInputs).filter(isElementVisible)

        const activeInput = writable(visibleInputs[0])

        const {target, tooltip} = createTooltip()
        new FillSelector({target, props: {activeTalk: targetTalk, personalInfo, activeInput}})


        drawTooltip(visibleInputs[0], tooltip)

        // Manual tooltip trigger
        // document.addEventListener('keydown', function(event) {
        //     if (event.altKey && event.key === 'q') {
        //         const activeElement = document.activeElement
        //         if (activeElement && activeElement.focus()) {
        //             activeInput.set(activeElement as FocusableTarget)
        //             drawTooltip(activeElement, tooltip)
        //         }
        //     }
        // });

        visibleInputs.forEach(input => {
            input.addEventListener('focus', () => {
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

