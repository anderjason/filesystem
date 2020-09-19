"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFile = void 0;
const fs = require("fs");
const path = require("path");
const LocalPath_1 = require("../LocalPath");
const LocalDirectory_1 = require("../LocalDirectory");
const time_1 = require("@anderjason/time");
const DataSize_1 = require("../DataSize");
class LocalFile {
    constructor(localPath) {
        this._localPath = localPath;
    }
    static givenAbsolutePath(...pathParts) {
        return LocalFile.givenLocalPath(LocalPath_1.LocalPath.givenAbsolutePath(...pathParts));
    }
    static givenRelativePath(directory, ...pathParts) {
        const localPath = LocalPath_1.LocalPath.givenRelativePath(directory, ...pathParts);
        if (localPath.isDirectory()) {
            throw new Error("Specified path is a directory (expected a file)");
        }
        return new LocalFile(localPath);
    }
    static givenLocalPath(localPath) {
        return new LocalFile(localPath);
    }
    static givenCurrentFile(filename) {
        return new LocalFile(LocalPath_1.LocalPath.givenAbsolutePath(filename).withPreBuildPath());
    }
    isAccessible() {
        return this._localPath.isAccessible();
    }
    hasExtension(extensions) {
        if (extensions == null || extensions.length === 0) {
            return false;
        }
        const ext = path.extname(this.toAbsolutePath());
        return extensions.indexOf(ext) !== -1;
    }
    async copyFile(targetFile) {
        await targetFile.toDirectory().createDirectory();
        return new Promise((resolve, reject) => {
            fs.copyFile(this.toAbsolutePath(), targetFile.toAbsolutePath(), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    deleteFile() {
        return this.isAccessible().then((isAccessible) => {
            if (!isAccessible) {
                return;
            }
            return new Promise((resolve, reject) => {
                fs.unlink(this.toAbsolutePath(), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    async writeFile(data) {
        const absolutePath = this.toAbsolutePath();
        await this.toDirectory().createDirectory();
        return new Promise((resolve, reject) => {
            fs.writeFile(absolutePath, data, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    toAbsolutePath() {
        return this._localPath.toAbsolutePath();
    }
    toContentBuffer() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.toAbsolutePath(), (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
    toContentString(encoding) {
        return this.toContentBuffer().then((buffer) => {
            return buffer.toString(encoding);
        });
    }
    toCreatedInstant() {
        return new Promise((resolve, reject) => {
            fs.stat(this.toAbsolutePath(), (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(time_1.Instant.givenEpochMilliseconds(stats.ctimeMs));
            });
        });
    }
    toModifiedInstant() {
        return new Promise((resolve, reject) => {
            fs.stat(this.toAbsolutePath(), (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(time_1.Instant.givenEpochMilliseconds(stats.mtimeMs));
            });
        });
    }
    toSize() {
        return new Promise((resolve, reject) => {
            fs.stat(this.toAbsolutePath(), (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(DataSize_1.DataSize.givenBytes(stats.size));
            });
        });
    }
    toDirectory() {
        return LocalDirectory_1.LocalDirectory.givenAbsolutePath(path.dirname(this.toAbsolutePath()));
    }
    toFilename() {
        return path.basename(this.toAbsolutePath());
    }
    toFilenameWithoutExtension() {
        return this.toFilename().replace(/\.[^/.]+$/, "");
    }
    toExtension() {
        return path.extname(this.toAbsolutePath());
    }
    toLocalPath() {
        return this._localPath;
    }
    withFilename(filename) {
        const directory = this.toDirectory();
        return LocalFile.givenRelativePath(directory, filename);
    }
    withExtension(extension) {
        const directory = this.toDirectory();
        const filenameWithoutExtension = this.toFilenameWithoutExtension();
        return LocalFile.givenRelativePath(directory, filenameWithoutExtension + extension);
    }
}
exports.LocalFile = LocalFile;
//# sourceMappingURL=index.js.map