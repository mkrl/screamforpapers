<script lang="ts">
    import {storageSync, storageLocal} from "../storage";
    import type {Talk} from "../storage";
    import {syncWithGithub} from "../tools/github";
    import {getTalkName} from '../tools/helpers.js'
    import Button from './ui/Button.svelte'

    export let token: string;
    export let repo: string;
    export let lastSyncedAt: string;
    export let talks: Talk[] = [];

    let successMessage: string | null = null;
    let loading = false;

    const save = () => {
        storageSync.set({ token, repo }).then(() => {
            successMessage = "Options saved!";

            setTimeout(() => {
                successMessage = null;
            }, 1500);
        });
    }

    const sync = async () => {
        loading = true;
        const syncData = await syncWithGithub({token, repo})
        if (syncData) {
            const { personalInfo, talkList } = syncData
            talks = talkList;
            lastSyncedAt = new Date().toString()
            if (personalInfo) {
                await storageLocal.set({ talkList, personalInfo, lastSyncedAt })
            }
        }
        loading = false;
    }
</script>

<section class="container">
    <label for="token">
        Github Token:
    </label>
    <input bind:value={token} type="password" id="token" placeholder="Fine-grained read-only token is encouraged" />
    <label for="repo">
        Repo URL:
    </label>
    <input bind:value={repo} type="text" id="repo" placeholder="Can be private, be sure the token has read access to it!" />
    <Button on:click={save} label="Save GitHub settings" />
    {#if successMessage}<span class="success">{successMessage}</span>{/if}
</section>
<br/>
<hr/>
<section class="container">
    <h1>Topic List:</h1>
    <i>Last synced at: {lastSyncedAt}</i>
    <ul>
        {#each talks as talk}
            <li>{getTalkName(talk)} @ <code><a href="{talk.__revision.link}" target="_blank">{talk.__revision.sha.slice(0,7)}</a></code></li>
        {/each}
    </ul>
    <Button label={loading ? "Syncing..." : "Sync now!"} on:click={sync} loading={loading} />
</section>

<style>
    .container {
        max-width: 450px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 auto;
    }

    .success {
        color: #2ecc71;
        font-weight: bold;
    }
</style>
