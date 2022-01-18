import { getFirestore } from 'firebase/firestore';
import firebaseApp from './firebase';

const database = getFirestore(firebaseApp);

export default database;
