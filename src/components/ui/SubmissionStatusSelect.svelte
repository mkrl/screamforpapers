<script lang="ts">
  import Select from 'flowbite-svelte/Select.svelte'
  import { SubmissionStatus } from '../../storage.js'
  import { Confetti } from 'svelte-confetti'
  export let value: SubmissionStatus
  let showConfetti = false

  const COLOR_MAP = {
    [SubmissionStatus.PENDING]: 'text-gray-500',
    [SubmissionStatus.REJECTED]: 'text-red-600',
    [SubmissionStatus.APPROVED]: 'text-green-500',
  }

  export let onChange: (value: SubmissionStatus) => void = () => {}

  const onChangeValue = () => {
    onChange(value)
    if (value === SubmissionStatus.APPROVED) {
      showConfetti = true
      setTimeout(() => {
        showConfetti = false
      }, 3000)
    }
  }
</script>

{#if showConfetti}
  <div class="absolute z-50 pointer-events-none">
    <Confetti x={[-3, 3]} />
  </div>
{/if}
<Select
  bind:value
  on:change={onChangeValue}
  placeholder=""
  class={`border-none p-1 bg-inherit ${COLOR_MAP[value]}`}
>
  <option class="text-black" value={SubmissionStatus.PENDING}>Pending</option>
  <option class="text-black" value={SubmissionStatus.REJECTED}>Rejected</option>
  <option class="text-black" value={SubmissionStatus.APPROVED}>Approved</option>
</Select>
