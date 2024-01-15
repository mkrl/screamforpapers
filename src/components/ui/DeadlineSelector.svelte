<script lang="ts">
  import Input from 'flowbite-svelte/Input.svelte'
  import Label from 'flowbite-svelte/Label.svelte'
  import Button from 'flowbite-svelte/Button.svelte'
  import { storageLocal } from '../../storage'
  import P from 'flowbite-svelte/P.svelte'
  import { onMount } from 'svelte'

  let value = ''
  let titleValue = ''
  let originalTitle = ''
  let saved = false

  const onSubmit = async () => {
    const date = new Date(value)
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    if (tab.url && tab.title) {
      const { wishlist } = await storageLocal.get()
      if (wishlist) {
        await storageLocal.set({
          wishlist: [
            ...wishlist,
            {
              dateEnds: String(date),
              url: tab.url,
              name: titleValue.length > 0 ? titleValue : originalTitle,
              done: false,
            },
          ],
        })
        saved = true
      }
    } else {
      console.error('Not a valid tab')
    }
  }

  onMount(async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    if (tab.url && tab.title) {
      titleValue = tab.title
      originalTitle = tab.title
    }
  })
</script>

{#if !saved}
  <form class="flex flex-col" on:submit|preventDefault={onSubmit}>
    <Label for="date" class="mb-2">What's the submission deadline?</Label>
    <Input type="date" id="date" bind:value required class="mb-6" />
    <Label for="date" class="mb-2">How do you want to remember this?</Label>
    <Input
      type="text"
      id="sub-title"
      bind:value={titleValue}
      placeholder={originalTitle}
      class="mb-6"
    />
    <Button type="submit" pill outline>Save</Button>
  </form>
{:else}
  <P class="text-gray-500 dark:text-gray-400 mb-4"
    >Done! You access your memo in the dashboard</P
  >
{/if}
