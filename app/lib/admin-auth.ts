import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "ppdb_admin_session";
export const adminSessionLifetime = 8 * 60 * 60;

function signingKey() {
    return process.env.ADMIN_SESSION_SECRET ?? "";
}

function safeEqual(left: string, right: string) {
    return timingSafeEqual(
        createHash("sha256").update(left).digest(),
        createHash("sha256").update(right).digest(),
    );
}

export function verifyAdminCredentials(username: string, password: string) {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUsername || !expectedPassword) return false;
    const usernameMatches = safeEqual(username, expectedUsername);
    const passwordMatches = safeEqual(password, expectedPassword);
    return usernameMatches && passwordMatches;
}

export function createAdminSession() {
    const key = signingKey();
    if (!key) throw new Error("ADMIN_SESSION_SECRET must be configured for admin sessions.");

    const payload = `${Date.now() + adminSessionLifetime * 1000}.${randomBytes(16).toString("hex")}`;
    const signature = createHmac("sha256", key).update(payload).digest("base64url");
    return `${payload}.${signature}`;
}

export function isValidAdminSession(token: string | undefined) {
    const key = signingKey();
    if (!key || !token) return false;

    const [expiresAtText, nonce, signature, ...extra] = token.split(".");
    if (!expiresAtText || !nonce || !signature || extra.length) return false;
    const expiresAt = Number(expiresAtText);
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;

    const payload = `${expiresAtText}.${nonce}`;
    const expected = createHmac("sha256", key).update(payload).digest();
    let provided: Buffer;
    try {
        provided = Buffer.from(signature, "base64url");
    } catch {
        return false;
    }
    return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function hasAdminSession() {
    const cookieStore = await cookies();
    return isValidAdminSession(cookieStore.get(adminCookieName)?.value);
}

export function adminCookieOptions(maxAge = adminSessionLifetime) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
        maxAge,
    };
}