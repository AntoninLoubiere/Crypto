<script lang="ts">
    export let color: 'red' | 'blue' | 'green';

    let classes =
        color == 'red'
            ? {
                  text: 'text-red-500',
                  bg_w: 'bg-red-50',
                  bg_d: 'dark:bg-red-500',
                  border: 'border-red-500',
              }
            : color == 'blue'
            ? {
                  text: 'text-blue-500',
                  bg_w: 'bg-blue-50',
                  bg_d: 'dark:bg-blue-500',
                  border: 'border-blue-500',
              }
            : {
                  text: 'text-green-500',
                  bg_w: 'bg-green-50',
                  bg_d: 'dark:bg-green-500',
                  border: 'border-green-500',
              };
</script>

<div
    class="text-xs px-2 py-1 uppercase {classes.text} {classes.bg_w} {classes.bg_d} dark:bg-opacity-10 {classes.border} border rounded-full"
>
    <slot />
</div>
