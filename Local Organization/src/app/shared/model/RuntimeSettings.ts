import { LastPost } from './LastPost';
import { MinMax } from './MinMax';

export interface RuntimeSettings {
    chrome: {
        close_time: MinMax;
        open_time: MinMax;
        before_exit: MinMax;
    };
    defaultDelay: MinMax;
    lastPost: LastPost;
    profile: string;
    doPost: boolean;
}
