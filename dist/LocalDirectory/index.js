"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDirectory = void 0;
const fs = require("fs");
const path = require("path");
const util_1 = require("@anderjason/util");
const LocalFile_1 = require("../LocalFile");
const LocalPath_1 = require("../LocalPath");
class LocalDirectory {
    constructor(localPath) {
        this._localPath = localPath;
    }
    static givenAbsolutePath(...pathParts) {
        return LocalDirectory.givenLocalPath(LocalPath_1.LocalPath.givenAbsolutePath(...pathParts));
    }
    static givenRelativePath(directory, ...pathParts) {
        const localPath = LocalPath_1.LocalPath.givenRelativePath(directory, ...pathParts);
        if (localPath.isFile()) {
            throw new Error("Specified path is a file (expected a directory)");
        }
        return new LocalDirectory(localPath);
    }
    static givenCurrentDirectory(dirname) {
        return LocalDirectory.givenLocalPath(LocalPath_1.LocalPath.givenAbsolutePath(dirname).withPreBuildPath());
    }
    static givenLocalPath(localPath) {
        return new LocalDirectory(localPath);
    }
    isAccessible() {
        return this._localPath.isAccessible();
    }
    toAbsolutePath() {
        return this._localPath.toAbsolutePath();
    }
    async copyDirectory(targetDirectory) {
        const sourceIsAccessible = await this.isAccessible();
        if (!sourceIsAccessible) {
            throw new Error(`Source directory is not accessible at ${this.toAbsolutePath()}`);
        }
        const targetIsAccessible = await targetDirectory.isAccessible();
        if (targetIsAccessible) {
            throw new Error(`Target directory already exists at ${targetDirectory.toAbsolutePath()}`);
        }
        await targetDirectory.createDirectory();
        const sourceChildFiles = await this.toChildFiles();
        await util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(sourceChildFiles, (sourceChildFile) => {
            const targetChildFile = LocalFile_1.LocalFile.givenRelativePath(targetDirectory, sourceChildFile.toFilename());
            return sourceChildFile.copyFile(targetChildFile);
        });
        const sourceChildDirectories = await this.toChildDirectories();
        await util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(sourceChildDirectories, (sourceChildDirectory) => {
            const targetChildDirectory = LocalDirectory.givenRelativePath(targetDirectory, sourceChildDirectory.toDirectoryName());
            return sourceChildDirectory.copyDirectory(targetChildDirectory);
        });
    }
    deleteDirectory() {
        return this.isAccessible().then((isAccessible) => {
            if (!isAccessible) {
                return;
            }
            return this.toChildFiles()
                .then((childFiles) => {
                return util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(childFiles, (file) => {
                    return file.deleteFile();
                });
            })
                .then(() => {
                return this.toChildDirectories();
            })
                .then((childDirectories) => {
                return util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(childDirectories, (dir) => {
                    return dir.deleteDirectory();
                });
            })
                .then(() => {
                return new Promise((resolve, reject) => {
                    fs.rmdir(this.toAbsolutePath(), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            });
        });
    }
    createDirectory() {
        return new Promise((resolve, reject) => {
            fs.access(this.toAbsolutePath(), async (err) => {
                if (err == null) {
                    resolve();
                    return;
                }
                if (err.code !== "ENOENT") {
                    reject(err);
                    return;
                }
                // directory does not exist
                const parentDirectory = this.toOptionalParentDirectory();
                if (parentDirectory != null) {
                    await parentDirectory.createDirectory();
                }
                fs.mkdir(this.toAbsolutePath(), undefined, (mkdirErr) => {
                    if (mkdirErr != null && mkdirErr.code !== "EEXIST") {
                        reject(mkdirErr);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    createDirectorySync() {
        try {
            fs.accessSync(this.toAbsolutePath());
        }
        catch (err) {
            // directory does not exist
            const parentDirectory = this.toOptionalParentDirectory();
            if (parentDirectory != null) {
                parentDirectory.createDirectorySync();
            }
            fs.mkdirSync(this.toAbsolutePath(), undefined);
        }
    }
    toLocalPath() {
        return this._localPath;
    }
    toDirectoryName() {
        return path.basename(this.toAbsolutePath());
    }
    toOptionalParentDirectory() {
        return LocalDirectory.givenAbsolutePath(path.dirname(this.toAbsolutePath()));
    }
    toRelativePathParts(target) {
        return this.toRelativePathString(target).split(path.sep);
    }
    toRelativePathString(target) {
        return path.relative(this.toAbsolutePath(), target.toAbsolutePath());
    }
    toChildPaths() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.toAbsolutePath(), (err, entries) => {
                if (err) {
                    reject(err);
                    return;
                }
                const result = [];
                entries.forEach((name) => {
                    const absolutePath = path.join(this.toAbsolutePath(), name);
                    result.push(LocalPath_1.LocalPath.givenAbsolutePath(absolutePath));
                });
                resolve(result);
            });
        });
    }
    toChildDirectories() {
        return this.toChildPaths().then((childPaths) => {
            return childPaths
                .filter((childPath) => childPath.isDirectory())
                .map((childPath) => LocalDirectory.givenLocalPath(childPath));
        });
    }
    toChildFiles() {
        return this.toChildPaths().then((childPaths) => {
            return childPaths
                .filter((childPath) => childPath.isFile())
                .map((childPath) => LocalFile_1.LocalFile.givenLocalPath(childPath));
        });
    }
    toDescendantFiles() {
        let result = [];
        return new Promise((resolve, reject) => {
            fs.readdir(this.toAbsolutePath(), (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                return util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(files, async (name) => {
                    try {
                        const absolutePath = path.join(this.toAbsolutePath(), name);
                        const stat = fs.statSync(absolutePath);
                        if (stat.isFile()) {
                            result.push(LocalFile_1.LocalFile.givenAbsolutePath(absolutePath));
                        }
                        else if (stat.isDirectory()) {
                            const childDirectory = LocalDirectory.givenAbsolutePath(absolutePath);
                            result = result.concat(await childDirectory.toDescendantFiles());
                        }
                    }
                    catch (err) {
                        // empty
                    }
                }).then(() => {
                    resolve(result);
                });
            });
        });
    }
}
exports.LocalDirectory = LocalDirectory;
//# sourceMappingURL=index.js.map