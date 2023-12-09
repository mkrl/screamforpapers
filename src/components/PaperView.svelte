<script lang="ts">
    import {onMount} from "svelte";
    import {storageLocal, storageSync, type Talk} from "../storage";
    import {getTalkName} from "../tools/helpers";

    import Button from "flowbite-svelte/Button.svelte";
    import List from "flowbite-svelte/List.svelte";
    import Li from "flowbite-svelte/Li.svelte";
    import {syncWithGithub} from "../tools/github";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";

    let lastSyncedAt: string = 'never';
    let talks: Talk[] = [];
    let loading = false;

    let token: string | null = null;
    let repo: string | null = null;

    onMount(async () => {
        const { talkList, lastSyncedAt: lastSync } = await storageLocal.get()
        const { token: tokenRestored, repo: repoRestored } = await storageSync.get()
        token = tokenRestored;
        repo = repoRestored;
        talks = talkList ?? [];
        lastSyncedAt = lastSync ?? 'never';
    });

    const sync = async () => {
        if (token && repo) {
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
    }
</script>

<section class="text-base">
    <h3 class="text-2xl font-bold mb-2">Your currently synced topics:</h3>
    <p class="mb-6 text-gray-400 italic">Last synced at: {lastSyncedAt}</p>
    {#if talks.length === 0 && lastSyncedAt === 'never' && repo && token}
        <PlaceholderPanel>
            You haven't synced your topics yet. Hit the button below get started!
        </PlaceholderPanel>
    {/if}
    {#if !repo || !token}
        <PlaceholderPanel>
            Let's set up your GitHub repository first. Head over to the "Options" tab to begin.
        </PlaceholderPanel>
    {/if}
    {#if talks.length !== 0 && lastSyncedAt !== 'never' && repo && token}
        <List list="disc" class="mb-6">
            {#each talks as talk}
                <Li>{getTalkName(talk)} @ <code class="bg-gray-200 p-1 rounded-md"><a href="{talk.__revision.link}" target="_blank">{talk.__revision.sha.slice(0,7)}</a></code></Li>
            {/each}
        </List>
    {/if}
    {#if repo && token}
        <Button pill on:click={sync} loading={loading} disabled={loading}>{loading ? "Syncing..." : "Sync now!"}</Button>
    {/if}
</section>