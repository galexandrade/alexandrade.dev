import invariant from 'tiny-invariant';
import { marked } from 'marked';

import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import database from './database';

export type Post = {
    slug: string;
    title: string;
    description: string;
    image: string;
    featured: boolean;
    draft: boolean;
    date: string;
    readingtime: string;
};

export type PostMarkdownAttributes = {
    title: string;
    description: string;
    image: string;
    featured: boolean;
    draft: boolean;
    date: string;
    readingtime: string;
};

function isValidPostAttributes(
    attributes: any
): attributes is PostMarkdownAttributes {
    return attributes?.title;
}

export async function getPosts(type: 'all' | 'published' = 'published') {
    const querySnapshot = await getDocs(collection(database, 'posts'));

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
        const filename = doc.id;
        const data = doc.data();
        invariant(
            isValidPostAttributes(data),
            `${filename} has bad meta data!`
        );
        // @ts-ignore ss
        if (type === 'all' || (type === 'published' && !data.draft)) {
            posts.push({
                slug: filename,
                ...data,
            });
        }
    });
    return posts;
}

export async function getPost(slug: string) {
    const docRef = doc(database, 'posts', slug);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    invariant(
        isValidPostAttributes(data),
        `Post ${slug} is missing attributes`
    );

    // @ts-ignore dsadas
    const html = marked(data.content);
    return {
        slug,
        html,
        title: data.title,
        description: data.description,
        date: data.date,
        readingtime: data.readingtime,
        image: data.image,
    };
}

export async function getRawPost(slug: string) {
    const docRef = doc(database, 'posts', slug);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    return data;
}

export async function savePost(slug: string, data: Object) {
    await setDoc(doc(database, 'posts', slug), data);
}
