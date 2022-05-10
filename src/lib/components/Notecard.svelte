<script lang="ts">
    export let type: 'error';
</script>

<div class="my-3 rounded-r-lg border-l-4 px-3 py-2" class:error={type == 'error'}>
    <slot />
</div>

<style>
    .error {
        @apply border-red-600 bg-red-300 dark:border-red-500 dark:bg-red-900 dark:bg-opacity-50;
    }
</style>
