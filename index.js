"use strict";

import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

const [VENV_NAME, PYTHON_FILENAME, PYTHON_COMMAND] = (function () {
  if (isWin()) {
    return ["venv", "python.exe", "python"];
  } else if (isMac()) {
    return ["venv", "python3", "python3"];
  } else if (isLinux()) {
    return ["venv", "python3", "python3"];
  } else {
    throw new Error(`${process.platform} has not been supported.`);
  }
})();

function isWin() {
  return process.platform === "win32";
}

function isMac() {
  return process.platform === "darwin";
}

function isLinux() {
  return process.platform === "linux";
}

function S(...args) {
  return new Promise(function (resolve, reject) {
    let stdout = "";
    let stderr = "";

    const child = spawn(args.shift(), args);

    child.stdout.on("data", function (data) {
      stdout += data.toString();
    });

    child.stderr.on("data", function (data) {
      stderr += data.toString();
    });

    child.on("error", function (err) {
      reject(err);
    });

    child.on("exit", function (code, signal) {
      resolve({ stdout, stderr });
    });
  });
}

function chkDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function rmDir(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true });
  }
}

class Py {
  /**
   *
   * @param {string} installationPath default "."
   */
  constructor(installationPath) {
    this.installationPath = installationPath || ".";
    this.venvPath = path.join(this.installationPath, VENV_NAME);

    if (isWin()) {
      this.pythonPath = path.join(
        this.installationPath,
        VENV_NAME,
        "Scripts",
        PYTHON_FILENAME
      );
    } else if (isMac()) {
      this.pythonPath = path.join(
        this.installationPath,
        VENV_NAME,
        "bin",
        PYTHON_FILENAME
      );
    } else if (isLinux()) {
      this.pythonPath = path.join(
        this.installationPath,
        VENV_NAME,
        "bin",
        PYTHON_FILENAME
      );
    }
  }
}

Py.prototype.getPythonCommand = function () {
  return this.inInitialized() ? this.pythonPath : PYTHON_COMMAND;
};

Py.prototype.inInitialized = function () {
  return (
    fs.existsSync(this.installationPath) &&
    fs.existsSync(this.venvPath) &&
    fs.existsSync(this.pythonPath)
  );
};
/**
 * Check if venv is created.
 * @param {boolean} force Create venv directory after remove exists venv directory
 * @returns
 */
Py.prototype.init = async function (force) {
  if (!PYTHON_COMMAND) {
    throw new Error(`${process.platform} has not been supported.`);
  }
  if (!this.inInitialized()) {
    chkDir(this.installationPath);

    if (force) {
      rmDir(this.venvPath);
    }

    chkDir(this.venvPath);

    // Create venv
    await S(PYTHON_COMMAND, "-m", "venv", this.venvPath);

    // Check venv has created
    if (!this.inInitialized()) {
      throw new Error("Could not create venv.");
    }
  }
  return this;
};
/**
 *
 */
Py.prototype.destory = async function () {
  rmDir(this.venvPath);
  return this;
};
/**
 *
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
Py.prototype.freeze = async function () {
  const res = await S(this.getPythonCommand(), "-m", "pip", "freeze");
  return res;
};
/**
 *
 * @returns {Promise<{name: string, version: string}[]>}
 */
Py.prototype.getModules = async function () {
  const { stdout, stderr } = await this.freeze();
  return stdout
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .split(/\n/)
    .map(function (item) {
      return {
        name: item.split("==")[0],
        version: item.split("==")[1],
      };
    });
};
/**
 * Check the module is installed in venv
 * @param {string} moduleName
 * @returns {Promise<boolean>}
 */
Py.prototype.isInstalled = async function (moduleName) {
  const modules = await this.getModules();
  for (const m of modules) {
    if (m.name.indexOf(moduleName) === 0) {
      return true;
    }
  }
  return false;
};
/**
 *
 * @param {string} moduleName path or name
 * @param {array} args
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
Py.prototype.install = async function (moduleName, args) {
  const res = await S(
    this.getPythonCommand(),
    "-m",
    "pip",
    "install",
    moduleName,
    ...(Array.isArray(args) ? args : [])
  );

  return res;
};
/**
 *
 * @param {string} scriptPath
 * @param {array} args
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
Py.prototype.exec = async function (scriptPath, args) {
  const res = await S(
    this.getPythonCommand(),
    scriptPath,
    ...(Array.isArray(args) ? args : [])
  );

  return res;
};

export { Py };
