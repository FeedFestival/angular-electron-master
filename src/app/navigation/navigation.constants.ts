export interface IMenuItems {
    code: string;
    url: string;
    label: string;
    active?: boolean;
}

export const MENU_ITEMS = {
    HOME: {
        code: 'home',
        url: '/home',
        label: 'Home'
    },
    BLENDER_FILES: {
        code: 'blender-files',
        url: '/blender-files',
        label: 'Blender Files'
    },
    CITY_LOADER: {
        code: 'city-loader',
        url: '/city-loader',
        label: 'City Loader'
    },
    __list: () => {
        return [
            MENU_ITEMS.HOME,
            MENU_ITEMS.BLENDER_FILES,
            MENU_ITEMS.CITY_LOADER
        ];
    }
}
