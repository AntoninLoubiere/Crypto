<script lang="ts">
    import { page } from '$app/stores';

    import { decrypt } from '$lib/crypto';

    let cipher: string;
    let text = '';

    async function onDecryptButton() {
        text = await decrypt(cipher, $page.stuff.key);
    }
</script>

<svelte:head>
    <title>Déchiffrer - Crypto</title>
</svelte:head>

<textarea bind:value={cipher} class="textarea h-52 w-full font-mono" />
<button on:click={onDecryptButton} class="button-coloured w-full">Déchiffrer</button>
<p>{text}</p>
