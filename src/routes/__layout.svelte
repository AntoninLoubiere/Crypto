<script lang="ts" context="module">
    import { browser } from '$app/env';

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

<slot />
