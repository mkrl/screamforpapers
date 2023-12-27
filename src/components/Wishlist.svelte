<script lang="ts">
    import Table from "flowbite-svelte/Table.svelte";
    import TableBody from "flowbite-svelte/TableBody.svelte";
    import TableBodyCell from "flowbite-svelte/TableBodyCell.svelte";
    import TableBodyRow from "flowbite-svelte/TableBodyRow.svelte";
    import TableHead from "flowbite-svelte/TableHead.svelte";
    import TableHeadCell from "flowbite-svelte/TableHeadCell.svelte";
    import Toggle from "flowbite-svelte/Toggle.svelte";
    import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte';

    import {storageLocal, type WishlistItem} from "../storage";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import {onMount} from "svelte";
    import Heading from "flowbite-svelte/Heading.svelte";
    import A from "flowbite-svelte/A.svelte";
    import ImportExportShortcut from "./ui/ImportExportShortcut.svelte";
    import {getDueDateColor} from "../tools/helpers";
    import {writable} from "svelte/store";

    let items: WishlistItem[] = [];

    const sortKey = writable<keyof WishlistItem>('url'); // default sort key
    const sortDirection = writable(1); // default sort direction (ascending)
    const sortItems = writable([...items]); // make a copy of the items array

    const sortTable = (key: keyof WishlistItem) => {
        // If the same key is clicked, reverse the sort direction
        if ($sortKey === key) {
            sortDirection.update((val) => -val);
        } else {
            sortKey.set(key);
            sortDirection.set(1);
        }
    };

    const getComparableValues = (key: keyof WishlistItem, aVal: keyof WishlistItem, bVal: keyof WishlistItem) => {
        if (key === 'dateEnds') {
            return { aCompare: new Date(aVal as string).getTime(), bCompare: new Date(bVal as string).getTime() }
        }
        return { aCompare: aVal, bCompare: bVal }
    };

    $: {
        const key = $sortKey;
        const direction = $sortDirection;
        const sorted = [...$sortItems].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            const { aCompare, bCompare } = getComparableValues(key, aVal as keyof WishlistItem, bVal as keyof WishlistItem)
            if (aCompare < bCompare) {
                return -direction;
            } else if (aCompare > bCompare) {
                return direction;
            }
            return 0;
        });
        sortItems.set(sorted);
    }

    onMount(() => {
        storageLocal.get().then(({ wishlist }) => {
            if (wishlist) {
                items = wishlist;
                sortItems.set(wishlist);
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

                    const sorted = [...$sortItems];
                    const sortedIndex = sorted.findIndex((i) => i.url === item.url);
                    sorted[sortedIndex].done = !itemStatus;
                    sortItems.set(sorted);
                }
            }
        });
    };

    const onRemove = (item: WishlistItem) => {
        storageLocal.get().then(({ wishlist }) => {
            if (wishlist) {
                const index = wishlist.findIndex((i) => i.url === item.url);
                if (index !== -1) {
                    wishlist.splice(index, 1);
                    items = wishlist
                    storageLocal.set({ wishlist });
                    const sorted = [...$sortItems];
                    const sortedIndex = sorted.findIndex((i) => i.url === item.url);
                    sorted.splice(sortedIndex, 1);
                    sortItems.set(sorted);
                }
            }
        });
    };
</script>

<div class="flex flex-grow justify-between mb-4">
    <Heading class="mb-6 mt-3">CFP Wishlist</Heading>
    <ImportExportShortcut dataType="wishlist" {items} />
</div>
<section class="text-base">
    {#if items.length === 0}
        <PlaceholderPanel>
            You can add a conference to your wishlist by opening the CFP page and clicking on "Save for later" in the extension popup
        </PlaceholderPanel>
    {:else}
        <Table divClass="relative overflow-auto scrollable-table" hoverable shadow>
            <TableHead class="sticky top-0 z-10">
                <TableHeadCell class="cursor-pointer" on:click={() => sortTable('name')}>Name</TableHeadCell>
                <TableHeadCell class="cursor-pointer" on:click={() => sortTable('dateEnds')}>CFP deadline</TableHeadCell>
                <TableHeadCell class="cursor-pointer" on:click={() => sortTable('done')}>Status</TableHeadCell>
                <TableHeadCell>
                    <span class="sr-only">Remove</span>
                </TableHeadCell>
            </TableHead>
            <TableBody>
                {#each $sortItems as item}
                    <TableBodyRow class="group">
                        <TableBodyCell>
                            <A href={item.url} target="_blank">
                                {item.name}
                            </A>
                        </TableBodyCell>
                        <TableBodyCell>
                            <span class={getDueDateColor(new Date(), new Date(item.dateEnds))}>
                                {new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale).format(new Date(item.dateEnds))}
                            </span>
                        </TableBodyCell>
                        <TableBodyCell>
                            <Toggle checked={item.done} on:change={() => onToggle(item)} />
                        </TableBodyCell>
                        <TableHeadCell>
                            <A class="group-hover:visible invisible flex" title="Remove" on:click={() => onRemove(item)}><CloseCircleSolid /></A>
                        </TableHeadCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</section>
