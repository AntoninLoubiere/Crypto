<script lang="ts">
    import { decrypt } from '$lib/crypto';

    let cipher: string;
    let text: string = '';

    async function onDecryptButton() {
        text = await decrypt(cipher, 0);
    }
</script>

<textarea bind:value={cipher} class="w-full font-mono" />
<button on:click={onDecryptButton}>Déchiffrer</button>
<p>{text}</p>
