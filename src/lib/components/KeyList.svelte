<script lang="ts">
    import { browser } from '$app/env';
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
        }
    }
    loadKeys();
</script>

<div class="m-auto max-w-2xl ">
    <div class="m-2 rounded-xl bg-gray-100 pt-1 dark:bg-gray-800">
        <h1 class="h1 my-2 text-center">Vos clés</h1>
        {#if keys.length}
            <ul>
                {#each keys as key}
                    <li class="group"><KeyItem {key} /></li>
                {/each}
            </ul>
        {:else}
            <div class="mx-3 pb-3">
                <h3 class="h3">Aucune clé disponible.</h3>
                <p>Veuillez en générer ou en importer une.</p>
            </div>
        {/if}
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
