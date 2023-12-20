<script lang="ts">
</script>

<button class="suggestion" on:click><slot/></button>

<style>
    .suggestion {
        background-color: #fff;
        border: 0;
        border-bottom: 1px solid #ccc;
        border-radius: 0;
        color: #333;
        cursor: pointer;
        display: block;
        font-size: 14px;
        margin: 0;
        padding: 10px;
        text-align: left;
        width: 100%;
    }

    .suggestion:hover {
        background-color: #eee;
    }

    .suggestion:last-of-type {
        border-bottom: 0;
    }
</style>