<script lang="ts">
    import ExportModal from './modals/ExportModal.svelte';

    ('@hmr:keep-all');

    export let key: CryptoKeyDB | undefined;
    export let type: KeyType;

    let cryptoKey: CryptoKey | undefined;
    $: cryptoKey =
        type == 'secret' ? key?.secretKey : type == 'public' ? key?.publicKey : key?.privateKey;

    const TRANSLATED_TYPE: Record<KeyUsage, string> = {
        decrypt: 'Déchiffrer',
        encrypt: 'Chiffrer',
        deriveBits: 'Dériver des bits',
        deriveKey: 'Dériver une clé',
        sign: 'Signer',
        verify: 'Vérifier',
        wrapKey: 'Chiffrer une clé',
        unwrapKey: 'Déchiffrer une clé',
    };

    const listFormatter = new Intl.ListFormat();
    let exportModalOpened = false;
</script>

{#if cryptoKey}
    <div class="w-full rounded-md border-2 border-primary px-3 py-2">
        <h3 class="h3 text-center">
            {type == 'secret' ? 'Secret' : type == 'public' ? 'Clé publique' : 'Clé privée'}
        </h3>
        <div>
            <span class="font-bold">Utilisation :</span>
            {listFormatter.format(cryptoKey.usages.map((value) => TRANSLATED_TYPE[value]))}
        </div>
        {#if cryptoKey.extractable}
            <button class="button-coloured w-full" on:click={() => (exportModalOpened = true)}
                >Exporter</button
            >
        {/if}
        {#if type == 'private'}
            <button class="button-coloured w-full bg-red-500 ring-red-500">Supprimer</button>
        {/if}
    </div>

    <ExportModal {cryptoKey} bind:exportModalOpened />
{/if}
