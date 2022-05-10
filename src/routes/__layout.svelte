<script lang="ts" context="module">
    import { browser } from '$app/env';
    import { page } from '$app/stores';

    /** @type {import('@sveltejs/kit').Load} */
    export async function load() {
        if (browser && !(crypto?.subtle && indexedDB)) {
            return {
                status: 302,
                redirect: '/error',
            };
        }
        return {};
    }
</script>

<script>
    import '../app.css';
</script>

<header class="grid grid-cols-3 bg-primary text-white dark:bg-primary-800">
    <div class="m-2">Crypto</div>
    {#if $page.url.pathname != '/'}
        <a
            sveltekit:prefetch
            href="/"
            class="justify-self-center px-4 py-2 hover:bg-white hover:text-primary dark:hover:bg-gray-900"
            >VOS CLÉS</a
        >
    {/if}
</header>

<slot />
