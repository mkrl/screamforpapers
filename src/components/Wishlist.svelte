<script lang="ts">
  import Table from 'flowbite-svelte/Table.svelte'
  import TableBody from 'flowbite-svelte/TableBody.svelte'
  import TableBodyCell from 'flowbite-svelte/TableBodyCell.svelte'
  import TableBodyRow from 'flowbite-svelte/TableBodyRow.svelte'
  import TableHead from 'flowbite-svelte/TableHead.svelte'
  import TableHeadCell from 'flowbite-svelte/TableHeadCell.svelte'
  import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte'
  import ArchiveSolid from 'flowbite-svelte-icons/ArchiveSolid.svelte'
  import ArchiveOutline from 'flowbite-svelte-icons/ArchiveOutline.svelte'

  import { storageLocal, type WishlistItem } from '../storage'
  import PlaceholderPanel from './ui/PlaceholderPanel.svelte'
  import { onMount } from 'svelte'
  import Heading from 'flowbite-svelte/Heading.svelte'
  import A from 'flowbite-svelte/A.svelte'
  import ImportExportShortcut from './ui/ImportExportShortcut.svelte'
  import { getDueDateColor } from '../tools/helpers'
  import { writable } from 'svelte/store'
  import EditableField from './ui/EditableField.svelte'

  let items: WishlistItem[] = []

  const sortKey = writable<keyof WishlistItem>('url') // default sort key
  const sortDirection = writable(1) // default sort direction (ascending)
  const sortItems = writable([...items])

  // Stuff that's either done or has passed the deadline
  let upToDateItems: WishlistItem[] = []
  let outdatedItems: WishlistItem[] = []

  sortItems.subscribe((val) => {
    outdatedItems = val.filter((item) => {
      const now = new Date()
      const deadline = new Date(item.dateEnds)
      return item.done || deadline < now
    })
    upToDateItems = val.filter((item) => {
      const now = new Date()
      const deadline = new Date(item.dateEnds)
      return !item.done && deadline >= now
    })
  })

  const sortTable = (key: keyof WishlistItem) => {
    // If the same key is clicked, reverse the sort direction
    if ($sortKey === key) {
      sortDirection.update((val) => -val)
    } else {
      sortKey.set(key)
      sortDirection.set(1)
    }
  }

  const getComparableValues = (
    key: keyof WishlistItem,
    aVal: keyof WishlistItem,
    bVal: keyof WishlistItem
  ) => {
    if (key === 'dateEnds') {
      return {
        aCompare: new Date(aVal as string).getTime(),
        bCompare: new Date(bVal as string).getTime(),
      }
    }
    return { aCompare: aVal, bCompare: bVal }
  }

  $: {
    const key = $sortKey
    const direction = $sortDirection
    const sorted = [...$sortItems].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      const { aCompare, bCompare } = getComparableValues(
        key,
        aVal as keyof WishlistItem,
        bVal as keyof WishlistItem
      )
      if (aCompare < bCompare) {
        return -direction
      } else if (aCompare > bCompare) {
        return direction
      }
      return 0
    })
    sortItems.set(sorted)
  }

  onMount(() => {
    storageLocal.get().then(({ wishlist }) => {
      if (wishlist) {
        items = wishlist
        sortItems.set(wishlist)
      }
    })
  })

  const onToggle = (item: WishlistItem) => {
    storageLocal.get().then(({ wishlist }) => {
      if (wishlist) {
        const index = wishlist.findIndex((i) => i.url === item.url)
        if (index !== -1) {
          const itemStatus = wishlist[index].done
          wishlist[index].done = !itemStatus
          storageLocal.set({ wishlist })

          const sorted = [...$sortItems]
          const sortedIndex = sorted.findIndex((i) => i.url === item.url)
          sorted[sortedIndex].done = !itemStatus
          sortItems.set(sorted)
        }
      }
    })
  }
  const onUpdate = (item: WishlistItem, newName: string) => {
    storageLocal.get().then(({ wishlist }) => {
      if (wishlist) {
        const index = wishlist.findIndex((i) => i.url === item.url)
        if (index !== -1) {
          wishlist[index].name = newName
          storageLocal.set({ wishlist })

          const sorted = [...$sortItems]
          const sortedIndex = sorted.findIndex((i) => i.url === item.url)
          sorted[sortedIndex].name = newName
          sortItems.set(sorted)
        }
      }
    })
  }

  const onRemove = (item: WishlistItem) => {
    storageLocal.get().then(({ wishlist }) => {
      if (wishlist) {
        const index = wishlist.findIndex((i) => i.url === item.url)
        if (index !== -1) {
          wishlist.splice(index, 1)
          items = wishlist
          storageLocal.set({ wishlist })
          const sorted = [...$sortItems]
          const sortedIndex = sorted.findIndex((i) => i.url === item.url)
          sorted.splice(sortedIndex, 1)
          sortItems.set(sorted)
        }
      }
    })
  }
