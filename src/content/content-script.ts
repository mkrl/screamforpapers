import FillSelector from '../components/FillSelector.svelte'
import type { PersonalInfo, Talk } from '../storage'
import { createPopper } from '@popperjs/core'
import { writable } from 'svelte/store'

import {
  type FocusableTarget,
  isElementVisible,
  isEventInElement,
} from '../tools/helpers'

type WorkerMessage = {
  targetTalk: Talk
  personalInfo: PersonalInfo
}
type PopupMessage = {
  status: string
}

const createTooltip = () => {
  const tooltip = document.createElement('div')
  const target = document.createElement('div')
  const shadowRoot = target.attachShadow({ mode: 'open' })
  tooltip.id = 'sfp-tooltip'
  tooltip.append(target)
  tooltip.style.zIndex = '9999'
  document.body.append(tooltip)
  return { tooltip, target: shadowRoot, container: target }
}

const drawTooltip = (
  target: Element,
  content: HTMLElement,
  validTargets: Element[]
) => {
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
  })

  const onClickOutsideListener = (e: MouseEvent) => {
    if (
      !isEventInElement(e, content) &&
      !validTargets.some((el) => isEventInElement(e, el))
    ) {
      document.body.removeEventListener('mouseup', onClickOutsideListener)
      popper.destroy()
      content.style.display = 'none'
    }
  }

  const onChangeListener = () => {
    popper.destroy()
    content.style.display = 'none'
    target.removeEventListener('keypress', onChangeListener)
  }

  document.body.addEventListener('mouseup', onClickOutsideListener)
  target.addEventListener('keypress', onChangeListener)

  // close tooltip when esc is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.removeEventListener('mouseup', onClickOutsideListener)
      popper.destroy()
      content.style.display = 'none'
    }
  })
}

const onStart = async (request: WorkerMessage | PopupMessage) => {
  if ('targetTalk' in request) {
    const { targetTalk, personalInfo } = request

    // At this point we only expect messages from the popup
    chrome.runtime.onMessage.addListener(async (_, __, sendResponse) => {
      sendResponse({ started: targetTalk })
    })

    // @TODO: apply more sophisticated form detection method
    const formInputs = document.querySelectorAll<FocusableTarget>(
      'input, textarea, [contenteditable]'
    )
    const visibleInputs = Array.from(formInputs).filter(isElementVisible)

    const activeInput = writable(visibleInputs[0])

    const { target, tooltip, container } = createTooltip()
    new FillSelector({
      target,
      props: { activeTalk: targetTalk, personalInfo, activeInput },
    })

    // Draw the fist tooltip and scroll to it
    drawTooltip(visibleInputs[0], tooltip, visibleInputs)
    visibleInputs[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })

    // Set the container width to the width of the first input
    const width = visibleInputs[0].getBoundingClientRect().width
    container.style.width = `${width}px`

    // Draw the tooltip on focus for the rest of the inputs
    visibleInputs.forEach((input) => {
      input.setAttribute('autocomplete', 'one-time-code')
      input.addEventListener('focus', () => {
        const width = input.getBoundingClientRect().width
        container.style.width = `${width}px`
        activeInput.set(input)
        drawTooltip(input, tooltip, visibleInputs)
      })
    })
  }
}

const init = async () => {
  await chrome.runtime.sendMessage({ requestTalk: 'please' })
  chrome.runtime.onMessage.addListener(onStart)
}

init()
