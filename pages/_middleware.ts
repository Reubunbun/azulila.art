import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname === '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/work';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}
