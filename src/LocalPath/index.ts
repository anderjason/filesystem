import * as fs from "fs";
import * as path from "path";
import { LocalDirectory } from "../LocalDirectory";

export class LocalPath {
  static givenAbsolutePath(...pathParts: string[]): LocalPath {
    return new LocalPath(path.join(...pathParts));
  }

  static givenRelativePath(
    directory: LocalDirectory,
    ...pathParts: string[]
  ): LocalPath {
    return LocalPath.givenAbsolutePath(
      directory.toAbsolutePath(),
      ...pathParts
    );
  }

  private _absolutePath: string;

  private constructor(absolutePath: string) {
    this._absolutePath = absolutePath;
  }

  isAccessible(): Promise<boolean> {
    return new Promise((resolve) => {
      return fs.access(this._absolutePath, (err) => {
        resolve(err == null);
      });
    });
  }

  isDirectory(): boolean {
    if (!fs.existsSync(this._absolutePath)) {
      return false;
    }

    const stat = fs.statSync(this._absolutePath);
    return stat.isDirectory();
  }

  isFile(): boolean {
    if (!fs.existsSync(this._absolutePath)) {
      return false;
    }

    const stat = fs.statSync(this._absolutePath);
    return stat.isFile();
  }

  toAbsolutePath(): string {
    return this._absolutePath;
  }

  withExtension(extension: string): LocalPath {
    if (extension.length > 0 && extension[0] !== ".") {
      extension = `.${extension}`;
    }

    const newPath =
      this._absolutePath.replace(path.extname(this._absolutePath), "") +
      extension;

    return new LocalPath(newPath);
  }

  withPreBuildPath(): LocalPath {
    return LocalPath.givenAbsolutePath(
      this.toAbsolutePath().replace(".wireframe/build/", "")
    );
  }
}
