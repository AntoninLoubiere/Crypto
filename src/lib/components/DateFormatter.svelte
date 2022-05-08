<script lang="ts">
    import { browser } from '$app/env';

    export let date: Date | undefined;
    export let locales: string | string[] | undefined = browser
        ? (navigator.languages as string[])
        : 'en-EN';
    export let options: Intl.DateTimeFormatOptions | undefined = undefined;

    const formatter = new Intl.DateTimeFormat(locales, options);
</script>

{formatter.format(date)}
