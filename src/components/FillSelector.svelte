<script lang="ts">
    import type {PersonalInfo, Talk} from "../storage";
    import {getTalkName, publicKeysOnly, simulateInput} from '../tools/helpers'
    import type {FocusableTarget} from '../tools/helpers'
    import Button from "./ui/Button.svelte";
    import Accordion from "./ui/Accordion.svelte";
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
        simulateInput(inputRef, dataSource[key])
        if (!personal) {
            unusedTalkFields = [...unusedTalkFields.filter((field) => field !== key)]
            usedTalkFields = [...usedTalkFields, key]
        } else {
            unusedPersonalFields = [...unusedPersonalFields.filter((field) => field !== key)]
            usedPersonalFields = [...usedPersonalFields, key]
        }
    }

    const onClickUsed = (key: string, personal = false) => {
        const dataSource = personal ? personalInfo : activeTalk
        simulateInput(inputRef, dataSource[key])
    }

</script>

<section class="container">
    <h1>About me</h1>
    {#each unusedPersonalFields as unusedField}
        <Button label={unusedField} on:click={() => onClick(unusedField, true)} />
    {/each}
    <h1>{getTalkName(activeTalk)}</h1>
    <hr>
    {#each unusedTalkFields as unusedField}
        <Button label={unusedField} on:click={() => onClick(unusedField)} />
    {/each}
    <hr/>
    {#if usedPersonalFields.length > 0 || usedTalkFields.length > 0}
        <Accordion label="Show used">
            {#each usedPersonalFields as usedField}
                <Button label={usedField} on:click={() => onClickUsed(usedField, true)} />
            {/each}
            <hr/>
            {#each usedTalkFields as usedField}
                <Button label={usedField} on:click={() => onClickUsed(usedField)} />
            {/each}
        </Accordion>
    {/if}

</section>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    /* Global selectors for tooltip styling, handled by Svelte due to bundling shenanigans */

    :global(#sfp-tooltip) {
        background: #333;
        color: white;
        font-weight: bold;
        padding: 4px 8px;
        font-size: 13px;
        border-radius: 4px;
    }

    :global(.sfp-tooltip-arrow),
    :global(.sfp-tooltip-arrow::before) {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
    }

    :global(.sfp-tooltip-arrow){
        visibility: hidden;
    }

    :global(.sfp-tooltip-arrow::before) {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
    }

    :global(#sfp-tooltip[data-popper-placement^='top']) > :global(.sfp-tooltip-arrow) {
        bottom: -4px;
    }

    :global(#sfp-tooltip[data-popper-placement^='bottom']) > :global(.sfp-tooltip-arrow) {
        top: -4px;
    }

    :global(#sfp-tooltip[data-popper-placement^='left']) > :global(.sfp-tooltip-arrow) {
        right: -4px;
    }

    :global(#sfp-tooltip[data-popper-placement^='right']) > :global(.sfp-tooltip-arrow) {
        left: -4px;
    }
</style>
