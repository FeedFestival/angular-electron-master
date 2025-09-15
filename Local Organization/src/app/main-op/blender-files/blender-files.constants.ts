export enum FILTER_TYPE {
    NONE,
    TEXT,
    BOOL,
}

export const DELAY_IN_SEARCHING = 100;

export const blenderFilesCols = [
    {
        field: "name",
        style: { width: "70px" },
        header: "Filename",
        type: "name",
        filterType: FILTER_TYPE.TEXT,
    },
    // {
    //     field: "description",
    //     style: { width: "100px" },
    //     header: "Description",
    //     type: "text",
    //     filterType: FILTER_TYPE.TEXT,
    // },
    {
        field: "fileLocation",
        style: { width: "190px" },
        header: "Path",
        cClass: "dotdot",
        type: "fileLocation",
        filterType: FILTER_TYPE.TEXT,
    },
    {
        field: "birth",
        style: { width: "50px" },
        header: "Time",
        type: "text",
    },
    {
        field: "hasPic",
        style: { width: "70px" },
        header: "Pics",
        type: "pictures",
        noScroll: true,
        filterType: FILTER_TYPE.BOOL,
    },
];

export const BLENDER_DIRS = {
    // CHECK: 'E:/_New_Working Ground/1_LevelDesign/WildLife',
    CHECK: [
        // "E:/__WorkingGround",

        // "E:/_New_Working Ground",

        // ------  1  ------------------------------------------
        // "E:/_assets",
        // "E:/_Comics",
        // "E:/_githubGames",
        // "E:/_kits",
        // "E:/Old_Desktop",

        // ------  2  ------------------------------------------ NOTHING COMES UP
        // 'E:/_made_Games',
        // 'E:/_ProiecteExterne',
        // 'E:/_publish GAMES',
        // 'E:/_UnityPackages',
        // 'E:/Downloads',
        // 'E:/League Of Legends',
        // 'E:/MakeHuman',
        // 'E:/Program Files'

        // ------  1  ------------------------------------------
        'F:/'
    ],
    SAVE: "E:/_assets",
    SAVE_FILE: "___assets_JSON.json",
};
