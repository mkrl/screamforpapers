<script lang="ts">
  let expanded = false

  const onExpand = () => {
    expanded = !expanded
  }
</script>

<h2 class="group">
  <button type="button" aria-expanded={expanded} on:click={onExpand}>
    <slot name="header" />
    {#if !expanded}
      <svg
        class="w-3 h-3 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        ></path>
      </svg>
    {/if}
    {#if expanded}
      <svg
        class="w-3 h-3 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 5 4-4 4 4"
        ></path>
      </svg>
    {/if}
  </button>
</h2>
<section class="content" class:active={expanded}>
  <slot />
</section>

<style>
  .group {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }
  .group button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0.5rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }
  .group button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .group svg {
    width: 0.5rem;
    height: 0.5rem;
  }
  .content {
    display: none;
  }

  .active {
    display: block;
  }
</style>
