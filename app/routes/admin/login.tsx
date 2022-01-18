import {
    ActionFunction,
    LinksFunction,
    MetaFunction,
    LoaderFunction,
    redirect,
} from 'remix';
import { useActionData, json } from 'remix';
import { signIn } from '~/api/auth';
import { createUserSession, hasActiveSession } from '~/api/session';
import stylesUrl from '~/styles/admin/login.css';

export const loader: LoaderFunction = async ({ request }) => {
    const isAuthenticated = await hasActiveSession(request);
    if (isAuthenticated) {
        return redirect('/admin/posts');
    }
    return {};
};

export let links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

function validateUsername(username: unknown) {
    if (typeof username !== 'string' || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== 'string' || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');
    const redirectTo = form.get('redirectTo') || '/jokes';
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof redirectTo !== 'string'
    ) {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    const fields = { username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean))
        return badRequest({ fieldErrors, fields });

    // login to get the user
    // if there's no user, return the fields and a formError
    // if there is a user, create their session and redirect to /jokes
    const response = await signIn(fields.username, fields.password);
    // @ts-ignore s
    if (response.error) {
        return badRequest({
            fields,
            formError: 'User not found',
        });
    }

    return createUserSession(fields.username, fields.password, '/admin/posts');
};

type ActionData = {
    formError?: string;
    fieldErrors?: {
        username: string | undefined;
        password: string | undefined;
    };
    fields?: {
        username: string;
        password: string;
    };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'About Alex P. Andrade',
        description: 'About Alex P. Andrade',
    };
};

export default function Login() {
    const actionData = useActionData<ActionData>();
    console.log(actionData);
    return (
        <div className="login">
            <form
                method="post"
                aria-describedby={
                    actionData?.formError ? 'form-error-message' : undefined
                }
            >
                <div>
                    <label htmlFor="username-input">Username</label>
                    <input
                        type="text"
                        id="username-input"
                        name="username"
                        defaultValue={actionData?.fields?.username}
                        aria-invalid={Boolean(
                            actionData?.fieldErrors?.username
                        )}
                        aria-describedby={
                            actionData?.fieldErrors?.username
                                ? 'username-error'
                                : undefined
                        }
                    />
                    {actionData?.fieldErrors?.username ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                            id="username-error"
                        >
                            {actionData?.fieldErrors.username}
                        </p>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="password-input">Password</label>
                    <input
                        id="password-input"
                        name="password"
                        defaultValue={actionData?.fields?.password}
                        type="password"
                        aria-invalid={
                            Boolean(actionData?.fieldErrors?.password) ||
                            undefined
                        }
                        aria-describedby={
                            actionData?.fieldErrors?.password
                                ? 'password-error'
                                : undefined
                        }
                    />
                    {actionData?.fieldErrors?.password ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                            id="password-error"
                        >
                            {actionData?.fieldErrors.password}
                        </p>
                    ) : null}
                </div>
                <div id="form-error-message">
                    {actionData?.formError ? (
                        <p className="form-validation-error" role="alert">
                            {actionData?.formError}
                        </p>
                    ) : null}
                </div>
                <button type="submit" className="button">
                    Submit
                </button>
            </form>
        </div>
    );
}
