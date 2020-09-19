/// <reference types="node" />
import { LocalPath } from "../LocalPath";
import { LocalDirectory } from "../LocalDirectory";
import { Instant } from "@anderjason/time";
import { DataSize } from "../DataSize";
export declare class LocalFile {
    static givenAbsolutePath(...pathParts: string[]): LocalFile;
    static givenRelativePath(directory: LocalDirectory, ...pathParts: string[]): LocalFile;
    static givenLocalPath(localPath: LocalPath): LocalFile;
    static givenCurrentFile(filename: string): LocalFile;
    private _localPath;
    private constructor();
    isAccessible(): Promise<boolean>;
    hasExtension(extensions: string[]): boolean;
    copyFile(targetFile: LocalFile): Promise<void>;
    deleteFile(): Promise<void>;
    writeFile(data: any): Promise<void>;
    toAbsolutePath(): string;
    toContentBuffer(): Promise<Buffer>;
    toContentString(encoding?: BufferEncoding): Promise<string>;
    toCreatedInstant(): Promise<Instant>;
    toModifiedInstant(): Promise<Instant>;
    toSize(): Promise<DataSize>;
    toDirectory(): LocalDirectory;
    toFilename(): string;
    toFilenameWithoutExtension(): string;
    toExtension(): string;
    toLocalPath(): LocalPath;
    withFilename(filename: string): LocalFile;
    withExtension(extension: string): LocalFile;
}
