import FillSelector from "../components/FillSelector.svelte";
import type {PersonalInfo, Talk} from "../storage";
import { createPopper } from '@popperjs/core';
import { writable } from 'svelte/store';

import {isElementVisible} from "../tools/helpers";

const createTooltip = () => {
    const tooltip = document.createElement('div')
    const target = document.createElement('div')
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
        ],
    });
}

const onStart = async (request: { targetTalk: Talk, personalInfo: PersonalInfo }) => {
    const { targetTalk, personalInfo } = request
    console.log('Initiating submission process with the following data: ', { targetTalk, personalInfo })

    // @TODO: apply more sophisticated form detection method
    const formInputs = document.querySelectorAll('input, textarea')
    const visibleInputs = Array.from(formInputs).filter(isElementVisible)

    const activeInput = writable(visibleInputs[0])

    const { target, tooltip } = createTooltip()
    new FillSelector({ target, props: { activeTalk: targetTalk, personalInfo, activeInput } })


    drawTooltip(visibleInputs[0], tooltip)

    visibleInputs.forEach(input => {
        input.addEventListener('focus', () => {
            activeInput.set(input)
            drawTooltip(input, tooltip)
        })
    })
}

const init = async () => {
    await chrome.runtime.sendMessage({ requestTalk: 'please' });
    chrome.runtime.onMessage.addListener(onStart);
}

console.log('I have arrived!')
init()

