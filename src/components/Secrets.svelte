<script lang="ts">
  import { storageSync } from '../storage'
  import Button from 'flowbite-svelte/Button.svelte'
  import Input from 'flowbite-svelte/Input.svelte'
  import Label from 'flowbite-svelte/Label.svelte'
  import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte'
  import { onMount } from 'svelte'

  let token: string
  let repo: string
  const isOnboarding = window.location.search.includes('welcome')

  let successMessage: string | null = null

  onMount(async () => {
    const { token: tokenRestored, repo: repoRestored } = await storageSync.get()
    token = tokenRestored ?? ''
    repo = repoRestored ?? ''
  })

  const save = async () => {
    await storageSync.set({ token, repo })
    successMessage = 'Options saved'

    setTimeout(() => {
      successMessage = null
    }, 3000)
  }

  const onboard = () => {
    const { origin, pathname } = window.location
    window.location.href = `${origin}${pathname}${
      isOnboarding ? '' : '?welcome'
    }`
  }
</script>

<Label for="token">Github Token:</Label>
<Input
  class="mb-3"
  bind:value={token}
  type="password"
  id="token"
  placeholder="Fine-grained read-only token is encouraged"
/>
<Label for="repo">Repo URL:</Label>
<Input
  class="mb-6"
  bind:value={repo}
  type="text"
  id="repo"
  placeholder="Can be private, be sure the token has read access to it!"
/>

<div class="flex justify-between">
  <Button pill on:click={save} color="primary">Save GitHub settings</Button>
  <Button pill on:click={onboard} color="alternative"
    >{isOnboarding
      ? 'Skip the tour, let me cook'
      : 'Open onboarding tour'}</Button
  >
</div>

{#if successMessage}
  <span class="ml-4 text-gray-400 italic text-base">{successMessage}</span>
{/if}
