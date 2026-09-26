import { cookies } from "next/headers";
import {
    adminCookieName,
    adminCookieOptions,
    createAdminSession,
    verifyAdminCredentials,
} from "@/app/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const maxAttempts = 5;
const cooldownMs = 15 * 60 * 1000;

function getClientKey(request: Request) {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
    let credentials: { username?: unknown; password?: unknown };
    try {
        credentials = await request.json();
    } catch {
        return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
    }

    const clientKey = getClientKey(request);
    const now = Date.now();
    const attempt = attempts.get(clientKey);
    if (attempt && attempt.resetAt > now && attempt.count >= maxAttempts) {
        return Response.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });
    }

    const username = typeof credentials.username === "string" ? credentials.username : "";
    const password = typeof credentials.password === "string" ? credentials.password : "";
    if (!verifyAdminCredentials(username, password)) {
        const current = attempt && attempt.resetAt > now ? attempt : { count: 0, resetAt: now + cooldownMs };
        current.count += 1;
        attempts.set(clientKey, current);
        return Response.json({ error: "Username atau password salah." }, { status: 401 });
    }

    attempts.delete(clientKey);
    const cookieStore = await cookies();
    cookieStore.set(adminCookieName, createAdminSession(), adminCookieOptions());
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.set(adminCookieName, "", adminCookieOptions(0));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}