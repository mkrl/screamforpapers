<script lang="ts">
    import { onMount } from "svelte";
    import {storageLocal} from "../storage";
    import type {Talk} from "../storage";
    import {getTalkName} from '../tools/helpers.js'
    import TalkSelect from './ui/TalkSelect.svelte'
    import Heading from 'flowbite-svelte/Heading.svelte'
    import TalkView from "./ui/TalkView.svelte";
    import Button from "flowbite-svelte/Button.svelte";
    import P from "flowbite-svelte/P.svelte";
    import GradientButton from "flowbite-svelte/GradientButton.svelte";

    let talks: Talk[] = [];
    let lastSyncTime: string = "never";
    let selectedTalk: Talk;
    let submitInitialized = false;

    onMount(() => {
        storageLocal.get().then(({ talkList, lastSyncedAt }) => {
            if (talkList && lastSyncedAt) {
                talks = talkList;
                selectedTalk = talks[0]
                lastSyncTime = lastSyncedAt;
            }
        });
    });

    const onRoll = async () => {
        await storageLocal.set({ selectedTalk: selectedTalk.id })
        await chrome.runtime.sendMessage({ submitTalk: selectedTalk.id });
        submitInitialized = true
    }

    const onClickDashboard = async () => {
        await chrome.tabs.create({
            url: "src/dashboard/dashboard.html"
        });
    }
</script>

<section class="flex gap-6 justify-between flex-col h-screen p-6">
    <div class="flex flex-col flex-grow">
        {#if !submitInitialized}
            <Heading class="mb-6 mt-3">What are we submitting today?</Heading>
            {#if lastSyncTime === "never"}<P class="text-gray-500 dark:text-gray-400">Looks like you have not yet set up Github sync or have never synced. You can fix that in the dashboard.</P>{/if}
            {#if talks.length === 0 && lastSyncTime !== "never"}<P class="text-gray-500 dark:text-gray-400">Looks like you have not added any talks yet. You can do that by pushing any suitable markdown files to your repo and then syncing again in the dashboard.</P>{/if}
            {#if talks.length > 0}
                <TalkSelect options={talks} bind:value={selectedTalk} displayFn={getTalkName} />
            {/if}
        {:else}
            <Heading class="mb-6 mt-3">You're on your way to submit your next CFP, way to go!</Heading>
        {/if}

        {#if selectedTalk}
            {#if !submitInitialized}
                <GradientButton color="pinkToOrange" pill class="mb-10" on:click={onRoll}>Let's roll</GradientButton>
            {/if}
            <TalkView talk={selectedTalk} />
        {/if}
    </div>
    <Button pill color="light" on:click={onClickDashboard}>Dashboard</Button>
</section>
