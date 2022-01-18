import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from './firebase';
import { getUserSession, hasActiveSession } from './session';

export const signIn = async (email: string, password: string) => {
    const auth = getAuth(firebaseApp);

    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            return user;
        })
        .catch((error) => {
            return { error: error.message };
        });
};

export async function authenticateFirebaseFromSession(request: Request) {
    const session = await getUserSession(request);

    const isAuthenticated = await hasActiveSession(request);
    if (!isAuthenticated) {
        throw new Error('Invalid session');
    }

    return signIn(session.get('email'), session.get('password'));
}
