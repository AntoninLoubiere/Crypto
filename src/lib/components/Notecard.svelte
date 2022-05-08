<script lang="ts">
    export let type: 'error';
</script>

<div class="my-3 px-3 py-2 border-l-4 rounded-r-lg" class:error={type == 'error'}>
    <slot />
</div>

<style>
    .error {
        @apply border-red-600 dark:border-red-500 bg-red-300 dark:bg-red-900 dark:bg-opacity-50;
    }
</style>
