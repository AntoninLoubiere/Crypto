<script lang="ts">
    import { browser } from '$app/env';
    import { getKey } from '$lib/crypto';
    import { getDataBase } from '$lib/database';
    import KeyItem from './KeyItem.svelte';
    import KeyGenerationModal from './modals/KeyGenerationModal.svelte';
    import KeyImportationModal from './modals/KeyImportationModal.svelte';

    let keys: CryptoKeyDB[] = [];

    let generateKey = false;
    let importKey = false;

    async function loadKeys() {
        if (browser) {
            let database = await getDataBase();
            keys = await database.getAll('cryptoKeys');
            if (!keys.length) getKey(0);
        }
    }
    loadKeys();
</script>

<div class="m-auto max-w-2xl ">
    <div class="m-2 rounded-xl bg-gray-100 pt-1 dark:bg-gray-800">
        <h1 class="h1 my-2 text-center">Vos clés</h1>
        {#each keys as key}
            <KeyItem {key} />
        {/each}
    </div>
    <div class="m-2 grid grid-rows-2 md:grid-cols-2 md:gap-2">
        <button class="button-coloured flex-grow" on:click={() => (importKey = true)}
            >Importer une clé</button
        >
        <button class="button-coloured flex-grow" on:click={() => (generateKey = true)}
            >Générer une clé</button
        >
    </div>
</div>

<KeyGenerationModal bind:opened={generateKey} />
<KeyImportationModal bind:opened={importKey} />
