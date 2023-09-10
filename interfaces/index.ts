import type { NextPage } from 'next';

export type Page<P = {}> = NextPage<P> & {
    title: string;
    description: string;
    dontStick?: boolean;
    removePadding?: boolean;
    removeMargin?: boolean;
    background?: string;
    noNav?: boolean;
    removeBg?: boolean;
};

export type Image = {
    id: number;
    url: string;
    title?: string;
    description?: string;
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

export type Product = {
    productId: number;
    groupId: number;
    name: string;
    price: number;
    stock: number;
    priority: number;
};

export type ProductGroup = {
    groupId: number;
    name: string;
    priority: number;
    imageUrl: string;
    products: Product[];
    tags: string[];
    mainCategory: string;
    description: string;
};

export type ProductsResult = {
    products: ProductGroup[];
    categories: string[];
};

export type PurchaseRequest = {
    firstName: string;
    lastName: string;
    email: string;
    line1: string;
    line2: string | null;
    city: string;
    zipCode: string;
    state: string;
    country: string;
    products: { productId: number, quantity: number }[],
}

export type PurchaseResponse = {
    id: string;
};

export type ContactInfo = {
    name: string;
    email: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

export type ProductInfo = Array<{
    productId: number;
    quantity: number;
}>;

export type PurchaseSuccessResponse = {
    contactInfo: ContactInfo;
    productInfo: {
        groupName: string;
        productName: string;
        quantity: number;
    }[];
}

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
