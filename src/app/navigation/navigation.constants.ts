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
    __list: () => {
        return [
            MENU_ITEMS.HOME,
            MENU_ITEMS.BLENDER_FILES
        ];
    }
}