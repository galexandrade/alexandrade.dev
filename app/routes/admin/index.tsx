import type { ActionFunction, LoaderFunction } from 'remix';
import { redirect } from 'remix';
import { hasActiveSession } from '~/api/session';

export const loader: LoaderFunction = async ({ request }) => {
    const isAuthenticated = await hasActiveSession(request);
    if (isAuthenticated) {
        return redirect('/admin/posts');
    }
    return redirect('/admin/login');
};
