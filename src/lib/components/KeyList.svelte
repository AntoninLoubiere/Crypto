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

{#each keys as key}
    <KeyItem {key} />
{/each}
