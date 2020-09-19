import { Test } from "@anderjason/tests";
import "./LocalDirectory/index.test";
import "./LocalFile/index.test";
import "./LocalPath/index.test";

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
