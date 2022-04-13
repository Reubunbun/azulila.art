import type { NextPage } from 'next';

export type Page = NextPage & {
    title: string;
};

export type Image = {
    id: number;
    url: string;
    title: string;
    description: string;
    tags: string[];
    priority: number;
    width: number;
    height: number;
};

export enum ScreenType {
    mobile,
    tablet,
    desktop,
};

/**
 * API RESPONSES
 */
export type GenericError = {
    message: string;
};

export type ImagesData = {
    images: Image[];
    tags: string[];
    totalCount: number;
};
