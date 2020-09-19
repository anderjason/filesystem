import * as fs from "fs";
import * as path from "path";
import { PromiseUtil } from "@anderjason/util";
import { LocalFile } from "../LocalFile";
import { LocalPath } from "../LocalPath";

export class LocalDirectory {
  static givenAbsolutePath(...pathParts: string[]): LocalDirectory {
    return LocalDirectory.givenLocalPath(
      LocalPath.givenAbsolutePath(...pathParts)
    );
  }

  static givenRelativePath(
    directory: LocalDirectory,
    ...pathParts: string[]
  ): LocalDirectory {
    const localPath = LocalPath.givenRelativePath(directory, ...pathParts);

    if (localPath.isFile()) {
      throw new Error("Specified path is a file (expected a directory)");
    }

    return new LocalDirectory(localPath);
  }

  static givenCurrentDirectory(dirname: string): LocalDirectory {
    return LocalDirectory.givenLocalPath(
      LocalPath.givenAbsolutePath(dirname).withPreBuildPath()
    );
  }

  static givenLocalPath(localPath: LocalPath): LocalDirectory {
    return new LocalDirectory(localPath);
  }

  private _localPath: LocalPath;

  private constructor(localPath: LocalPath) {
    this._localPath = localPath;
  }

  isAccessible(): Promise<boolean> {
    return this._localPath.isAccessible();
  }

  toAbsolutePath(): string {
    return this._localPath.toAbsolutePath();
  }

  async copyDirectory(targetDirectory: LocalDirectory): Promise<void> {
    const sourceIsAccessible = await this.isAccessible();
    if (!sourceIsAccessible) {
      throw new Error(
        `Source directory is not accessible at ${this.toAbsolutePath()}`
      );
    }

    const targetIsAccessible = await targetDirectory.isAccessible();
    if (targetIsAccessible) {
      throw new Error(
        `Target directory already exists at ${targetDirectory.toAbsolutePath()}`
      );
    }

    await targetDirectory.createDirectory();

    const sourceChildFiles = await this.toChildFiles();
    await PromiseUtil.asyncSequenceGivenArrayAndCallback(
      sourceChildFiles,
      (sourceChildFile) => {
        const targetChildFile = LocalFile.givenRelativePath(
          targetDirectory,
          sourceChildFile.toFilename()
        );
        return sourceChildFile.copyFile(targetChildFile);
      }
    );

    const sourceChildDirectories = await this.toChildDirectories();
    await PromiseUtil.asyncSequenceGivenArrayAndCallback(
      sourceChildDirectories,
      (sourceChildDirectory) => {
        const targetChildDirectory = LocalDirectory.givenRelativePath(
          targetDirectory,
          sourceChildDirectory.toDirectoryName()
        );

        return sourceChildDirectory.copyDirectory(targetChildDirectory);
      }
    );
  }

  deleteDirectory(): Promise<void> {
    return this.isAccessible().then((isAccessible) => {
      if (!isAccessible) {
        return;
      }

      return this.toChildFiles()
        .then((childFiles) => {
          return PromiseUtil.asyncSequenceGivenArrayAndCallback(
            childFiles,
            (file) => {
              return file.deleteFile();
            }
          );
        })
        .then(() => {
          return this.toChildDirectories();
        })
        .then((childDirectories) => {
          return PromiseUtil.asyncSequenceGivenArrayAndCallback(
            childDirectories,
            (dir) => {
              return dir.deleteDirectory();
            }
          );
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

  createDirectory(): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.access(this.toAbsolutePath(), async (err) => {
        if (err) {
          // directory does not exist
          const parentDirectory = this.toOptionalParentDirectory();
          if (parentDirectory != null) {
            await parentDirectory.createDirectory();
          }

          fs.mkdir(this.toAbsolutePath(), undefined, (mkdirErr) => {
            if (mkdirErr) {
              reject(mkdirErr);
              return;
            }

            resolve();
          });
        } else {
          // directory already exists
          resolve();
        }
      });
    });
  }

  createDirectorySync(): void {
    try {
      fs.accessSync(this.toAbsolutePath());
    } catch (err) {
      // directory does not exist
      const parentDirectory = this.toOptionalParentDirectory();
      if (parentDirectory != null) {
        parentDirectory.createDirectorySync();
      }

      fs.mkdirSync(this.toAbsolutePath(), undefined);
    }
  }

  toLocalPath(): LocalPath {
    return this._localPath;
  }

  toDirectoryName(): string {
    return path.basename(this.toAbsolutePath());
  }

  toOptionalParentDirectory(): LocalDirectory | undefined {
    return LocalDirectory.givenAbsolutePath(
      path.dirname(this.toAbsolutePath())
    );
  }

  toRelativePathParts(
    target: LocalPath | LocalFile | LocalDirectory
  ): string[] {
    return this.toRelativePathString(target).split(path.sep);
  }

  toRelativePathString(target: LocalPath | LocalFile | LocalDirectory): string {
    return path.relative(this.toAbsolutePath(), target.toAbsolutePath());
  }

  toChildPaths(): Promise<LocalPath[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.toAbsolutePath(), (err, entries) => {
        if (err) {
          reject(err);
          return;
        }

        const result: LocalPath[] = [];

        entries.forEach((name) => {
          const absolutePath = path.join(this.toAbsolutePath(), name);

          result.push(LocalPath.givenAbsolutePath(absolutePath));
        });

        resolve(result);
      });
    });
  }

  toChildDirectories(): Promise<LocalDirectory[]> {
    return this.toChildPaths().then((childPaths) => {
      return childPaths
        .filter((childPath) => childPath.isDirectory())
        .map((childPath) => LocalDirectory.givenLocalPath(childPath));
    });
  }

  toChildFiles(): Promise<LocalFile[]> {
    return this.toChildPaths().then((childPaths) => {
      return childPaths
        .filter((childPath) => childPath.isFile())
        .map((childPath) => LocalFile.givenLocalPath(childPath));
    });
  }

  toDescendantFiles(): Promise<LocalFile[]> {
    let result: LocalFile[] = [];

    return new Promise((resolve, reject) => {
      fs.readdir(this.toAbsolutePath(), (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        return PromiseUtil.asyncSequenceGivenArrayAndCallback(
          files,
          async (name: string) => {
            try {
              const absolutePath = path.join(this.toAbsolutePath(), name);
              const stat = fs.statSync(absolutePath);

              if (stat.isFile()) {
                result.push(LocalFile.givenAbsolutePath(absolutePath));
              } else if (stat.isDirectory()) {
                const childDirectory = LocalDirectory.givenAbsolutePath(
                  absolutePath
                );
                result = result.concat(
                  await childDirectory.toDescendantFiles()
                );
              }
            } catch (err) {
              // empty
            }
          }
        ).then(() => {
          resolve(result);
        });
      });
    });
  }
}
