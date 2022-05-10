<script lang="ts" context="module">
    import type { LoadInput, LoadOutput } from '@sveltejs/kit';

    export async function load({ stuff }: LoadInput): Promise<LoadOutput> {
        return {
            props: { key: stuff.key },
        };
    }
</script>

<script lang="ts">
    import CryptoKeyInfo from '$lib/components/CryptoKeyInfo.svelte';
    import { getDataBase } from '$lib/database';
    import { goto } from '$app/navigation';
    import DateFormatter from '$lib/components/DateFormatter.svelte';
    import RelativeDateFormatter from '$lib/components/RelativeDateFormatter.svelte';

    export let key: CryptoKeyDB | undefined;

    async function removeKey() {
        if (key?.keyId != undefined) {
            const db = await getDataBase();
            await db.delete('cryptoKeys', key.keyId);

            goto('/Crypto');
        }
    }
</script>

<svelte:head>
    <title>Clé {key?.name.substring(0, 30)}{(key?.name.length || 0) > 30 ? '…' : ''} - Crypto</title
    >
</svelte:head>

<div class="group relative">
    <h1 class="h1 text-center">{key?.name}</h1>
    <!-- TODO -->
    <button class="absolute top-0 bottom-0 right-1 hidden group-hover:block">Modifier</button>
</div>

<div>
    <span class="font-bold">Date de création :</span>
    <RelativeDateFormatter
        dateTo={key?.creationDate || new Date()}
        options={{ intl: { numeric: 'auto' } }}
    /> (<DateFormatter
        date={key?.creationDate}
        options={{ dateStyle: 'long', timeStyle: 'short' }}
    />)
</div>

<div>
    <span class="font-bold">Dernière utilisation :</span>
    <RelativeDateFormatter
        dateTo={key?.useDate || new Date()}
        options={{ intl: { numeric: 'auto' } }}
    /> (<DateFormatter date={key?.useDate} options={{ dateStyle: 'long', timeStyle: 'short' }} />)
</div>

<div>
    <span class="font-bold">Algorithme :</span>
    {key?.algorithm}
</div>

<div>
    <span class="font-bold">Exportable :</span>
    {(key?.publicKey || key?.secretKey || key?.privateKey)?.extractable ? 'Oui' : 'Non'}
</div>

<div class="my-2 flex flex-col justify-center gap-4 md:flex-row">
    <CryptoKeyInfo {key} type="secret" />
    <CryptoKeyInfo {key} type="public" />
    <CryptoKeyInfo {key} type="private" />
</div>

<button class="button-coloured w-full bg-red-500 ring-red-500" on:click={removeKey}
    >Supprimer la clé</button
>
