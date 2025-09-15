import { LabelValue } from './LabelValue';

export type Social = 'mastodon' | 'twitter' | 'threads' | 'reddit' | 'youtube' | 'instagram' | 'tiktok';

export const SOCIAL_LIST: Social[] = [
    'mastodon',
    'twitter',
    'threads',
    'reddit',
    'youtube',
    'instagram',
    'tiktok',
];

export const toLabelValue = (list: Social[]): LabelValue<Social>[] => {
    return list.map(social => ({
        label: `${social}`,
        value: social as Social,
    }));
};
