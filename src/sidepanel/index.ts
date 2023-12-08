import SidePanel from "../components/SidePanel.svelte";
import '../app.pcss'

async function render() {
    const target = document.getElementById("app");

    if (target) {
        new SidePanel({
            target,
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
