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
