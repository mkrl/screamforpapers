<script lang="ts">
    import type {PersonalInfo, Talk} from "../storage";
    import {getTalkName, publicKeysOnly, simulateInput} from '../tools/helpers'
    import type {FocusableTarget} from '../tools/helpers'

    import Button from "flowbite-svelte/Button.svelte";
    import AccordionItem from "flowbite-svelte/AccordionItem.svelte";
    import Accordion from "flowbite-svelte/Accordion.svelte";
    import type {Writable} from "svelte/store";

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

<section class="flex flex-col max-w-xs gap-2 sfp-tooltip-content rounded-lg shadow-md py-2 px-3 text-sm bg-gray-700 font-medium">
    <h5 class="text-lg font-bold tracking-tight text-white w-full">About me</h5>
    {#each unusedPersonalFields as unusedField}
        <Button pill on:click={() => onClick(unusedField, true)}>{unusedField}</Button>
    {/each}
    <h5 class="mb-2 text-lg font-bold tracking-tight text-white w-full">{getTalkName(activeTalk)}</h5>
    {#each unusedTalkFields as unusedField}
        <Button pill on:click={() => onClick(unusedField)}>{unusedField}</Button>
    {/each}
    {#if usedPersonalFields.length > 0 || usedTalkFields.length > 0}
        <Accordion color="dark" class="w-full" flush>
            <AccordionItem>
            <span slot="header" class="text-white">Show used</span>
                <div class="flex flex-row gap-2">
                    {#if usedPersonalFields.length > 0}
                        <div class="flex flex-col flex-grow gap-2">
                            {#each usedPersonalFields as usedField}
                                <Button on:click={() => onClickUsed(usedField, true)}>{usedField}</Button>
                            {/each}
                        </div>
                    {/if}
                {#if usedTalkFields.length > 0}
                    <div class="flex flex-col flex-grow gap-2">
                        {#each usedTalkFields as usedField}
                            <Button on:click={() => onClickUsed(usedField)}>{usedField}</Button>
                        {/each}
                    </div>
                {/if}
                </div>
            </AccordionItem>
        </Accordion>
    {/if}

</section>

