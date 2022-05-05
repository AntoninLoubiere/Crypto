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

<header class="bg-primary text-white grid grid-cols-3">
    <div class="m-2">Crypto</div>
    {#if $page.url.pathname != '/'}
        <a href="/" class="px-4 py-2 justify-self-center hover:bg-white hover:text-primary"
            >VOS CLÉS</a
        >
    {/if}
</header>

<slot />
