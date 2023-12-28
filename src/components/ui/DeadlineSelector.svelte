<script lang="ts">
  import Input from 'flowbite-svelte/Input.svelte'
  import Label from 'flowbite-svelte/Label.svelte'
  import Button from 'flowbite-svelte/Button.svelte'
  import { storageLocal } from '../../storage'
  import P from 'flowbite-svelte/P.svelte'

  let value = ''
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
              name: tab.title,
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
</script>

{#if !saved}
  <form class="flex flex-col" on:submit|preventDefault={onSubmit}>
    <Label for="date" class="mb-2">What's the submission deadline?</Label>
    <Input type="date" id="date" bind:value required class="mb-6" />
    <Button type="submit" pill outline>Save</Button>
  </form>
{:else}
  <P class="text-gray-500 dark:text-gray-400 mb-4"
    >Done! You access your memo in the dashboard</P
  >
{/if}
