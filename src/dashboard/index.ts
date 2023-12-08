import SidePanel from "../components/SidePanel.svelte";
import '../app.pcss'

async function render() {
    const target = document.getElementById("app");

    console.log('Hola')
}

document.addEventListener("DOMContentLoaded", render);
