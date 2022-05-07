<script lang="ts">
    import { page } from '$app/stores';

    import { decrypt } from '$lib/crypto';

    let cipher: string;
    let text: string = '';

    async function onDecryptButton() {
        text = await decrypt(cipher, $page.stuff.key);
    }
</script>

<svelte:head>
    <title>Déchiffrer - Crypto</title>
</svelte:head>

<textarea bind:value={cipher} class="textarea w-full font-mono h-52" />
<button on:click={onDecryptButton} class="w-full button-coloured">Déchiffrer</button>
<p>{text}</p>
