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
</style>
