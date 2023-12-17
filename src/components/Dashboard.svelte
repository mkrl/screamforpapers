<script lang="ts">
    import Secrets from "./Secrets.svelte";
    import Tabs from 'flowbite-svelte/Tabs.svelte';
    import TabItem from 'flowbite-svelte/TabItem.svelte';
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import PaperView from "./PaperView.svelte";
    import SelfView from "./SelfView.svelte";
    import Onboarding from "./ui/Onboarding.svelte";
    import SubmissionsView from "./SubmissionsView.svelte";
    import Wishlist from "./Wishlist.svelte";

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
        return {
            "Papers": true,
            "Me": false,
            "Options": false
        }
    }

    let activeTab = getActiveTab(forcedState)
</script>

<div class="h-screen grid grid-cols-12 gap-6 p-6">
    <aside class="col-span-4 border-2 border-dashed rounded-xl p-6 overflow-y-auto" style="height: calc(100vh - 3rem)">
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

    {#if forcedState === "welcome"}
        <main class="col-span-8 border-2 border-dashed rounded-xl p-6 overflow-y-auto">
            <Onboarding step={activeTab['Options'] ? 0 : 1} />
        </main>
    {:else}
        <main class="grid-rows-2 col-span-8 gap-6 grid auto-rows-fr" style="height: calc(100vh - 3rem)">
            <section class="border-2 border-dashed rounded-xl p-6 overflow-y-auto">
                <Wishlist />
            </section>
            <section class="border-2 border-dashed rounded-xl p-6 overflow-y-auto">
                <SubmissionsView />
            </section>
        </main>
    {/if}



</div>