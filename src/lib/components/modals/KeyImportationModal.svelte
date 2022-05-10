<script lang="ts">
    import { goto } from '$app/navigation';

    import { importKey } from '$lib/crypto';

    import Modal from './Modal.svelte';

    export let opened: boolean;

    let name = '';
    let publicKey = '';
    let privateKey = '';
    let importationInProgress = false;
    let nameInput: HTMLInputElement;
    $: isValid = !!name.length && publicKey.length;

    $: if (!opened) {
        name = '';
        importationInProgress = false;
    } else {
        if (nameInput) nameInput.focus();
    }

    async function _importKey() {
        importationInProgress = true;
        try {
            const key = await importKey(
                'RSA-OAEP',
                {
                    key: publicKey,
                    privateKey: privateKey.length ? privateKey : undefined,
                },
                name
            );
            goto(`/Crypto/key?key=${key.keyId}`);
        } finally {
            importationInProgress = false;
        }
    }
</script>

<Modal bind:opened>
    <span slot="title">Importer une clé</span>
    <div class="flex flex-col gap-2">
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
        <label for="publicKey">Clé publique :</label>
        <textarea
            id="publicKey"
            class="textarea h-40 w-full"
            required
            placeholder="-----BEGIN PUBLIC KEY----- …"
            bind:value={publicKey}
        />

        <label for="privateKey">Clé privée (optionnelle) :</label>
        <textarea
            id="privateKey"
            class="textarea h-40 w-full"
            placeholder="-----BEGIN PRIVATE KEY----- …"
            bind:value={privateKey}
        />

        <div class="flex flex-col md:flex-row-reverse md:gap-2">
            <button
                class="button-coloured"
                disabled={!isValid || importationInProgress}
                on:click={_importKey}>Importer</button
            >
            <button class="button-text">Annuler</button>
        </div>
    </div>
</Modal>
