import invariant from 'tiny-invariant';
import { marked } from 'marked';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import database from './database';

function isValidMeta(attributes: any): attributes is { content: string } {
    return attributes?.content;
}

export async function getAboutContent(metaField = 'about') {
    const docRef = doc(database, 'meta', metaField);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    invariant(isValidMeta(data), `Post ${metaField} is missing content`);

    // @ts-ignore dsadas
    const html = marked(data.content);
    return { html, raw: data.content };
}

export async function saveAbout(data: Object) {
    await setDoc(doc(database, 'meta', 'about'), data);
}
