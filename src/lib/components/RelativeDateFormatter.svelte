<script lang="ts">
    import { browser } from '$app/env';
    import { format, type FormatterOptions } from '$lib/relativeTimeFormatter';

    export let dateTo: Date;
    export let dateFrom = new Date();
    export let locales: string | string[] | undefined = browser
        ? (navigator.languages as string[])
        : 'en-EN';
    export let options:
        | {
              intl?: Intl.RelativeTimeFormatOptions;
              unit?: FormatterOptions;
          }
        | undefined = undefined;

    const formatter = new Intl.RelativeTimeFormat(locales, options?.intl);
</script>

{format(formatter, dateFrom, dateTo, options?.unit)}
