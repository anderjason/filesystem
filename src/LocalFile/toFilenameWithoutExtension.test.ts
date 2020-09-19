import { Test } from "@anderjason/tests";
import { LocalFile } from ".";

Test.define(
  "LocalFile returns a valid filename without extension given one dot",
  () => {
    const result = LocalFile.givenAbsolutePath(
      "/Volumes/TestPath.2001/My File.jpg"
    ).toFilenameWithoutExtension();

    const expected = "My File";

    Test.assert(result === expected);
  }
);

Test.define(
  "basenameWithoutExtension returns a valid base name with multiple dots",
  () => {
    const result = LocalFile.givenAbsolutePath(
      "/Volumes/TestPath.2001/My File.test.xml"
    ).toFilenameWithoutExtension();

    const expected = "My File.test";

    Test.assert(result === expected);
  }
);
