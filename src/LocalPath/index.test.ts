import { Test } from "@anderjason/tests";
import { LocalPath } from ".";

Test.define("LocalPath can change extension", () => {
  const tests = [
    ["/my/path/Test.jpg", ".txt", "/my/path/Test.txt"],
    ["/my/path.something/Test.jpg", ".txt", "/my/path.something/Test.txt"],
    ["/my/path/Test", ".txt", "/my/path/Test.txt"],
    ["/my/path/Test.jpg", ".jpg", "/my/path/Test.jpg"],
    ["/my/path/Test.txt", "jpg", "/my/path/Test.jpg"],
    ["/my/path/Test.jpg", "", "/my/path/Test"],
    ["/my/path/Test", "", "/my/path/Test"],
  ];

  tests.forEach((test) => {
    const before = LocalPath.givenAbsolutePath(test[0]);
    const ext = test[1];
    const expected = test[2];

    const actual = before.withExtension(ext);
    Test.assert(
      actual.toAbsolutePath() === expected,
      JSON.stringify({
        test,
        actual,
      })
    );
  });
});
