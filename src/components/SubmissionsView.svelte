<script lang="ts">
    import Table from "flowbite-svelte/Table.svelte";
    import TableBody from "flowbite-svelte/TableBody.svelte";
    import TableBodyCell from "flowbite-svelte/TableBodyCell.svelte";
    import TableBodyRow from "flowbite-svelte/TableBodyRow.svelte";
    import TableHead from "flowbite-svelte/TableBodyRow.svelte";
    import TableHeadCell from "flowbite-svelte/TableHeadCell.svelte";

    import {storageLocal, type Talk, type TalkSubmission} from "../storage";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import {onMount} from "svelte";
    import Heading from "flowbite-svelte/Heading.svelte";
    import {getTalkName, replaceShaInUrl, validateSubmissions} from "../tools/helpers";
    import RevisionBadge from "./ui/RevisionBadge.svelte";
    import A from "flowbite-svelte/A.svelte";
    import Tooltip from "flowbite-svelte/Tooltip.svelte";
    import ImportExportShortcut from "./ui/ImportExportShortcut.svelte";
    import CloseCircleSolid from "flowbite-svelte-icons/CloseCircleSolid.svelte";

    type NormalizedTalkList = {
        [id: string]: Talk
    }

    let talkSubmissions: TalkSubmission[] = [];
    let talks: Talk[] = [];
    let normalizedTalks: NormalizedTalkList = {};

    $: {
        normalizedTalks = talks.reduce((acc, talk) => {
            acc[talk.id] = talk;
            return acc;
        }, {} as NormalizedTalkList);
    }

    onMount(() => {
        storageLocal.get().then(({ talkList, submissions }) => {
            if (talkList) {
                talks = talkList;
            }
            if (submissions) {
                talkSubmissions = submissions;
            }
        });
    });

    const onRemoveSubmission = (submission: TalkSubmission) => {
        talkSubmissions = talkSubmissions.filter(s => s.date !== submission.date);
        storageLocal.set({ submissions: talkSubmissions });
    }
</script>

<div class="flex flex-grow justify-between">
<Heading class="mb-6 mt-3">Your submissions</Heading>
    <ImportExportShortcut dataType="submissions" items={talkSubmissions} />
</div>
<section class="rounded-lg text-base">
    {#if talkSubmissions.length === 0}
        <PlaceholderPanel>
            Once you record a submission, it will appear here
        </PlaceholderPanel>
        {:else}
        <Table hoverable shadow>
            <TableHead>
                <TableHeadCell>Paper</TableHeadCell>
                <TableHeadCell>Revision</TableHeadCell>
                <TableHeadCell>Conference</TableHeadCell>
                <TableHeadCell>Date submitted</TableHeadCell>
                <TableHeadCell>
                    <span class="sr-only">Remove</span>
                </TableHeadCell>
            </TableHead>
            <TableBody>
                {#each talkSubmissions as talkSubmission}
                    <TableBodyRow class="group">
                        <TableBodyCell>
                            {getTalkName(normalizedTalks[talkSubmission.id])}
                        </TableBodyCell>
                        <TableBodyCell>
                            <RevisionBadge
                                sha={talkSubmission.sha}
                                link={replaceShaInUrl(normalizedTalks[talkSubmission.id].__revision.link, talkSubmission.sha)}
                            />
                        </TableBodyCell>
                        <TableBodyCell>
                            <A href={talkSubmission.url} target="_blank">
                                {talkSubmission.name}
                            </A>
                        </TableBodyCell>
                        <TableBodyCell>
                            <span id={'s'+String(new Date(talkSubmission.date).getTime())}>
                                {new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale).format(new Date(talkSubmission.date))}
                            </span>
                            <Tooltip trigger="hover" triggeredBy={`#s${String(new Date(talkSubmission.date).getTime())}`}>{talkSubmission.date}</Tooltip>
                        </TableBodyCell>
                        <TableHeadCell>
                            <A class="group-hover:visible invisible flex" title="Remove" on:click={() => onRemoveSubmission(talkSubmission)}><CloseCircleSolid /></A>
                        </TableHeadCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</section>