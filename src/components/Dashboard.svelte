<script lang="ts">
    import Secrets from "./Secrets.svelte";
    import Tabs from 'flowbite-svelte/Tabs.svelte';
    import TabItem from 'flowbite-svelte/TabItem.svelte';
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import PaperView from "./PaperView.svelte";
    import SelfView from "./SelfView.svelte";
    import Onboarding from "./ui/Onboarding.svelte";
    import SubmissionsView from "./SubmissionsView.svelte";

    export let forcedState: DashboardForcedState = undefined

    const getActiveTab = (state: DashboardForcedState) => {
        if (state === "options") {
            return {
                "Papers": false,
                "Me": false,
                "Options": true
            }
        }
        if (state === "welcome") {
            return {
                "Papers": false,
                "Me": false,
                "Options": true
            }
        }
        if (state === "sync") {
            return {
                "Papers": true,
                "Me": false,
                "Options": false
            }
        }
        return {
            "Papers": true,
            "Me": false,
            "Options": false
        }
    }

    let activeTab = getActiveTab(forcedState)
</script>

<div class="h-screen grid grid-cols-12 gap-6 p-6">
    <aside class="col-span-4 border-2 border-dashed rounded-xl p-6">
        <Tabs>
            <TabItem bind:open={activeTab['Papers']} title="Papers">
                <PaperView />
            </TabItem>
            <TabItem bind:open={activeTab['Me']} title="Me">
                <SelfView />
            </TabItem>
            <TabItem bind:open={activeTab['Options']} title="Options">
                <Secrets />
            </TabItem>
        </Tabs>
    </aside>

    <main class="col-span-8 border-2 border-dashed rounded-xl p-6 overflow-y-auto">
        {#if forcedState === "welcome"}
            <Onboarding step={activeTab['Options'] ? 0 : 1} />
        {:else}
            <SubmissionsView />
        {/if}
    </main>
</div>