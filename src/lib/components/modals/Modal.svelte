<script lang="ts">
    import { fade, fly } from 'svelte/transition';

    export let opened = true;
    export let closable = true;

    function closePopup() {
        if (closable) opened = false;
    }
</script>

{#if opened}
    <div
        class="absolute top-0 bottom-0 left-0 right-0 grid place-content-center bg-black bg-opacity-50"
        transition:fade={{ duration: 200 }}
        on:click|self={closePopup}
    >
        <div class="max-h-screen w-screen md:p-4" on:click|self={closePopup}>
            <div
                class="m-auto flex h-full w-full max-w-4xl flex-col bg-gray-100 dark:bg-gray-800 md:w-auto md:rounded-xl"
                transition:fly={{ y: -100, duration: 200 }}
            >
                <header
                    class="flex items-center bg-primary px-3 py-2 text-center text-white dark:bg-primary-800 md:rounded-t-xl"
                >
                    <h1 class="h1 flex-grow"><slot name="title">Modal</slot></h1>
                    {#if closable}
                        <button
                            class="grid h-8 w-8 place-items-center rounded-full hover:bg-white hover:text-primary"
                            on:click={closePopup}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    {/if}
                </header>
                <div class="h-full overflow-y-auto px-3 py-2">
                    <slot />
                </div>
            </div>
        </div>
    </div>
{/if}
