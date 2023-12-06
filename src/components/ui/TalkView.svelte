<script lang="ts">
    import type {Talk} from "../../storage";
    import {getTalkName, publicKeysOnly} from '../../tools/helpers.js'

    export let talk: Talk

</script>

{#if talk}
    <section class="talk">
        <h1>{getTalkName(talk)} @ <code><a href="{talk.__revision.link}" target="_blank">{talk.__revision.sha.slice(0,7)}</a></code></h1>
        {#each Object.keys(talk).filter(publicKeysOnly) as key}
            <h3>{key}</h3>
            <p>{talk[key]}</p>
        {/each}
    </section>
{/if}

<style>
    .talk {
        display: flex;
        flex-direction: column;
        box-shadow: 0px 3px 17px 0px #0000002b;
        padding: 0.3rem;
        border-radius: 3px;
    }
    .talk p {
        white-space: pre-line;
    }
</style>
