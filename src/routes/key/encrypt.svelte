<script lang="ts">
    import { page } from '$app/stores';

    import { encrypt } from '$lib/crypto';
    import { autoResetStore } from '$lib/stores';

    let text: string;
    let cipher: string = '';
    let textCopied = autoResetStore(false, 2000);

    async function onEncryptButton() {
        cipher = await encrypt(text, $page.stuff.key);
    }

    async function copyCipher() {
        await navigator.clipboard.writeText(cipher);
        $textCopied = true;
    }
</script>

<svelte:head>
    <title>Chiffrer - Crypto</title>
</svelte:head>

<textarea bind:value={text} class="textarea w-full h-52" />
<button on:click={onEncryptButton} class="w-full button-coloured">Chiffrer</button>
<p class="whitespace-pre-line font-mono w-max m-auto">{cipher}</p>
{#if cipher}
    <button class="button-coloured w-full" on:click={copyCipher} class:bg-green-500={$textCopied}
        >{$textCopied ? 'Copié !' : 'Copier'}</button
    >
{/if}
