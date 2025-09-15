export const route = (...args: string[]) => {
    let url = '';
    args.forEach(a => (url += '/' + a));
    return url;
};

export const GAME_MAIN_DIR = 'Top Down';
export const ART_MAIN_DIR = 'Art Development';

export enum MAIN_MENU_ITEM {
    HOME = 'home',
    MAIN_OP = 'main',
}

export const MENU_ITEMS: Record<MAIN_MENU_ITEM, any> = {
    [MAIN_MENU_ITEM.HOME]: {
        id: 0,
        label: MAIN_MENU_ITEM.HOME,
        url: '/' + MAIN_MENU_ITEM.HOME,
    },
    [MAIN_MENU_ITEM.MAIN_OP]: {
        id: 1,
        label: MAIN_MENU_ITEM.MAIN_OP,
        url: '/' + MAIN_MENU_ITEM.MAIN_OP,
    },
};

export enum SUB_MENU_ITEM {
    BLENDER_FILES = 'blender-files',
    CITY_LOADER = 'city-loader',
}

export const SUB_MENU_ITEMS: Record<SUB_MENU_ITEM, any> = {
    [SUB_MENU_ITEM.BLENDER_FILES]: {
        id: 0,
        name: 'Blender Files',
        label: SUB_MENU_ITEM.BLENDER_FILES,
        url: SUB_MENU_ITEM.BLENDER_FILES,
        routeUrl: '/' + SUB_MENU_ITEM.BLENDER_FILES,
    },
    [SUB_MENU_ITEM.CITY_LOADER]: {
        id: 1,
        name: 'City Loader',
        label: SUB_MENU_ITEM.CITY_LOADER,
        url: SUB_MENU_ITEM.CITY_LOADER,
        routeUrl: '/' + SUB_MENU_ITEM.CITY_LOADER,
    },
};

export const BOT_ENGINE_PARENT_ROUTE = route(
    MAIN_MENU_ITEM.MAIN_OP,
    SUB_MENU_ITEMS[SUB_MENU_ITEM.BLENDER_FILES].url,
);
