export class DataSize {
  static isEqual(a: DataSize, b: DataSize): boolean {
    if (a == null && b == null) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    return a.isEqual(b);
  }

  static givenBytes(bytes: number): DataSize {
    return new DataSize(bytes);
  }

  static givenKilobytes(kilobytes: number): DataSize {
    return new DataSize(kilobytes * 1000);
  }

  static givenKibibytes(kibibytes: number): DataSize {
    return new DataSize(kibibytes * 1024);
  }

  static givenMegabytes(megabytes: number): DataSize {
    return DataSize.givenKilobytes(megabytes * 1000);
  }

  static givenMibibytes(mibibytes: number): DataSize {
    return DataSize.givenKibibytes(mibibytes * 1024);
  }

  static givenGigabytes(gigabytes: number): DataSize {
    return DataSize.givenMegabytes(gigabytes * 1000);
  }

  static givenGibibytes(gibibytes: number): DataSize {
    return DataSize.givenMibibytes(gibibytes * 1024);
  }

  static givenTerabytes(terabytes: number): DataSize {
    return DataSize.givenGigabytes(terabytes * 1000);
  }

  static givenTebibytes(tebibytes: number): DataSize {
    return DataSize.givenGibibytes(tebibytes * 1024);
  }

  private _bytes: number;

  constructor(bytes: number) {
    this._bytes = bytes;
  }

  isEqual(other: DataSize): boolean {
    if (other == null) {
      return false;
    }

    return this._bytes === other._bytes;
  }

  toBytes(): number {
    return this._bytes;
  }

  toKilobytes(): number {
    return this._bytes / 1000;
  }

  toKibibytes(): number {
    return this._bytes / 1024;
  }

  toMegabytes(): number {
    return this.toKilobytes() / 1000;
  }

  toMibibytes(): number {
    return this.toKibibytes() / 1024;
  }

  toGigabytes(): number {
    return this.toMegabytes() / 1000;
  }

  toGibibytes(): number {
    return this.toMibibytes() / 1024;
  }

  toTerabytes(): number {
    return this.toGigabytes() / 1000;
  }

  toTebibytes(): number {
    return this.toGibibytes() / 1024;
  }

  toString(
    unit: "B" | "KB" | "KiB" | "MB" | "MiB" | "GB" | "GiB" | "TB" | "TiB",
    fractionDigits: number,
    includeUnit: boolean
  ): string {
    let value: number;
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
    } else {
      return value.toFixed(fractionDigits);
    }
  }
}
