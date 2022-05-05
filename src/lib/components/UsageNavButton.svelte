<script lang="ts">
    import { page } from '$app/stores';
    import { isCompatible, isUsage } from '$lib/crypto';

    export let key: CryptoKeyDB | undefined;
    export let usage: string;

    $: active = $page.url.pathname == (usage ? '/key/' + usage : '/key');
</script>

{#if key && (!isUsage(usage) || isCompatible(key, usage))}
    <a href="/key/{usage}?key={key.keyId}" class="uppercase px-2 py-1" class:active><slot /></a>
{/if}

<style>
    .active {
        @apply text-white bg-primary rounded-lg;
    }
</style>
