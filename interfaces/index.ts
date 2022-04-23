import type { NextPage } from 'next';

export type Page = NextPage & {
    title: string;
    dontStick?: boolean;
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

export interface CommissionType {
    id: number;
    display: string;
    price: number;
    offer: number | null;
    exampleImage: string;
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

export type CommissionData = {
    spaces: number | null;
    baseTypes: CommissionType[];
    backgroundTypes: CommissionType[];
};

/**
 * ENUMS
 */
export enum ScreenType {
    mobile,
    tablet,
    desktop,
};

export enum Direction {
    Forward,
    Backward,
};
