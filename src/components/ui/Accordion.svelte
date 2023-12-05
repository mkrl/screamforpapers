<script lang="ts">
    export let label: string = ""

    let open = false

    const onClick = () => {
        open = !open
    }
</script>

<div class="accordion">
    <button on:click={onClick}>{label}<span>{open ? "-" : "+"}</span></button>
    <div class="contents" class:visible={open}>
        <slot />
    </div>
</div>

<style>
    .accordion {
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1em;
        margin: 0 0 1em 0;
    }
    .accordion > button {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .accordion .contents {
        display: none;
        transition: 0.4s;
    }
    .contents.visible {
        display: block;
    }
</style>
