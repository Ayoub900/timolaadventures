import { RateLimiterMemory } from "rate-limiter-flexible";
import { getUserIP } from "./ip";
import { NextResponse } from "next/server";

const strictLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 60, // per 60 seconds
});

const generalLimiter = new RateLimiterMemory({
    points: 60, // 60 requests
    duration: 60, // per 60 seconds
});

export type LimitType = "strict" | "general";

export async function checkRateLimit(type: LimitType = "general") {
    const ip = await getUserIP();
    const limiter = type === "strict" ? strictLimiter : generalLimiter;

    try {
        await limiter.consume(ip, 1);
    } catch {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    return null; // No error, proceed
}

