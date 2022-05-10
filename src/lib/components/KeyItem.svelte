<script lang="ts">
    import KeyItemChips from './KeyItemChips.svelte';

    export let key: CryptoKeyDB;
</script>

<a
    sveltekit:prefetch
    href="/Crypto/key/?key={key.keyId}"
    class="flex flex-wrap items-center gap-2 px-3 py-2 hover:bg-gray-300
                group-last:rounded-b-xl dark:hover:bg-gray-600"
>
    <h3 class="h3 inline max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {key.name}
    </h3>
    {#if key.secretKey}
        <KeyItemChips color="green">Secret</KeyItemChips>
    {/if}
    {#if key.publicKey}
        <KeyItemChips color="blue">Clé publique</KeyItemChips>
    {/if}
    {#if key.privateKey}
        <KeyItemChips color="red">Clé privée</KeyItemChips>
    {/if}
</a>
