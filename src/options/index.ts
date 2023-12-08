import Options from "../components/Options.svelte";
import {storageLocal, storageSync} from "../storage";
import '../app.pcss'

async function render() {
    const target = document.getElementById("app");

    if (target) {
        const { token, repo } = await storageSync.get()
        const { lastSyncedAt, talkList } = await storageLocal.get()
        new Options({
            target,
            props: { token, repo, lastSyncedAt, talks: talkList },
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
