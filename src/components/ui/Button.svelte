<script lang="ts">
    export let loading = false;
    export let label = "";
    export let disabled = false;

</script>

<button on:click disabled={loading || disabled}>{label}</button>

<style>
    button {
        cursor: pointer;
        border-radius: 2px;
        background-color: #166896;
        color: #ecf0f1;
        transition: background-color 0.3s;
        padding: 5px 10px;
        border: none;
    }

    button:disabled, button:disabled:hover {
        background-color: #7f8c8d;
    }

    button:hover,
    button:focus {
        background-color: #3984c0;
    }
</style>
