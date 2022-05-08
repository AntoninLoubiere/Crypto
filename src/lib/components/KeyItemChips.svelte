<script lang="ts">
    export let color: 'red' | 'blue' | 'green';
</script>

<div
    class="text-xs px-2 py-1 uppercase border rounded-full"
    class:red={color == 'red'}
    class:blue={color == 'blue'}
    class:green={color == 'green'}
>
    <slot />
</div>

<style>
    .red {
        @apply text-red-500 bg-red-50 dark:bg-red-500 border-red-500 dark:bg-opacity-10;
    }

    .blue {
        @apply text-blue-500 bg-blue-50 dark:bg-blue-500 border-blue-500 dark:bg-opacity-10;
    }

    .green {
        @apply text-green-500 bg-green-50 dark:bg-green-500 border-green-500 dark:bg-opacity-10;
    }
</style>
