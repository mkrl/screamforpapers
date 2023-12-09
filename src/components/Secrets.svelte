<script lang="ts">
    import {storageSync} from "../storage";
    import Button from "flowbite-svelte/Button.svelte";
    import Input from 'flowbite-svelte/Input.svelte';
    import Label from 'flowbite-svelte/Label.svelte';
    import Toast from 'flowbite-svelte/Toast.svelte';
    import {onMount} from "svelte";

    let token: string;
    let repo: string;

    let successMessage: string | null = null;


    onMount(async () => {
        const { token: tokenRestored, repo: repoRestored } = await storageSync.get()
        token = tokenRestored ?? '';
        repo = repoRestored ?? '';
    });

    const save = async () => {
        await storageSync.set({ token, repo })
        successMessage = "Options saved!";

        setTimeout(() => {
            successMessage = null;
        }, 3000);
    }
</script>


<Label for="token">
    Github Token:
</Label>
<Input class="mb-3" bind:value={token} type="password" id="token" placeholder="Fine-grained read-only token is encouraged" />
<Label for="repo">
    Repo URL:
</Label>
<Input class="mb-3" bind:value={repo} type="text" id="repo" placeholder="Can be private, be sure the token has read access to it!" />
<div class="flex gap-4 items-start">
    <Button  pill on:click={save}>Save GitHub settings</Button>
    <Toast open={!!successMessage} color="green">{successMessage}</Toast>
</div>


