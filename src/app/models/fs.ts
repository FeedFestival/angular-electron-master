export interface IFS {
    Dir: any
    Dirent?: any;
    F_OK?: any;
    FileReadStream?: any;
    FileWriteStream?: any;
    R_OK?: any;
    ReadStream?: any;
    Stats?: any;
    W_OK?: any;
    WriteStream?: any;
    X_OK?: any;
    access?: any;
    accessSync?: any;
    appendFile?: any;
    appendFileSync?: any;
    chmod?: any;
    chmodSync?: any;
    chown?: any;
    chownSync?: any;
    close?: any;
    closeSync?: any;
    constants?: any;
    copyFile?: any;
    copyFileSync?: any;
    createReadStream?: any;
    createWriteStream?: any;
    exists?: any;
    existsSync?: any;
    fchmod?: any;
    fchmodSync?: any;
    fchown?: any;
    fchownSync?: any;
    fdatasync?: any;
    fdatasyncSync?: any;
    fstat?: any;
    fstatSync?: any;
    fsync?: any;
    fsyncSync?: any;
    ftruncate?: any;
    ftruncateSync?: any;
    futimes?: any;
    futimesSync?: any;
    lchmod?: any;
    lchmodSync?: any;
    lchown?: any;
    lchownSync?: any;
    link?: any;
    linkSync?: any;
    lstat?: any;
    lstatSync?: any;
    mkdir?: any;
    mkdirSync?: any;
    mkdtemp?: any;
    mkdtempSync?: any;
    open?: any;
    openSync?: any;
    opendir?: any;
    opendirSync?: any;
    promises?: any;
    read?: any;
    readFile?: any;
    readFileSync?: any;
    readSync?: any;
    readdir?: any;
    readdirSync?: any;
    readlink?: any;
    readlinkSync?: any;
    realpath?: any;
    realpathSync?: any;
    rename?: any;
    renameSync?: any;
    rmdir?: any;
    rmdirSync?: any;
    stat?: any;
    statSync?: any;
    symlink?: any;
    symlinkSync?: any;
    truncate?: any;
    truncateSync?: any;
    unlink?: any;
    unlinkSync?: any;
    unwatchFile?: any;
    utimes?: any;
    utimesSync?: any;
    watch?: any;
    watchFile?: any;
    write?: any;
    writeFile?: any;
    writeFileSync?: any;
    writeSync?: any;
    writev?: any;
    writevSync?: any;
    _toUnixTimestamp?: any;
    // get Dir: () => { … }
    // set Dir: (value) => { … }
    // get Dirent: () => { … }
    // set Dirent: (value) => { … }
    // get F_OK: () => { … }
    // get FileReadStream: () => { … }
    // set FileReadStream: (value) => { … }
    // get FileWriteStream: () => { … }
    // set FileWriteStream: (value) => { … }
    // get R_OK: () => { … }
    // get ReadStream: () => { … }
    // set ReadStream: (value) => { … }
    // get Stats: () => { … }
    // set Stats: (value) => { … }
    // get W_OK: () => { … }
    // get WriteStream: () => { … }
    // set WriteStream: (value) => { … }
    // get X_OK: () => { … }
    // get access: () => { … }
    // set access: (value) => { … }
    // get accessSync: () => { … }
    // set accessSync: (value) => { … }
    // get appendFile: () => { … }
    // set appendFile: (value) => { … }
    // get appendFileSync: () => { … }
    // set appendFileSync: (value) => { … }
    // get chmod: () => { … }
    // set chmod: (value) => { … }
    // get chmodSync: () => { … }
    // set chmodSync: (value) => { … }
    // get chown: () => { … }
    // set chown: (value) => { … }
    // get chownSync: () => { … }
    // set chownSync: (value) => { … }
    // get close: () => { … }
    // set close: (value) => { … }
    // get closeSync: () => { … }
    // set closeSync: (value) => { … }
    // get constants: () => { … }
    // get copyFile: () => { … }
    // set copyFile: (value) => { … }
    // get copyFileSync: () => { … }
    // set copyFileSync: (value) => { … }
    // get createReadStream: () => { … }
    // set createReadStream: (value) => { … }
    // get createWriteStream: () => { … }
    // set createWriteStream: (value) => { … }
    // get exists: () => { … }
    // set exists: (value) => { … }
    // get existsSync: () => { … }
    // set existsSync: (value) => { … }
    // get fchmod: () => { … }
    // set fchmod: (value) => { … }
    // get fchmodSync: () => { … }
    // set fchmodSync: (value) => { … }
    // get fchown: () => { … }
    // set fchown: (value) => { … }
    // get fchownSync: () => { … }
    // set fchownSync: (value) => { … }
    // get fdatasync: () => { … }
    // set fdatasync: (value) => { … }
    // get fdatasyncSync: () => { … }
    // set fdatasyncSync: (value) => { … }
    // get fstat: () => { … }
    // set fstat: (value) => { … }
    // get fstatSync: () => { … }
    // set fstatSync: (value) => { … }
    // get fsync: () => { … }
    // set fsync: (value) => { … }
    // get fsyncSync: () => { … }
    // set fsyncSync: (value) => { … }
    // get ftruncate: () => { … }
    // set ftruncate: (value) => { … }
    // get ftruncateSync: () => { … }
    // set ftruncateSync: (value) => { … }
    // get futimes: () => { … }
    // set futimes: (value) => { … }
    // get futimesSync: () => { … }
    // set futimesSync: (value) => { … }
    // get lchmod: () => { … }
    // set lchmod: (value) => { … }
    // get lchmodSync: () => { … }
    // set lchmodSync: (value) => { … }
    // get lchown: () => { … }
    // set lchown: (value) => { … }
    // get lchownSync: () => { … }
    // set lchownSync: (value) => { … }
    // get link: () => { … }
    // set link: (value) => { … }
    // get linkSync: () => { … }
    // set linkSync: (value) => { … }
    // get lstat: () => { … }
    // set lstat: (value) => { … }
    // get lstatSync: () => { … }
    // set lstatSync: (value) => { … }
    // get mkdir: () => { … }
    // set mkdir: (value) => { … }
    // get mkdirSync: () => { … }
    // set mkdirSync: (value) => { … }
    // get mkdtemp: () => { … }
    // set mkdtemp: (value) => { … }
    // get mkdtempSync: () => { … }
    // set mkdtempSync: (value) => { … }
    // get open: () => { … }
    // set open: (value) => { … }
    // get openSync: () => { … }
    // set openSync: (value) => { … }
    // get opendir: () => { … }
    // set opendir: (value) => { … }
    // get opendirSync: () => { … }
    // set opendirSync: (value) => { … }
    // get promises: () => { … }
    // get read: () => { … }
    // set read: (value) => { … }
    // get readFile: () => { … }
    // set readFile: (value) => { … }
    // get readFileSync: () => { … }
    // set readFileSync: (value) => { … }
    // get readSync: () => { … }
    // set readSync: (value) => { … }
    // get readdir: () => { … }
    // set readdir: (value) => { … }
    // get readdirSync: () => { … }
    // set readdirSync: (value) => { … }
    // get readlink: () => { … }
    // set readlink: (value) => { … }
    // get readlinkSync: () => { … }
    // set readlinkSync: (value) => { … }
    // get realpath: () => { … }
    // set realpath: (value) => { … }
    // get realpathSync: () => { … }
    // set realpathSync: (value) => { … }
    // get rename: () => { … }
    // set rename: (value) => { … }
    // get renameSync: () => { … }
    // set renameSync: (value) => { … }
    // get rmdir: () => { … }
    // set rmdir: (value) => { … }
    // get rmdirSync: () => { … }
    // set rmdirSync: (value) => { … }
    // get stat: () => { … }
    // set stat: (value) => { … }
    // get statSync: () => { … }
    // set statSync: (value) => { … }
    // get symlink: () => { … }
    // set symlink: (value) => { … }
    // get symlinkSync: () => { … }
    // set symlinkSync: (value) => { … }
    // get truncate: () => { … }
    // set truncate: (value) => { … }
    // get truncateSync: () => { … }
    // set truncateSync: (value) => { … }
    // get unlink: () => { … }
    // set unlink: (value) => { … }
    // get unlinkSync: () => { … }
    // set unlinkSync: (value) => { … }
    // get unwatchFile: () => { … }
    // set unwatchFile: (value) => { … }
    // get utimes: () => { … }
    // set utimes: (value) => { … }
    // get utimesSync: () => { … }
    // set utimesSync: (value) => { … }
    // get watch: () => { … }
    // set watch: (value) => { … }
    // get watchFile: () => { … }
    // set watchFile: (value) => { … }
    // get write: () => { … }
    // set write: (value) => { … }
    // get writeFile: () => { … }
    // set writeFile: (value) => { … }
    // get writeFileSync: () => { … }
    // set writeFileSync: (value) => { … }
    // get writeSync: () => { … }
    // set writeSync: (value) => { … }
    // get writev: () => { … }
    // set writev: (value) => { … }
    // get writevSync: () => { … }
    // set writevSync: (value) => { … }
    // get _toUnixTimestamp: () => { … }
    // set _toUnixTimestamp: (value) => { … }
}