<script lang="ts">
  let className: string
  export { className as class }
</script>

<div class={`flex gap-2 w-full items-center ${className}`}>
  <div class="my-1 h-px bg-gray-100 dark:bg-gray-600 w-full"></div>
  <span class="text-gray-500 dark:text-gray-400 text-sm italic"><slot /></span>
  <div class="my-1 h-px bg-gray-100 dark:bg-gray-600 w-full"></div>
</div>
