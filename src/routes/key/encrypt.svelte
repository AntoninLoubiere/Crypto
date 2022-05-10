<script lang="ts">
    import CopyButton from '$lib/components/CopyButton.svelte';
    import { page } from '$app/stores';
    import { encrypt } from '$lib/crypto';

    let text: string;
    let cipher = '';

    async function onEncryptButton() {
        cipher = await encrypt(text, $page.stuff.key);
    }
</script>

<svelte:head>
    <title>Chiffrer - Crypto</title>
</svelte:head>

<textarea bind:value={text} class="textarea h-52 w-full" />
<button on:click={onEncryptButton} class="button-coloured w-full">Chiffrer</button>
{#if cipher}
    <p class="m-auto w-max whitespace-pre-line font-mono">{cipher}</p>
    <CopyButton text={cipher} />
{/if}
