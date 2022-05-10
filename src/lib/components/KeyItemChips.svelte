<script lang="ts">
    export let color: 'red' | 'blue' | 'green';
</script>

<div
    class="rounded-full border px-2 py-1 text-xs uppercase"
    class:red={color == 'red'}
    class:blue={color == 'blue'}
    class:green={color == 'green'}
>
    <slot />
</div>

<style>
    .red {
        @apply border-red-500 bg-red-50 text-red-500 dark:bg-red-500 dark:bg-opacity-10;
    }

    .blue {
        @apply border-blue-500 bg-blue-50 text-blue-500 dark:bg-blue-500 dark:bg-opacity-10;
    }

    .green {
        @apply border-green-500 bg-green-50 text-green-500 dark:bg-green-500 dark:bg-opacity-10;
    }
</style>
