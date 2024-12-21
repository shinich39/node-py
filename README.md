# py-js

Create a python wrapper in javascript.

## Requirements

- nodejs
- python3

## Usage

```js
import { Py } from "py-js";

(async function () {
  // Crrent directory
  const installationPath = ".";

  const py = new Py(installationPath);

  // Create virtual environment
  await py.init();

  // Check module is installed in venv
  const booleen = await py.isInstalled("python-resize-image");

  // Install module in venv
  await py.install("python-resize-image");

  // Execute python script
  const { stdout, stderr } = await py.exec("./test/src/script.py");

  // Get data from python script
  const { stdout, stderr } = await py.exec("./test/src/script-example.py");
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);

  // Get python freeze data
  const { stdout, stderr } = await py.freeze();

  // Get installed modules
  const modules = await py.getModules();

  // Remove venv
  await py.destory();
})();
```
