import type { ActionFunction, LoaderFunction } from 'remix';
import { redirect } from 'remix';
import { logout } from '~/api/session';

export const action: ActionFunction = async ({ request }) => {
    return logout(request);
};

export const loader: LoaderFunction = async () => {
    return redirect('/admin/login');
};
