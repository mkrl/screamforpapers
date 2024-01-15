<script lang="ts">
  import Table from 'flowbite-svelte/Table.svelte'
  import TableBody from 'flowbite-svelte/TableBody.svelte'
  import TableBodyCell from 'flowbite-svelte/TableBodyCell.svelte'
  import TableBodyRow from 'flowbite-svelte/TableBodyRow.svelte'
  import TableHead from 'flowbite-svelte/TableHead.svelte'
  import TableHeadCell from 'flowbite-svelte/TableHeadCell.svelte'

  import { storageLocal, type Talk, type TalkSubmission } from '../storage'
  import PlaceholderPanel from './ui/PlaceholderPanel.svelte'
  import { onMount } from 'svelte'
  import Heading from 'flowbite-svelte/Heading.svelte'
  import { getTalkName, replaceShaInUrl } from '../tools/helpers'
  import RevisionBadge from './ui/RevisionBadge.svelte'
  import A from 'flowbite-svelte/A.svelte'
  import Tooltip from 'flowbite-svelte/Tooltip.svelte'
  import ImportExportShortcut from './ui/ImportExportShortcut.svelte'
  import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte'
  import { writable } from 'svelte/store'
  import EditableField from './ui/EditableField.svelte'

  type NormalizedTalkList = {
    [id: string]: Talk
  }

  let talkSubmissions: TalkSubmission[] = []
  let talks: Talk[] = []
  let normalizedTalks: NormalizedTalkList = {}

  const sortKey = writable<keyof TalkSubmission>('id') // default sort key
  const sortDirection = writable(1) // default sort direction (ascending)
  const sortItems = writable([...talkSubmissions]) // make a copy of the items array

  const sortTable = (key: keyof TalkSubmission) => {
    // If the same key is clicked, reverse the sort direction
    if ($sortKey === key) {
      sortDirection.update((val) => -val)
    } else {
      sortKey.set(key)
      sortDirection.set(1)
    }
  }

  const getComparableValues = (
    key: keyof TalkSubmission,
    aVal: keyof TalkSubmission,
    bVal: keyof TalkSubmission
  ) => {
    if (key === 'date') {
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
        aVal as keyof TalkSubmission,
        bVal as keyof TalkSubmission
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

  $: {
    normalizedTalks = talks.reduce((acc, talk) => {
      acc[talk.id] = talk
      return acc
    }, {} as NormalizedTalkList)
  }

  onMount(() => {
    storageLocal.get().then(({ talkList, submissions }) => {
      if (talkList) {
        talks = talkList
      }
      if (submissions) {
        talkSubmissions = submissions
        sortItems.set(submissions)
      }
    })
  })

  const onRemoveSubmission = (submission: TalkSubmission) => {
    talkSubmissions = talkSubmissions.filter((s) => s.date !== submission.date)
    sortItems.set([...$sortItems.filter((s) => s.date !== submission.date)])
    storageLocal.set({ submissions: talkSubmissions })
  }
  const onEditConference = (submission: TalkSubmission, newName: string) => {
    const submissionIndex = talkSubmissions.findIndex(
      (s) => s.date === submission.date
    )
    talkSubmissions[submissionIndex].name = newName
    const sortedIndex = $sortItems.findIndex((s) => s.date === submission.date)
    $sortItems[sortedIndex].name = newName
    sortItems.set([...$sortItems])
    storageLocal.set({ submissions: talkSubmissions })
  }
</script>

<div class="flex flex-grow mb-4 justify-between">
  <Heading class="mb-6 mt-3">Your submissions</Heading>
  <ImportExportShortcut dataType="submissions" items={talkSubmissions} />
</div>
<section class="text-base">
  {#if talkSubmissions.length === 0}
    <PlaceholderPanel>
      Once you record a submission, it will appear here
    </PlaceholderPanel>
  {:else}
    <Table divClass="relative overflow-auto scrollable-table" hoverable shadow>
      <TableHead class="sticky top-0 z-10">
        <TableHeadCell class="cursor-pointer" on:click={() => sortTable('id')}
          >Paper</TableHeadCell
        >
        <TableHeadCell>Revision</TableHeadCell>
        <TableHeadCell
          class="cursor-pointer w-1/3"
          on:click={() => sortTable('name')}>Conference</TableHeadCell
        >
        <TableHeadCell class="cursor-pointer" on:click={() => sortTable('date')}
          >Date submitted</TableHeadCell
        >
        <TableHeadCell>
          <span class="sr-only">Remove</span>
        </TableHeadCell>
      </TableHead>
      <TableBody>
        {#each $sortItems as talkSubmission}
          <TableBodyRow class="group">
            <TableBodyCell>
              {normalizedTalks[talkSubmission.id]
                ? getTalkName(normalizedTalks[talkSubmission.id])
                : talkSubmission.id}
            </TableBodyCell>
            <TableBodyCell>
              {#if normalizedTalks[talkSubmission.id]}
                <RevisionBadge
                  sha={talkSubmission.sha}
                  link={replaceShaInUrl(
                    normalizedTalks[talkSubmission.id].__revision.link,
                    talkSubmission.sha
                  )}
                />
              {:else}
                <code class="bg-gray-200 p-1 rounded-md">
                  {talkSubmission.sha.slice(0, 7)}
                </code>
              {/if}
            </TableBodyCell>
            <TableBodyCell>
              <EditableField
                value={talkSubmission.name}
                onUpdate={(newName) =>
                  onEditConference(talkSubmission, newName)}
              >
                <A href={talkSubmission.url} target="_blank">
                  {talkSubmission.name}
                </A>
              </EditableField>
            </TableBodyCell>
            <TableBodyCell>
              <span id={'s' + String(new Date(talkSubmission.date).getTime())}>
                {new Intl.DateTimeFormat(
                  Intl.DateTimeFormat().resolvedOptions().locale
                ).format(new Date(talkSubmission.date))}
              </span>
              <Tooltip
                defaultClass="z-20 py-2 px-3 text-sm font-medium"
                trigger="hover"
                triggeredBy={`#s${String(
                  new Date(talkSubmission.date).getTime()
                )}`}>{talkSubmission.date}</Tooltip
              >
            </TableBodyCell>
            <TableHeadCell>
              <A
                class="group-hover:visible invisible flex"
                title="Remove"
                on:click={() => onRemoveSubmission(talkSubmission)}
                ><CloseCircleSolid /></A
              >
            </TableHeadCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</section>
