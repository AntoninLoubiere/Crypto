type SimplifiedUnits = {
    [Property in Intl.RelativeTimeFormatUnit as Exclude<
        Property,
        'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
    >]+?: boolean;
};

export type FormatterOptions = SimplifiedUnits & {
    threshold?: number;
};

export function format(
    formatter: Intl.RelativeTimeFormat,
    dateFrom: Date,
    dateTo: Date,
    options?: FormatterOptions
) {
    const { n, unit } = getBestUnit(dateFrom.getTime(), dateTo.getTime(), options);
    return formatter.format(n, unit);
}

export function formatFromNow(
    formatter: Intl.RelativeTimeFormat,
    date: Date,
    options?: FormatterOptions
) {
    const { n, unit } = getBestUnit(Date.now(), date.getTime(), options);
    return formatter.format(n, unit);
}

export function formatToParts(
    formatter: Intl.RelativeTimeFormat,
    dateFrom: Date,
    dateTo: Date,
    options?: FormatterOptions
) {
    const { n, unit } = getBestUnit(dateFrom.getTime(), dateTo.getTime(), options);
    return formatter.formatToParts(n, unit);
}

export function formatToPartsFromNow(
    formatter: Intl.RelativeTimeFormat,
    date: Date,
    options?: FormatterOptions
) {
    const { n, unit } = getBestUnit(Date.now(), date.getTime(), options);
    return formatter.format(n, unit);
}

function getBestUnit(dateFrom: number, dateTo: number, options?: FormatterOptions) {
    if (!options) {
        options = {};
    }
    options.seconds = options.seconds ?? true;
    options.minutes = options.minutes ?? true;
    options.hours = options.hours ?? true;
    options.days = options.days ?? true;
    options.weeks = options.weeks ?? true;
    options.months = options.months ?? true;
    options.quarters = options.quarters ?? true;
    options.years = options.years ?? true;

    const delta = dateTo - dateFrom;
    let n = Math.round(delta / 1000);
    let unit: Intl.RelativeTimeFormatUnit = 'seconds';
    let needToChange =
        !options.seconds &&
        (options.minutes ||
            options.hours ||
            options.days ||
            options.weeks ||
            options.months ||
            options.quarters ||
            options.years);

    const threshold = options.threshold ?? 0.85;

    // Minutes
    let newN = customRound(delta / (60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.minutes) || needToChange) {
        if (needToChange) needToChange = options.minutes;
        n = newN;
        unit = 'minutes';
    } else {
        return { n, unit };
    }

    // Hours
    newN = customRound(delta / (60 * 60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.hours) || needToChange) {
        if (needToChange) needToChange = options.hours;
        n = newN;
        unit = 'hours';
    } else {
        return { n, unit };
    }

    // Days
    newN = customRound(delta / (24 * 60 * 60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.days) || needToChange) {
        if (needToChange) needToChange = options.days;
        n = newN;
        unit = 'days';
    } else {
        return { n, unit };
    }

    // Weeks
    newN = customRound(delta / (7 * 24 * 60 * 60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.weeks) || needToChange) {
        if (needToChange) needToChange = options.weeks;
        n = newN;
        unit = 'weeks';
    } else {
        return { n, unit };
    }

    // Month
    newN = customRound(delta / ((365.25 / 12) * 24 * 60 * 60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.months) || needToChange) {
        if (needToChange) needToChange = options.months;
        n = newN;
        unit = 'months';
    } else {
        return { n, unit };
    }

    // Quarters
    newN = customRound(delta / ((365.25 / 4) * 24 * 60 * 60 * 1000), threshold);
    if ((Math.abs(newN) > 0 && options.quarters) || needToChange) {
        if (needToChange) needToChange = options.quarters;
        n = newN;
        unit = 'quarters';
    } else {
        return { n, unit };
    }

    // Years
    newN = customRound(delta / (365.25 * 24 * 60 * 60 * 1000), 0.75);
    if ((Math.abs(newN) > 0 && options.years) || needToChange) {
        if (needToChange) needToChange = options.years;
        n = newN;
        unit = 'years';
    }
    return { n, unit };
}

function customRound(n: number, threshold = 0.5): number {
    if (n < 0) return -customRound(-n, threshold);

    const floor = Math.floor(n);

    if (n - floor >= threshold) {
        return floor + 1;
    }
    return floor;
}
