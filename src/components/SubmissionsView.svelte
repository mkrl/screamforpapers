<script lang="ts">
    import Table from "flowbite-svelte/Table.svelte";
    import TableBody from "flowbite-svelte/TableBody.svelte";
    import TableBodyCell from "flowbite-svelte/TableBodyCell.svelte";
    import TableBodyRow from "flowbite-svelte/TableBodyRow.svelte";
    import TableHead from "flowbite-svelte/TableBodyRow.svelte";
    import TableHeadCell from "flowbite-svelte/TableHeadCell.svelte";
    import SpeedDial from "flowbite-svelte/SpeedDial.svelte";
    import SpeedDialButton from "flowbite-svelte/SpeedDialButton.svelte";
    import ArrowDownToBraketSolid from 'flowbite-svelte-icons/ArrowDownToBraketSolid.svelte';
    import ArrowUpFromBracketOutline from 'flowbite-svelte-icons/ArrowUpFromBracketOutline.svelte';

    import {storageLocal, type Talk, type TalkSubmission} from "../storage";
    import PlaceholderPanel from "./ui/PlaceholderPanel.svelte";
    import {onMount} from "svelte";
    import Heading from "flowbite-svelte/Heading.svelte";
    import {getTalkName, replaceShaInUrl, validateSubmissions} from "../tools/helpers";
    import RevisionBadge from "./ui/RevisionBadge.svelte";
    import A from "flowbite-svelte/A.svelte";
    import Tooltip from "flowbite-svelte/Tooltip.svelte";

    type NormalizedTalkList = {
        [id: string]: Talk
    }

    let talkSubmissions: TalkSubmission[] = [];
    let talks: Talk[] = [];
    let normalizedTalks: NormalizedTalkList = {};
    let files: FileList | null = null;

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

    const onExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(talkSubmissions));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `submissions-${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    $: if (files) {
        files[0].text().then((text) => {
            try {
                const submissions = validateSubmissions(JSON.parse(text));
                if (submissions.length > 0) {
                    storageLocal.set({ submissions }).then(() => {
                        talkSubmissions = submissions;
                    });
                } else {
                    alert('No valid submissions found in the file you are trying to import');
                }
            } catch (e) {
                alert('The file you are trying to import is not a valid JSON file');
                return;
            }
        });
    }


    const onClickImport = () => {
        const input = document.getElementById('importFile');
        if (input) {
            input.click();
        }
    }
</script>

<div class="flex flex-grow justify-between">
<Heading class="mb-6 mt-3">Your submissions</Heading>
    <input
        type="file"
        id="importFile"
        accept="text/json"
        class="hidden"
        bind:files
    />
    <SpeedDial defaultClass="relative" placement="left">
        <SpeedDialButton on:click={onClickImport} name="Import" tooltip="top">
            <ArrowDownToBraketSolid class="w-5 h-5" />
        </SpeedDialButton>

        {#if talkSubmissions.length !== 0}
            <SpeedDialButton on:click={onExport} name="Export" tooltip="top">
                <ArrowUpFromBracketOutline class="w-5 h-5" />
            </SpeedDialButton>
        {/if}
    </SpeedDial>
</div>
<section class="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 text-base">
    {#if talkSubmissions.length === 0}
        <PlaceholderPanel>
            Once you record a submission, it will appear here
        </PlaceholderPanel>
        {:else}
        <Table hoverable>
            <TableHead>
                <TableHeadCell>Paper</TableHeadCell>
                <TableHeadCell>Revision</TableHeadCell>
                <TableHeadCell>Conference</TableHeadCell>
                <TableHeadCell>Date submitted</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each talkSubmissions as talkSubmission}
                    <TableBodyRow>
                        <TableBodyCell>
                            {getTalkName(normalizedTalks[talkSubmission.id])}
                        </TableBodyCell>
                        <TableBodyCell>
<!--                           // @TODO The link is not correct, the revision in the has to come from talkSubmission.sha-->
                            <RevisionBadge sha={talkSubmission.sha} link={replaceShaInUrl(normalizedTalks[talkSubmission.id].__revision.link, talkSubmission.sha)} />
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
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</section>