</script>

<div class="flex flex-grow justify-between mb-4">
  <Heading class="mb-6 mt-3">CFP Wishlist</Heading>
  <ImportExportShortcut dataType="wishlist" {items} />
</div>
<section class="text-base">
  {#if items.length === 0}
    <PlaceholderPanel>
      You can add a conference to your wishlist by opening the CFP page and
      clicking on "Save for later" in the extension popup
    </PlaceholderPanel>
  {:else}
    <Table divClass="relative overflow-auto scrollable-table" hoverable shadow>
      <TableHead class="sticky top-0 z-10">
        <TableHeadCell class="cursor-pointer" on:click={() => sortTable('name')}
          >Name</TableHeadCell
        >
        <TableHeadCell
          class="cursor-pointer w-1/6"
          on:click={() => sortTable('dateEnds')}>CFP deadline</TableHeadCell
        >
        <TableHeadCell class="w-[7%]">
          <span class="sr-only">Remove or Archive</span>
        </TableHeadCell>
      </TableHead>
      <TableBody>
        {#each upToDateItems as item}
          <TableBodyRow class="group">
            <TableBodyCell>
              <EditableField
                value={item.name}
                onUpdate={(newName) => onUpdate(item, newName)}
              >
                <A href={item.url} target="_blank">
                  {item.name}
                </A>
              </EditableField>
            </TableBodyCell>
            <TableBodyCell>
              <span
                class={getDueDateColor(new Date(), new Date(item.dateEnds))}
              >
                {new Intl.DateTimeFormat(
                  Intl.DateTimeFormat().resolvedOptions().locale
                ).format(new Date(item.dateEnds))}
              </span>
            </TableBodyCell>
            <TableHeadCell>
              <A
                class="group-hover:visible invisible cursor-pointer inline-flex mr-4"
                title="Archive"
                on:click={() => onToggle(item)}
                ><ArchiveSolid class="cursor-pointer text-amber-500" /></A
              >
              <A
                class="group-hover:visible invisible cursor-pointer inline-flex"
                title="Remove"
                on:click={() => onRemove(item)}
                ><CloseCircleSolid class="cursor-pointer" /></A
              >
            </TableHeadCell>
          </TableBodyRow>
        {/each}
        {#if outdatedItems.length > 0}
          {#if upToDateItems.length > 0}
            <TableBodyRow class="bg-gray-50">
              <td colSpan={6} class="px-6 py-2 text-center">
                Archived & overdue
              </td>
            </TableBodyRow>
          {/if}
          {#each outdatedItems as item}
            <TableBodyRow class="group">
              <TableBodyCell>
                <EditableField
                  value={item.name}
                  onUpdate={(newName) => onUpdate(item, newName)}
                >
                  <A href={item.url} target="_blank">
                    {item.name}
                  </A>
                </EditableField>
              </TableBodyCell>
              <TableBodyCell>
                <span
                  class={getDueDateColor(new Date(), new Date(item.dateEnds))}
                >
                  {new Intl.DateTimeFormat(
                    Intl.DateTimeFormat().resolvedOptions().locale
                  ).format(new Date(item.dateEnds))}
                </span>
              </TableBodyCell>
              <TableHeadCell>
                <A
                  class="group-hover:visible invisible cursor-pointer inline-flex mr-4"
                  title="Unarchive"
                  on:click={() => onToggle(item)}
                  ><ArchiveOutline class="cursor-pointer text-amber-500" /></A
                >
                <A
                  class="group-hover:visible invisible cursor-pointer inline-flex"
                  title="Remove"
                  on:click={() => onRemove(item)}
                  ><CloseCircleSolid class="cursor-pointer" /></A
                >
              </TableHeadCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  {/if}
</section>
