<script lang="ts">
    import type {PersonalInfo, Talk} from "../storage";
    import {getTalkName, publicKeysOnly} from '../tools/helpers.js'
    import Button from "./ui/Button.svelte";
    import Accordion from "./ui/Accordion.svelte";

    export let activeTalk: Talk;
    export let personalInfo: PersonalInfo;

    let unusedTalkFields: string[] = Object.keys(activeTalk).filter(publicKeysOnly)
    let usedTalkFields: string[] = []

    let unusedPersonalFields: string[] = Object.keys(personalInfo)
    let usedPersonalFields: string[] = []



    const onClick = (key: string, personal = false) => {
        if (!personal) {
            unusedTalkFields = [...unusedTalkFields.filter((field) => field !== key)]
            usedTalkFields = [...usedTalkFields, key]
        } else {
            unusedPersonalFields = [...unusedPersonalFields.filter((field) => field !== key)]
            usedPersonalFields = [...usedPersonalFields, key]
        }
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
    <Accordion label="Show used">
        {#each usedPersonalFields as usedField}
            <Button label={usedField} />
        {/each}
        <hr/>
        {#each usedTalkFields as usedField}
            <Button label={usedField} />
        {/each}
    </Accordion>

</section>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }
</style>
