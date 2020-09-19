import { Test } from "@anderjason/tests";
import { LocalDirectory } from ".";

Test.define("LocalDirectory converts to a parent directory", () => {
  const original = LocalDirectory.givenAbsolutePath("/my/local/directory");
  const parent = original.toOptionalParentDirectory();
  if (parent == null) {
    throw new Error("Parent is null");
  }

  Test.assert(parent.toAbsolutePath() === "/my/local");
});
