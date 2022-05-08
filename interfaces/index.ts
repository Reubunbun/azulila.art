import type { NextPage } from 'next';

export type Page<P = {}> = NextPage<P> & {
    title: string;
    dontStick?: boolean;
    removePadding?: boolean;
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
 * APIS
 */
export type GenericError = {
    message: string;
};

export type CommissionData = {
    spaces: number | null;
    baseTypes: CommissionType[];
    backgroundTypes: CommissionType[];
};

export type CommissionPost = {
    totalPrice: number;
    baseType: {
        display: string;
        price: number;
        offer: number | null;
        actualPrice: number;
    };
    backgroundType: {
        display: string;
        price: number;
        offer: number | null;
        actualPrice: number;
    };
    backgroundDescription: string;
    userName: string;
    userContactEmail: string;
    userPaypalEmail: string;
    postPermissionGiven: boolean;
    userSocials: string[];
    characters: {
        visualDescription: string;
        personalityDescription: string;
        imageURLs: string[];
    }[];
    failedImages: boolean;
};

/**
 * ENUMS
 */
export enum ScreenType {
    mobile,
    tablet,
    desktop, // 1080p
    large, // 1440p
    extraLarge, // 4k
};

export enum Direction {
    Forward,
    Backward,
};
