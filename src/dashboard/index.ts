import '../app.pcss'
import Dashboard from "../components/Dashboard.svelte";

async function render() {
    const target = document.getElementById("app");
    const forcedState =
        window.location.search === ''
            ? undefined
            : window.location.search.slice(1) as DashboardForcedState;
    if (target) {
        new Dashboard({ target, props: { forcedState } });
    }
}

document.addEventListener("DOMContentLoaded", render);
