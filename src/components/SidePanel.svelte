<script lang="ts">
    import { onMount } from "svelte";
    import {storageLocal} from "../storage";
    import type {Talk} from "../storage";
    import {getTalkName} from '../tools/helpers.js'
    import Select from './ui/Select.svelte'
    import TalkView from "./ui/TalkView.svelte";
    import Button from "./ui/Button.svelte";

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

<section class="container section">
    <div class="container">
        {#if !submitInitialized}
            <h1>What are we submitting today?</h1>
            {#if lastSyncTime === "never"}<i>Looks like you have not yet set up Github sync or have never synced. You can do that in extension options.</i>{/if}
            {#if talks.length === 0 && lastSyncTime !== "never"}<i>Looks like you have not added any talks. You can do that by pushing any suitable markdown files to your repo.</i>{/if}
            {#if talks.length > 0}
                <Select options={talks} bind:value={selectedTalk} displayFn={getTalkName} />
            {/if}
        {:else}
            <h1>You're on your way to submit your next CFP, way to go!</h1>
        {/if}

        {#if selectedTalk}
            <hr/>
            {#if !submitInitialized}
                <Button on:click={onRoll} label="Let's roll"/>
            {/if}
            <br/>
            <hr/>
            <TalkView talk={selectedTalk} />
        {/if}
    </div>
    <Button on:click={onClickDashboard} label="Dashboard"/>
</section>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }
    .section {
        height: calc(100vh - 16px);
        justify-content: space-between;
    }
</style>
