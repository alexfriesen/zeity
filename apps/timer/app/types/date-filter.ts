import type { DateLike } from "@zeity/utils/date";

export enum DateFilterType {
    Custom = 'custom',
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year',
}

export interface DateFilter {
    key: string;
    type: DateFilterType | `${DateFilterType}`;
    value: number;
    label?: string;
    text?: string;
}

export interface DateRange {
    start: DateLike;
    end: DateLike;
}