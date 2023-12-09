<script lang="ts">
    import {onMount} from "svelte";
    import {type PersonalInfo, storageLocal, storageSync} from "../storage";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";

    let lastSyncedAt: string = 'never';
    let syncedInfo: PersonalInfo | undefined = undefined
    let loading = false;

    let token: string | null = null;
    let repo: string | null = null;

    const isEmptyInfo = (info: PersonalInfo | undefined) => {
        if (!info) return false
        return Object.keys(info).length === 0
    }

    onMount(async () => {
        const { personalInfo, lastSyncedAt: lastSync } = await storageLocal.get()
        const { token: tokenRestored, repo: repoRestored } = await storageSync.get()
        token = tokenRestored;
        repo = repoRestored;
        syncedInfo = personalInfo;
        lastSyncedAt = lastSync ?? 'never';
    });
</script>

<section class="text-base">
    <h3 class="text-2xl font-bold mb-2">Your best self:</h3>
    <p class="mb-6 text-gray-400 italic">Last synced at: {lastSyncedAt}</p>
    {#if isEmptyInfo(syncedInfo) && lastSyncedAt === 'never' && repo && token}
        <PlaceholderPanel>
            No personal info found. Sync your topics to get started.
        </PlaceholderPanel>
    {/if}
    {#if !repo || !token}
        <PlaceholderPanel>
            Let's set up your GitHub repository first. Head over to the "Options" tab to begin.
        </PlaceholderPanel>
    {/if}
    {#if isEmptyInfo(syncedInfo) && lastSyncedAt !== 'never' && repo && token}
        <PlaceholderPanel>
            No personal info found. Make sure your repository contains a README.md file and then sync again.
        </PlaceholderPanel>
    {/if}
    {#if syncedInfo && Object.keys(syncedInfo).length !== 0 && lastSyncedAt !== 'never' && repo && token}
            {#each Object.keys(syncedInfo) as key}
                <p class="mb-2">
                    <span class="font-bold">{key}</span>: {syncedInfo[key]}
                </p>
            {/each}
    {/if}
<!--    <Button on:click={sync} loading={loading}>{loading ? "Syncing..." : "Sync now!"}</Button>-->
</section>