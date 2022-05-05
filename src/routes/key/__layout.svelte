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
    import UsageNavButton from '$lib/components/UsageNavButton.svelte';

    export let key: CryptoKeyDB | undefined;
</script>

<div class="p-2 grid grid-cols-3 bg-primary-200 items-center">
    <span>Clé: {key?.name}</span>
    <nav class="flex justify-center gap-2 justify-items-center">
        <UsageNavButton {key} usage="">Informations</UsageNavButton>
        <UsageNavButton {key} usage="encrypt">Chiffrer</UsageNavButton>
        <UsageNavButton {key} usage="decrypt">Déchiffrer</UsageNavButton>
        <UsageNavButton {key} usage="sign">Signer</UsageNavButton>
        <UsageNavButton {key} usage="verify">Vérifier</UsageNavButton>
    </nav>
</div>
<slot />
