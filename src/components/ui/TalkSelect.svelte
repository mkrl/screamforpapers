<script lang="ts">
  import Select from 'flowbite-svelte/Select.svelte'
  import type { Talk } from '../../storage.js'

  export let options: Talk[] = []
  export let displayFn: (talk: Talk) => string = () => 'option'
  export let index = 0
  export let value

  $: {
    value = options[index]
  }
</script>

<Select class="mb-3" id="talkSelector" bind:value={index}>
  {#each options as option, i}
    <option value={i}>{displayFn(option)}</option>
  {/each}
</Select>
