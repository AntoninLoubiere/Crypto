<script lang="ts">
    import { page } from '$app/stores';
    import { isCompatible, isUsage } from '$lib/crypto';

    export let key: CryptoKeyDB | undefined;
    export let usage: string;

    $: active = $page.url.pathname == (usage ? '/key/' + usage : '/key');
</script>

{#if key && (!isUsage(usage) || isCompatible(key, usage))}
    <a
        sveltekit:prefetch
        href="/key/{usage}?key={key.keyId}"
        class="px-2 py-1 uppercase"
        class:active><slot /></a
    >
{/if}

<style>
    .active {
        @apply rounded-lg bg-primary text-white dark:bg-primary-800;
    }
</style>
