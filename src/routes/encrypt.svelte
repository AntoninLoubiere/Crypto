<script lang="ts">
    import { encrypt } from '$lib/crypto';

    let text: string;
    let cipher: string = '';

    async function onEncryptButton() {
        cipher = await encrypt(text, 0);
    }
</script>

<div class="m-4">
    <textarea bind:value={text} class="form-textarea w-full" />
    <button on:click={onEncryptButton}>Chiffrer</button>
    <p class="whitespace-pre font-mono">{cipher}</p>
</div>
