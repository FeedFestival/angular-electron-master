export enum FILTER_TYPE {
    NONE, TEXT, BOOL
}

export const blenderFilesCols = [
    {
        field: 'name', style: { width: '70px' },
        header: 'Filename', type: 'name', filterType: FILTER_TYPE.TEXT
    },
    {
        field: 'description', style: { width: '100px' },
        header: 'Description', type: 'text', filterType: FILTER_TYPE.TEXT
    },
    {
        field: 'fileLocation', style: { width: '190px' },
        header: 'Path', cClass: 'dotdot', type: 'fileLocation', filterType: FILTER_TYPE.TEXT
    },
    {
        field: 'birth', style: { width: '50px' },
        header: 'Time', type: 'text'
    },
    {
        field: 'hasPic', style: { width: '50px' },
        header: 'Pics', type: 'pictures', noScroll: true, filterType: FILTER_TYPE.BOOL
    }
];

export const BLENDER_DIRS = {
    // CHECK: 'E:/_New_Working Ground/1_LevelDesign/WildLife',
    CHECK: [
        'E:/_assets',
        'E:/_Comics',
        'E:/_FACULTATE',
        'E:/_githubGames',
        'E:/_kits',
        'E:/_made_Games',
        'E:/_memories',
        'E:/_New_Working Ground',
        'E:/_Old_Desktop',
        'E:/_Old_Working Ground',
        'E:/_ProiecteExterne',
        'E:/_UnityAssetsTest',
        'E:/_UnityInProgress',
        'E:/_UnityPackages',
        'E:/de la munca',
        'E:/Downloads',
        'E:/Games',
        'E:/League Of Legends',
        'E:/MakeHuman',
        'E:/Noway',
        'E:/Program Files',
        'E:/Z_WorkFiles'
    ],
    SAVE: 'E:/_assets',
    SAVE_FILE: '___assets_JSON.json'
};
