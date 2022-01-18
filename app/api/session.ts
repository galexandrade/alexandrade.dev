import { createCookieSessionStorage, redirect } from 'remix';

const storage = createCookieSessionStorage({
    cookie: {
        name: 'RJ_session',
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === 'production',
        secrets: ['53cr37*'],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function createUserSession(
    email: string,
    password: string,
    redirectTo: string
) {
    const session = await storage.getSession();
    session.set('email', email);
    session.set('password', password);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    });
}

export function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'));
}

export async function hasActiveSession(request: Request) {
    const session = await getUserSession(request);
    const email = session.get('email');
    const password = session.get('password');

    if (
        !email ||
        typeof email !== 'string' ||
        !password ||
        typeof password !== 'string'
    ) {
        return false;
    }
    return true;
}

export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    return redirect('/admin/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    });
}
