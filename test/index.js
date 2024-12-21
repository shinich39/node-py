import { Py } from "../dist/py.mjs";

const MODULE_NAME = "python-resize-image";
const SCRIPT_PATH_1 = "./test/src/resize-image.py";
const SCRIPT_PATH_2 = "./test/src/return-json.py";

(async function () {
  const installationPath = "."; // Current directory
  const py = new Py(installationPath);
  await py.init(); // Create virtual environment
  await py.install(MODULE_NAME); // Install module in venv
  await py.isInstalled(MODULE_NAME); // Check module is installed
  await py.freeze(); // Get python freeze data
  await py.getModules(); // Get installed modules

  // Execute python script with module installation
  ;(async function () {
    await py.install("pillow"); // install module in venv
    console.log(`py.isInstalled(${MODULE_NAME}):`,await py.isInstalled(MODULE_NAME));
    console.log(`py.isInstalled("pillow"):`, await py.isInstalled("pillow"));
    const res1 = await py.exec(SCRIPT_PATH_1);
    console.log(`py.exec(${SCRIPT_PATH_1}).stdout:`, res1.stdout);
    console.log(`py.exec(${SCRIPT_PATH_1}).stderr:`, res1.stderr);

    // Execute python script and return value
    const res2 = await py.exec(SCRIPT_PATH_2);
    console.log(`py.exec(${SCRIPT_PATH_2}).stdout`, res2.stdout);
    console.log(`py.exec(${SCRIPT_PATH_2}).stderr`, res2.stderr);

    // Test freeze
    const freeze = await py.freeze();
    console.log(`py.freeze().stdout:`, freeze.stdout);
    console.log(`py.freeze().stderr:`, freeze.stderr);
  })();
})();
