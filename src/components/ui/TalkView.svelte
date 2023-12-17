<script lang="ts">
    import type {Talk} from "../../storage";
    import {getTalkName, publicKeysOnly} from '../../tools/helpers.js'

    import Card from 'flowbite-svelte/Card.svelte'
    import P from "flowbite-svelte/P.svelte";
    import RevisionBadge from "./RevisionBadge.svelte";


    export let talk: Talk

</script>

{#if talk}
    <Card class="flex flex-col w-full max-w-none h-full overflow-y-auto p-4">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{getTalkName(talk)} @
            <RevisionBadge sha={talk.__revision.sha} link={talk.__revision.link}/>
        </h5>
        {#each Object.keys(talk).filter(publicKeysOnly) as key}
            <h3 class="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{key}</h3>
            <P class="mb-2">{talk[key]}</P>
        {/each}
    </Card>
{/if}

