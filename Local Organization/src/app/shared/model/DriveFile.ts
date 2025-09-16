export interface RawFile {
    id: string;
    name: string;
    filepath: string;
}

export interface ImagePath {
    id: string;
    path: string;
}

export interface IFile extends RawFile {
    fileLocation: string;
    date: string;
    hasPic?: boolean;
    images?: ImagePath[]
    //
    recentlyOpened?: boolean;
}

export interface DriveFile {
    lastCheckupDate: string;
    files: RawFile[];
}

export interface FilePathCheck {
    filePaths: string[];
    startPath: string;
}

export interface FileCheck {
    filename: string;
}

export const getNameFromFilepath = (filepath: string): string => {
    const foldersTo = filepath.split('\\');
    return foldersTo[foldersTo.length - 1];
};

export const defaultIFile: IFile = {
    id: '',
    name: '',
    filepath: '',
    fileLocation: 'string',
    date: '',
};
