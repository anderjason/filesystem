"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSize = void 0;
class DataSize {
    constructor(bytes) {
        this._bytes = bytes;
    }
    static isEqual(a, b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return a.isEqual(b);
    }
    static givenBytes(bytes) {
        return new DataSize(bytes);
    }
    static givenKilobytes(kilobytes) {
        return new DataSize(kilobytes * 1000);
    }
    static givenKibibytes(kibibytes) {
        return new DataSize(kibibytes * 1024);
    }
    static givenMegabytes(megabytes) {
        return DataSize.givenKilobytes(megabytes * 1000);
    }
    static givenMibibytes(mibibytes) {
        return DataSize.givenKibibytes(mibibytes * 1024);
    }
    static givenGigabytes(gigabytes) {
        return DataSize.givenMegabytes(gigabytes * 1000);
    }
    static givenGibibytes(gibibytes) {
        return DataSize.givenMibibytes(gibibytes * 1024);
    }
    static givenTerabytes(terabytes) {
        return DataSize.givenGigabytes(terabytes * 1000);
    }
    static givenTebibytes(tebibytes) {
        return DataSize.givenGibibytes(tebibytes * 1024);
    }
    isEqual(other) {
        if (other == null) {
            return false;
        }
        return this._bytes === other._bytes;
    }
    toBytes() {
        return this._bytes;
    }
    toKilobytes() {
        return this._bytes / 1000;
    }
    toKibibytes() {
        return this._bytes / 1024;
    }
    toMegabytes() {
        return this.toKilobytes() / 1000;
    }
    toMibibytes() {
        return this.toKibibytes() / 1024;
    }
    toGigabytes() {
        return this.toMegabytes() / 1000;
    }
    toGibibytes() {
        return this.toMibibytes() / 1024;
    }
    toTerabytes() {
        return this.toGigabytes() / 1000;
    }
    toTebibytes() {
        return this.toGibibytes() / 1024;
    }
    toString(unit, fractionDigits, includeUnit) {
        let value;
        switch (unit) {
            case "B":
                value = this._bytes;
                break;
            case "KB":
                value = this.toKilobytes();
                break;
            case "KiB":
                value = this.toKibibytes();
                break;
            case "MB":
                value = this.toMegabytes();
                break;
            case "MiB":
                value = this.toMibibytes();
                break;
            case "GB":
                value = this.toGigabytes();
                break;
            case "GiB":
                value = this.toGibibytes();
                break;
            case "TB":
                value = this.toTerabytes();
                break;
            case "TiB":
                value = this.toTebibytes();
                break;
            default:
                throw new Error("Unsupported unit");
        }
        if (includeUnit) {
            return `${value.toFixed(fractionDigits)} ${unit}`;
        }
        else {
            return value.toFixed(fractionDigits);
        }
    }
}
exports.DataSize = DataSize;
//# sourceMappingURL=index.js.map