import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'a_very_secure_and_long_secret_key_for_omnipos_2026';

export interface AuthUser {
    sub: string;
    role: string;
    tenant_id: string;
}

export async function verifyAuth(request: Request): Promise<AuthUser | null> {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as AuthUser;
    } catch (err) {
        return null;
    }
}
