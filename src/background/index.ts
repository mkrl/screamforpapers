import {storageLocal, storageSync} from "../storage";
// @ts-ignore
import contentScript from '../content?script'

// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

chrome.runtime.onInstalled.addListener(() => {
    storageSync.get().then(console.log);
    storageLocal.get().then(console.log);
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
   .catch((error) => console.error(error));
chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        if (request.submitTalk) {
            console.log('Extension sidebar has requested to submit: ', request.submitTalk)
            if (tab.id) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: [contentScript]
                })
            }
        }
        if (request.requestTalk) {
            console.log('Registering a submit request from: ', sender)
            const { talkList, selectedTalk, personalInfo } = await storageLocal.get()
            const targetTalk = talkList?.find(talk => talk.id === selectedTalk)
            if (targetTalk && tab.id) {
                console.log('Sending back selected talk data...', targetTalk)
                await chrome.tabs.sendMessage(tab.id, { targetTalk, personalInfo })
            } else {
                console.error('Found no matching talk')
            }
        }
        return true
    }
);