<script lang="ts">
    import type {PersonalInfo, Talk} from "../storage";
    import {publicKeysOnly, simulateInput} from '../tools/helpers'
    import type {FocusableTarget} from '../tools/helpers'

    import AccordionItem from "flowbite-svelte/AccordionItem.svelte";
    import Accordion from "flowbite-svelte/Accordion.svelte";

    import type {Writable} from "svelte/store";
    import TalkSuggestion from "./ui/TalkSuggestion.svelte";

    export let activeTalk: Talk;
    export let personalInfo: PersonalInfo;

    export let activeInput: Writable<FocusableTarget>

    let inputRef: FocusableTarget

    let unusedTalkFields: string[] = Object.keys(activeTalk).filter(publicKeysOnly)
    let usedTalkFields: string[] = []

    let unusedPersonalFields: string[] = Object.keys(personalInfo)
    let usedPersonalFields: string[] = []

    activeInput.subscribe((value) => {
        inputRef = value
    });


    const onClick = (key: string, personal = false) => {
        const dataSource = personal ? personalInfo : activeTalk
        const pasteSuccessful = simulateInput(inputRef, dataSource[key])
        if (pasteSuccessful) {
            if (!personal) {
                unusedTalkFields = [...unusedTalkFields.filter((field) => field !== key)]
                usedTalkFields = [...usedTalkFields, key]
            } else {
                unusedPersonalFields = [...unusedPersonalFields.filter((field) => field !== key)]
                usedPersonalFields = [...usedPersonalFields, key]
            }
        }
    }

    const onClickUsed = (key: string, personal = false) => {
        const dataSource = personal ? personalInfo : activeTalk
        simulateInput(inputRef, dataSource[key])
    }

</script>

<section class="flex flex-col gap-2 shadow-md py-2 px-3 text-sm bg-white font-medium overflow-y-auto border-2 border-primary-200" style="max-height: 200px">
    <div class="flex flex-row justify-between">
        <div class="flex flex-col flex-grow p-1 border-r-2">
            {#each unusedPersonalFields as unusedField}
                <TalkSuggestion on:click={() => onClick(unusedField, true)}>{unusedField}</TalkSuggestion>
            {/each}
        </div>
        <hr/>
        <div class="flex flex-col flex-grow p-1">
            {#each unusedTalkFields as unusedField}
                <TalkSuggestion on:click={() => onClick(unusedField)}>{unusedField}</TalkSuggestion>
            {/each}
        </div>
    </div>
    {#if usedPersonalFields.length > 0 || usedTalkFields.length > 0}
        <Accordion class="w-full" flush>
            <AccordionItem>
            <span slot="header">Show used</span>
                {#if usedPersonalFields.length > 0}
                    {#each usedPersonalFields as usedField}
                        <TalkSuggestion on:click={() => onClickUsed(usedField, true)}>{usedField}</TalkSuggestion>
                    {/each}
                {/if}
                {#if usedTalkFields.length > 0}
                    {#each usedTalkFields as usedField}
                        <TalkSuggestion on:click={() => onClickUsed(usedField)}>{usedField}</TalkSuggestion>
                    {/each}
                {/if}
            </AccordionItem>
        </Accordion>
    {/if}

</section>

