<script>
  export let options = [];
  export let displayFn = a => a;
  export let index = 0;
  export let value;

  $: {
    value = options[index];
  }
</script>

<select bind:value={index}>
    {#each options as option, i}
        <option value={i}>{displayFn(option)}</option>
    {/each}
</select>