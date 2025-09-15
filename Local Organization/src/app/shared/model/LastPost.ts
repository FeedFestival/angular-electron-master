import { Social } from "./Social";

export type LastPost = {
    [key in Social]?: string;
};
