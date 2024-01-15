<script lang="ts">
  import EditOutline from 'flowbite-svelte-icons/EditOutline.svelte'
  import A from 'flowbite-svelte/A.svelte'
  import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte'
  import Input from 'flowbite-svelte/Input.svelte'
  import Button from 'flowbite-svelte/Button.svelte'
  import type { InputType } from 'flowbite-svelte'

  let collapsed = true
  export let value = ''
  export let type: InputType = 'text'

  export let onUpdate: (value: string) => void = () => {}
</script>

<div class="flex">
  {#if collapsed}
    <slot />
    <A
      class="group-hover:visible invisible cursor-pointer inline-flex ml-4"
      title="Edit"
      on:click={() => {
        collapsed = false
      }}><EditOutline class="cursor-pointer text-gray-400" /></A
    >
  {:else}
    <ButtonGroup class="w-full border-0 shadow-none h-5">
      <Button
        color="primary"
        on:click={() => {
          onUpdate(value)
          collapsed = true
        }}
        size="sm">Save</Button
      >
      <Input
        {type}
        autofocus
        class="border-none bg-white p-0 text-sm shadow-none pl-4"
        bind:value
        placeholder={value}
      />
    </ButtonGroup>
  {/if}
</div>
