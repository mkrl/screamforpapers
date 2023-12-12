import {storageLocal, storageSync} from "../storage";
// @ts-ignore
import contentScript from '../content/content-script.ts?script'

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const { token, repo } = await storageSync.get()
        if (!token || !repo) {
            await chrome.tabs.create({
                url: "src/dashboard/dashboard.html?welcome"
            });
        }
    }
})

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        if (request.submitTalk) {
            console.log('Extension has requested to submit: ', request.submitTalk)
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