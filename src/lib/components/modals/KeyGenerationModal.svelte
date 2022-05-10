<script lang="ts">
    import { goto } from '$app/navigation';

    import { generateKey } from '$lib/crypto';

    import Modal from './Modal.svelte';
    export let opened: boolean;

    let name = '';
    let nameInput: HTMLInputElement;
    $: isValid = !!name.length;

    let generationInProgress = false;
    $: if (!opened) {
        name = '';
        generationInProgress = false;
    } else {
        if (nameInput) nameInput.focus();
    }

    async function generate() {
        generationInProgress = true;
        try {
            let key = await generateKey('RSA-OAEP', name);
            goto(`/Crypto/key?key=${key.keyId}`);
        } finally {
            generationInProgress = false;
        }
    }
</script>

<Modal bind:opened>
    <span slot="title">Générer une clé</span>
    <div class="flex items-center gap-2">
        <label for="name">Nom: </label>
        <input
            type="text"
            class="input flex-grow"
            id="name"
            placeholder="Nom de la clé"
            required
            bind:this={nameInput}
            bind:value={name}
        />
    </div>
    <p>
        <i class="opacity-50"
            >Options non disponible actuellement... Généreras une paire de clé RSA-OAEP (chiffrement
            asymétrique).
        </i>
    </p>
    <div class="flex flex-col md:flex-row-reverse md:gap-2">
        <button
            class="button-coloured"
            disabled={!isValid || generationInProgress}
            on:click={generate}>Générer</button
        >
        <button class="button-text">Annuler</button>
    </div>
</Modal>
