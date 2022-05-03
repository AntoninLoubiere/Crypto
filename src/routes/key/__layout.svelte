<script lang="ts" context="module">
    import { browser } from '$app/env';
    import { getDataBase } from '$lib/database';
    import type { LoadInput, LoadOutput } from '@sveltejs/kit';

    export async function load({ url }: LoadInput): Promise<LoadOutput> {
        let key;
        if (browser && url.searchParams.has('key')) {
            let keyId = Number(url.searchParams.get('key'));
            if (!isNaN(keyId)) key = await (await getDataBase()).get('cryptoKeys', keyId);
        }
        if (browser && !key) {
            return {
                status: 302,
                redirect: '/',
            };
        }
        return {
            stuff: {
                key,
            },
            props: {
                key,
            },
        };
    }
</script>

<script lang="ts">
    export let key: CryptoKeyDB | undefined;
</script>

<nav>
    <a href="/">Retour</a>
    <a href="/key/encrypt?key={key?.keyId}">Chiffrer</a>
    <a href="/key/decrypt?key={key?.keyId}">Déchiffrer</a>
</nav>
<div>Key: {key?.name}</div>
<slot />
