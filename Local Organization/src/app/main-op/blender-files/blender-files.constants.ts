export enum FILTER_TYPE {
    NONE,
    TEXT,
    BOOL,
}

export const blenderFilesCols = [
    {
        field: "name",
        style: { width: "70px" },
        header: "Filename",
        type: "name",
        filterType: FILTER_TYPE.TEXT,
    },
    {
        field: "fileLocation",
        style: { width: "190px" },
        header: "Path",
        cClass: "dotdot",
        type: "fileLocation",
        filterType: FILTER_TYPE.TEXT,
    },
    {
        field: "date",
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

export const IMAGE_EXTS: string[] = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

export const EXCLUDE_LIST = [
    // C:
    '$WinREAgent',
    '$Recycle.Bin',
    'Config.Msi',
    'AMD',
    'Windows',
    'nvm4w',

    'OneDriveTemp',
    'ProgramData',
    'Recovery',
    'Program Files',
    'Program Files (x86)',

    'Riot Games',
    '_AI',

    'Users', // Should  we? First let's see if something in them

    //

    'ripped-polyperfect',
    'Library',
    'Logs',
    '.git',
    '.angular',
    'node_modules',

    // 
    '____enbw_case'
];
