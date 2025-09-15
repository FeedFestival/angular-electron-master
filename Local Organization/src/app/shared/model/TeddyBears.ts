import { USER } from '../../../../content/legacy/_USERS/DB/user';
import { Social } from './Social';

export type TeddyBears = {
    [key in USER]?: TeddyBear;
};

export interface TeddyBear {
    email: string;
    socials: {
        [key in Social]: string;
    };
}
