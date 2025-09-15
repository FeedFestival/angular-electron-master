import { Coord } from './Coord';

export interface SocialSettings {
    refPath: string;
    position: { [key: string]: Coord };
}
