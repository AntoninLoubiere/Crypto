<script lang="ts">
    import { browser } from '$app/env';
    import { getKey } from '$lib/crypto';
    import { getDataBase } from '$lib/database';
    import KeyItem from './KeyItem.svelte';

    let keys: CryptoKeyDB[] = [];

    async function loadKeys() {
        if (browser) {
            let database = await getDataBase();
            keys = await database.getAll('cryptoKeys');
            if (!keys.length) getKey(0);
        }
    }
    loadKeys();
</script>

<div class="m-2">
    <div class="pt-1 m-auto max-w-2xl bg-gray-100 dark:bg-gray-800 rounded-xl">
        <h1 class="h1 text-center my-2">Vos clés</h1>
        {#each keys as key}
            <KeyItem {key} />
        {/each}
    </div>
</div>
