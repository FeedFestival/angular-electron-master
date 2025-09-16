export interface RawFile {
    name: string;
    filepath: string;
}

export interface IFile extends RawFile {
    fileLocation: string;
    date: string;
    hasPic: boolean;
    picUrl: string;
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
    // startPath: string;
}
