import { LocalFile } from "../LocalFile";
import { LocalPath } from "../LocalPath";
export declare class LocalDirectory {
    static givenAbsolutePath(...pathParts: string[]): LocalDirectory;
    static givenRelativePath(directory: LocalDirectory, ...pathParts: string[]): LocalDirectory;
    static givenCurrentDirectory(dirname: string): LocalDirectory;
    static givenLocalPath(localPath: LocalPath): LocalDirectory;
    private _localPath;
    private constructor();
    isAccessible(): Promise<boolean>;
    toAbsolutePath(): string;
    copyDirectory(targetDirectory: LocalDirectory): Promise<void>;
    deleteDirectory(): Promise<void>;
    createDirectory(): Promise<void>;
    createDirectorySync(): void;
    toLocalPath(): LocalPath;
    toDirectoryName(): string;
    toOptionalParentDirectory(): LocalDirectory | undefined;
    toRelativePathParts(target: LocalPath | LocalFile | LocalDirectory): string[];
    toRelativePathString(target: LocalPath | LocalFile | LocalDirectory): string;
    toChildPaths(): Promise<LocalPath[]>;
    toChildDirectories(): Promise<LocalDirectory[]>;
    toChildFiles(): Promise<LocalFile[]>;
    toDescendantFiles(): Promise<LocalFile[]>;
}
