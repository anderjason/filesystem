import { LocalDirectory } from "../LocalDirectory";
export declare class LocalPath {
    static givenAbsolutePath(...pathParts: string[]): LocalPath;
    static givenRelativePath(directory: LocalDirectory, ...pathParts: string[]): LocalPath;
    private _absolutePath;
    private constructor();
    isAccessible(): Promise<boolean>;
    isDirectory(): boolean;
    isFile(): boolean;
    toAbsolutePath(): string;
    withExtension(extension: string): LocalPath;
    withPreBuildPath(): LocalPath;
}
