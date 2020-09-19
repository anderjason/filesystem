import * as fs from "fs";
import * as path from "path";
import { LocalPath } from "../LocalPath";
import { LocalDirectory } from "../LocalDirectory";
import { Instant } from "@anderjason/time";
import { DataSize } from "../DataSize";

export class LocalFile {
  static givenAbsolutePath(...pathParts: string[]): LocalFile {
    return LocalFile.givenLocalPath(LocalPath.givenAbsolutePath(...pathParts));
  }

  static givenRelativePath(
    directory: LocalDirectory,
    ...pathParts: string[]
  ): LocalFile {
    const localPath = LocalPath.givenRelativePath(directory, ...pathParts);

    if (localPath.isDirectory()) {
      throw new Error("Specified path is a directory (expected a file)");
    }

    return new LocalFile(localPath);
  }

  static givenLocalPath(localPath: LocalPath): LocalFile {
    return new LocalFile(localPath);
  }

  static givenCurrentFile(filename: string): LocalFile {
    return new LocalFile(
      LocalPath.givenAbsolutePath(filename).withPreBuildPath()
    );
  }

  private _localPath: LocalPath;

  private constructor(localPath: LocalPath) {
    this._localPath = localPath;
  }

  isAccessible(): Promise<boolean> {
    return this._localPath.isAccessible();
  }

  hasExtension(extensions: string[]) {
    if (extensions == null || extensions.length === 0) {
      return false;
    }

    const ext = path.extname(this.toAbsolutePath());
    return extensions.indexOf(ext) !== -1;
  }

  async copyFile(targetFile: LocalFile): Promise<void> {
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

  deleteFile(): Promise<void> {
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

  async writeFile(data: any): Promise<void> {
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

  toAbsolutePath(): string {
    return this._localPath.toAbsolutePath();
  }

  toContentBuffer(): Promise<Buffer> {
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

  toContentString(encoding?: BufferEncoding): Promise<string> {
    return this.toContentBuffer().then((buffer) => {
      return buffer.toString(encoding);
    });
  }

  toCreatedInstant(): Promise<Instant> {
    return new Promise((resolve, reject) => {
      fs.stat(this.toAbsolutePath(), (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(Instant.givenEpochMilliseconds(stats.ctimeMs));
      });
    });
  }

  toModifiedInstant(): Promise<Instant> {
    return new Promise((resolve, reject) => {
      fs.stat(this.toAbsolutePath(), (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(Instant.givenEpochMilliseconds(stats.mtimeMs));
      });
    });
  }

  toSize(): Promise<DataSize> {
    return new Promise((resolve, reject) => {
      fs.stat(this.toAbsolutePath(), (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(DataSize.givenBytes(stats.size));
      });
    });
  }

  toDirectory(): LocalDirectory {
    return LocalDirectory.givenAbsolutePath(
      path.dirname(this.toAbsolutePath())
    );
  }

  toFilename(): string {
    return path.basename(this.toAbsolutePath());
  }

  toFilenameWithoutExtension(): string {
    return this.toFilename().replace(/\.[^/.]+$/, "");
  }

  toExtension(): string {
    return path.extname(this.toAbsolutePath());
  }

  toLocalPath(): LocalPath {
    return this._localPath;
  }

  withFilename(filename: string): LocalFile {
    const directory: LocalDirectory = this.toDirectory();

    return LocalFile.givenRelativePath(directory, filename);
  }

  withExtension(extension: string): LocalFile {
    const directory: LocalDirectory = this.toDirectory();
    const filenameWithoutExtension = this.toFilenameWithoutExtension();

    return LocalFile.givenRelativePath(
      directory,
      filenameWithoutExtension + extension
    );
  }
}
