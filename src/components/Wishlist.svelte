<script lang="ts">
    import Table from "flowbite-svelte/Table.svelte";
    import TableBody from "flowbite-svelte/TableBody.svelte";
    import TableBodyCell from "flowbite-svelte/TableBodyCell.svelte";
    import TableBodyRow from "flowbite-svelte/TableBodyRow.svelte";
    import TableHead from "flowbite-svelte/TableBodyRow.svelte";
    import TableHeadCell from "flowbite-svelte/TableHeadCell.svelte";
    import Toggle from "flowbite-svelte/Toggle.svelte";

    import {storageLocal, type WishlistItem} from "../storage";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import {onMount} from "svelte";
    import Heading from "flowbite-svelte/Heading.svelte";
    import A from "flowbite-svelte/A.svelte";
    import ImportExportShortcut from "./ui/ImportExportShortcut.svelte";

    let items: WishlistItem[] = [];

    onMount(() => {
        storageLocal.get().then(({ wishlist }) => {
            if (wishlist) {
                items = wishlist;
            }
        });
    });

    const onToggle = (item: WishlistItem) => {
        storageLocal.get().then(({ wishlist }) => {
            if (wishlist) {
                const index = wishlist.findIndex((i) => i.url === item.url);
                if (index !== -1) {
                    const itemStatus = wishlist[index].done
                    wishlist[index].done = !itemStatus;
                    storageLocal.set({ wishlist });
                }
            }
        });
    };
</script>

<div class="flex flex-grow justify-between">
    <Heading class="mb-6 mt-3">CFP Wishlist</Heading>
    <ImportExportShortcut dataType="wishlist" {items} />
</div>
<section class="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 text-base">
    {#if items.length === 0}
        <PlaceholderPanel>
            You can add a conference to your wishlist by opening the CFP page and clicking on "Save for later" in the extension popup
        </PlaceholderPanel>
    {:else}
        <Table hoverable>
            <TableHead>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>CFP deadline</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each items as item}
                    <TableBodyRow>
                        <TableBodyCell>
                            <A href={item.url} target="_blank">
                                {item.name}
                            </A>
                        </TableBodyCell>
                        <TableBodyCell>
                            {new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale).format(new Date(item.dateEnds))}
                        </TableBodyCell>
                        <TableBodyCell>
                            <Toggle checked={item.done} on:change={() => onToggle(item)} />
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</section>