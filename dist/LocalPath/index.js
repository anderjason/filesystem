"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPath = void 0;
const fs = require("fs");
const path = require("path");
class LocalPath {
    constructor(absolutePath) {
        this._absolutePath = absolutePath;
    }
    static givenAbsolutePath(...pathParts) {
        return new LocalPath(path.join(...pathParts));
    }
    static givenRelativePath(directory, ...pathParts) {
        return LocalPath.givenAbsolutePath(directory.toAbsolutePath(), ...pathParts);
    }
    isAccessible() {
        return new Promise((resolve) => {
            return fs.access(this._absolutePath, (err) => {
                resolve(err == null);
            });
        });
    }
    isDirectory() {
        if (!fs.existsSync(this._absolutePath)) {
            return false;
        }
        const stat = fs.statSync(this._absolutePath);
        return stat.isDirectory();
    }
    isFile() {
        if (!fs.existsSync(this._absolutePath)) {
            return false;
        }
        const stat = fs.statSync(this._absolutePath);
        return stat.isFile();
    }
    toAbsolutePath() {
        return this._absolutePath;
    }
    withExtension(extension) {
        if (extension.length > 0 && extension[0] !== ".") {
            extension = `.${extension}`;
        }
        const newPath = this._absolutePath.replace(path.extname(this._absolutePath), "") +
            extension;
        return new LocalPath(newPath);
    }
    withPreBuildPath() {
        return LocalPath.givenAbsolutePath(this.toAbsolutePath().replace(".wireframe/build/", ""));
    }
}
exports.LocalPath = LocalPath;
//# sourceMappingURL=index.js.map