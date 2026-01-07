import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value


    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        // Note: Role verification should be done in layout/page server-side or via API call
    }

    return NextResponse.next()
}


export const config = {
    matcher: ["/dashboard/:path*"],
}
