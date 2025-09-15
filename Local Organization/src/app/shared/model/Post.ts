export interface Post {
    title: string;
    postMethod: 'typing' | 'paste';
    content: string;
    emojis?: string[];
    picture?: string;
}
