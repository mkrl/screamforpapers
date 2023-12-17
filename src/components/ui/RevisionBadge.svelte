<script lang="ts">
    export let sha: string = ""
    export let link: string = ""
</script>

<code class="bg-gray-200 p-1 rounded-md"><a href="{link}" target="_blank">{sha.slice(0,7)}</a></code>