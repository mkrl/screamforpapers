<script lang="ts">
  import SpeedDial from 'flowbite-svelte/SpeedDial.svelte'
  import SpeedDialButton from 'flowbite-svelte/SpeedDialButton.svelte'
  import ArrowDownToBraketSolid from 'flowbite-svelte-icons/ArrowDownToBraketSolid.svelte'
  import ArrowUpFromBracketOutline from 'flowbite-svelte-icons/ArrowUpFromBracketOutline.svelte'

  import {
    storageLocal,
    type TalkSubmission,
    type WishlistItem,
    type LocalExtensionStorage,
  } from '../../storage'
  import { validateSubmissions, validateWishlist } from '../../tools/helpers'

  export let items: TalkSubmission[] | WishlistItem[] = []
  let files: FileList | null = null
  export let dataType: 'submissions' | 'wishlist' = 'submissions'

  const onExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(items))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute(
      'download',
      `${dataType}-${new Date().getTime()}.json`
    )
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  $: if (files) {
    files[0].text().then((text) => {
      try {
        const parsedItems =
          dataType === 'submissions'
            ? validateSubmissions(JSON.parse(text))
            : validateWishlist(JSON.parse(text))
        if (parsedItems.length > 0) {
          const importData =
            dataType === 'submissions'
              ? { submissions: parsedItems }
              : { wishlist: parsedItems }
          storageLocal.set(importData as LocalExtensionStorage).then(() => {
            window.location.reload()
          })
        } else {
          alert(
            `No valid ${dataType} found in the file you are trying to import`
          )
        }
      } catch (e) {
        alert('The file you are trying to import is not a valid JSON file')
        return
      }
    })
  }

  const onClickImport = () => {
    const input = document.getElementById(`importFile${dataType}`)
    if (input) {
      input.click()
    }
  }
</script>

<input
  type="file"
  id={`importFile${dataType}`}
  accept="text/json"
  class="hidden"
  bind:files
/>
<SpeedDial defaultClass="relative" placement="left">
  <SpeedDialButton on:click={onClickImport} name="Import" tooltip="top">
    <ArrowDownToBraketSolid class="w-5 h-5" />
  </SpeedDialButton>

  {#if items.length !== 0}
    <SpeedDialButton on:click={onExport} name="Export" tooltip="top">
      <ArrowUpFromBracketOutline class="w-5 h-5" />
    </SpeedDialButton>
  {/if}
</SpeedDial>
