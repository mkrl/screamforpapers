import StartPanel from '../components/StartPanel.svelte'
import '../app.pcss'
import type { Talk } from '../storage'

type ContentScriptMessage = {
  started: Talk
}
async function render() {
  const target = document.getElementById('app')
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  if (target) {
    if (tab?.id) {
      try {
        // Trying to understand if the script is already injected
        const response: ContentScriptMessage = await chrome.tabs.sendMessage(
          tab.id,
          { status: 'have you started yet?' }
        )
        // Content script only responds with ContentScriptMessage
        new StartPanel({
          target,
          props: {
            selectedTalk: response.started,
            submitInitialized: true,
          },
        })
      } catch (e) {
        console.log('The tab has not yet started the submission process')
        new StartPanel({
          target,
        })
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', render)
