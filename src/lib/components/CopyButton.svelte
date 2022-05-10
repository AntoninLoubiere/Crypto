<script lang="ts">
    import { autoResetStore } from '$lib/stores';

    export let text: string;
    export let resetTime = 2000;
    let textCopied = autoResetStore(false, resetTime);

    async function copyText() {
        await navigator.clipboard.writeText(text);
        $textCopied = true;
    }
</script>

<button class="button-coloured w-full" on:click={copyText} class:bg-green-500={$textCopied}
    >{$textCopied ? 'Copié !' : 'Copier'}</button
>
