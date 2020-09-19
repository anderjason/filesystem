export declare class DataSize {
    static isEqual(a: DataSize, b: DataSize): boolean;
    static givenBytes(bytes: number): DataSize;
    static givenKilobytes(kilobytes: number): DataSize;
    static givenKibibytes(kibibytes: number): DataSize;
    static givenMegabytes(megabytes: number): DataSize;
    static givenMibibytes(mibibytes: number): DataSize;
    static givenGigabytes(gigabytes: number): DataSize;
    static givenGibibytes(gibibytes: number): DataSize;
    static givenTerabytes(terabytes: number): DataSize;
    static givenTebibytes(tebibytes: number): DataSize;
    private _bytes;
    constructor(bytes: number);
    isEqual(other: DataSize): boolean;
    toBytes(): number;
    toKilobytes(): number;
    toKibibytes(): number;
    toMegabytes(): number;
    toMibibytes(): number;
    toGigabytes(): number;
    toGibibytes(): number;
    toTerabytes(): number;
    toTebibytes(): number;
    toString(unit: "B" | "KB" | "KiB" | "MB" | "MiB" | "GB" | "GiB" | "TB" | "TiB", fractionDigits: number, includeUnit: boolean): string;
}
