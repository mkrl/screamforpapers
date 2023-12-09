import {storageLocal, storageSync} from "../storage";
// @ts-ignore
import contentScript from '../content/content-script.ts?script'

// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

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

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
   .catch((error) => console.error(error));

// Completely stupid hack, openPanelOnActionClick: true is only able to open a panel that persists through all the tabs
// the only way to avoid this is to remove side_panel.default_path from manifest, set openPanelOnActionClick to true and then
// for every tab you navigate to you would set tabId for the side panel in the listener
//
// It is also not possible to use chrome.sidePanel.open with the needed tab.id because it demands user interaction first.
// Clicking on the action (chrome.action.onClicked) is not considered a user interaction... however it works on the second attempt
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: 'src/sidepanel/sidepanel.html',
        enabled: true
    });
});

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