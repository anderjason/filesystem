import { Test } from "@anderjason/tests";
import { LocalFile } from ".";

Test.define("hasExtension returns the expected results", () => {
  const table: [string, string[], boolean][] = [
    ["", [".jpg"], false],
    ["", [], false],
    ["/path/to/file.abc.txt", [".abc.txt"], false],
    ["/path/to/file.abc.txt", [".txt"], true],
    ["/path/to/file.txt", [".jpg", ".txt"], true],
    ["/path/to/file.txt", [".jpg"], false],
    ["/path/to/file.txt", [".TXT", ".txt"], true],
    ["/path/to/file.TXT", [".txt"], false],
    ["/path/to/file.txt", [".txt"], true],
    ["/path/to/file", [".jpg"], false],
    ["/path/to/file", [], false],
    ["file.txt", [".txt"], true],
    ["file", [".jpg"], false],
    ["file", ["file"], false],
    ["path/to/file.txt", [".txt"], true],
  ];

  table.forEach((tuple) => {
    const absolutePath = tuple[0];
    const extensions = tuple[1];
    const expected = tuple[2];

    const actual = LocalFile.givenAbsolutePath(absolutePath).hasExtension(
      extensions
    );

    Test.assert(actual === expected);
  });
});
