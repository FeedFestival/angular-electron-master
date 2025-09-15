import { Post } from "./Post";

export interface Posting {
	main: Post;
	replies?: Post[];
}
