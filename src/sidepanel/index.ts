import SidePanel from "../components/SidePanel.svelte";

async function render() {
    const target = document.getElementById("app");

    if (target) {
        new SidePanel({
            target,
        });
    }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

document.addEventListener("DOMContentLoaded", render);
