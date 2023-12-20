<script lang="ts">
    import type {PersonalInfo, Talk} from "../storage";
    import {publicKeysOnly, simulateInput} from '../tools/helpers'
    import type {FocusableTarget} from '../tools/helpers'

    import Accordion from "./ui/Accordion.svelte";
    import TalkSuggestion from "./ui/TalkSuggestion.svelte";
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

<section class="shadow selector" style="max-height: 200px">
    <div class="slots">
        <div>
            {#each unusedPersonalFields as unusedField}
                <TalkSuggestion on:click={() => onClick(unusedField, true)}>{unusedField}</TalkSuggestion>
            {/each}
        </div>
        <hr/>
        <div>
            {#each unusedTalkFields as unusedField}
                <TalkSuggestion on:click={() => onClick(unusedField)}>{unusedField}</TalkSuggestion>
            {/each}
        </div>
    </div>
    {#if usedPersonalFields.length > 0 || usedTalkFields.length > 0}
        <Accordion>
            <span slot="header">Show used</span>
            <div class="slots">
                <div>
                    {#if usedPersonalFields.length > 0}
                        {#each usedPersonalFields as usedField}
                            <TalkSuggestion on:click={() => onClickUsed(usedField, true)}>{usedField}</TalkSuggestion>
                        {/each}
                    {/if}
                </div>
                <hr/>
                <div>
                    {#if usedTalkFields.length > 0}
                        {#each usedTalkFields as usedField}
                            <TalkSuggestion on:click={() => onClickUsed(usedField)}>{usedField}</TalkSuggestion>
                        {/each}
                    {/if}
                </div>
            </div>
        </Accordion>
    {/if}

</section>

<style>
    .selector {
        all: unset;
        gap: 0.5rem;
        background-color: white;
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        overflow-y: auto;
        border: 2px solid rgb(255 228 222);
    }

    .slots {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2px solid rgb(255 228 222);
    }
    .slots > div {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .slots > hr {
        border: 0;
        width: 2px;
        background-color: rgb(255 228 222);
        margin: 0;
    }

    .shadow {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
</style>