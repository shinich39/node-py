"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var index_exports = {};
__export(index_exports, {
  Py: () => Py
});
module.exports = __toCommonJS(index_exports);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_child_process = require("node:child_process");
var [VENV_NAME, PYTHON_FILENAME, PYTHON_COMMAND] = function() {
  if (isWin()) {
    return ["venv", "python.exe", "python"];
  } else if (isMac()) {
    return ["venv", "python3", "python3"];
  } else if (isLinux()) {
    return ["venv", "python3", "python3"];
  } else {
    throw new Error(`${process.platform} has not been supported.`);
  }
}();
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
  return new Promise(function(resolve, reject) {
    let stdout = "";
    let stderr = "";
    const child = (0, import_node_child_process.spawn)(args.shift(), args);
    child.stdout.on("data", function(data) {
      stdout += data.toString();
    });
    child.stderr.on("data", function(data) {
      stderr += data.toString();
    });
    child.on("error", function(err) {
      reject(err);
    });
    child.on("exit", function(code, signal) {
      resolve({ stdout, stderr });
    });
  });
}
function chkDir(p) {
  if (!import_node_fs.default.existsSync(p)) {
    import_node_fs.default.mkdirSync(p, { recursive: true });
  }
}
function rmDir(p) {
  if (import_node_fs.default.existsSync(p)) {
    import_node_fs.default.rmSync(p, { recursive: true });
  }
}
var Py = class {
  /**
   *
   * @param {string} installationPath default "."
   */
  constructor(installationPath) {
    this.installationPath = installationPath || ".";
    this.venvPath = import_node_path.default.join(this.installationPath, VENV_NAME);
    if (isWin()) {
      this.pythonPath = import_node_path.default.join(
        this.installationPath,
        VENV_NAME,
        "Scripts",
        PYTHON_FILENAME
      );
    } else if (isMac()) {
      this.pythonPath = import_node_path.default.join(
        this.installationPath,
        VENV_NAME,
        "bin",
        PYTHON_FILENAME
      );
    } else if (isLinux()) {
      this.pythonPath = import_node_path.default.join(
        this.installationPath,
        VENV_NAME,
        "bin",
        PYTHON_FILENAME
      );
    }
  }
};
Py.prototype.getPythonCommand = function() {
  return this.inInitialized() ? this.pythonPath : PYTHON_COMMAND;
};
Py.prototype.inInitialized = function() {
  return import_node_fs.default.existsSync(this.installationPath) && import_node_fs.default.existsSync(this.venvPath) && import_node_fs.default.existsSync(this.pythonPath);
};
Py.prototype.init = async function(force) {
  if (!PYTHON_COMMAND) {
    throw new Error(`${process.platform} has not been supported.`);
  }
  if (!this.inInitialized()) {
    chkDir(this.installationPath);
    if (force) {
      rmDir(this.venvPath);
    }
    chkDir(this.venvPath);
    await S(PYTHON_COMMAND, "-m", "venv", this.venvPath);
    if (!this.inInitialized()) {
      throw new Error("Could not create venv.");
    }
  }
  return this;
};
Py.prototype.destory = async function() {
  rmDir(this.venvPath);
  return this;
};
Py.prototype.freeze = async function() {
  const res = await S(this.getPythonCommand(), "-m", "pip", "freeze");
  return res;
};
Py.prototype.getModules = async function() {
  const { stdout, stderr } = await this.freeze();
  return stdout.replace(/\r\n/g, "\n").replace(/\n$/, "").split(/\n/).map(function(item) {
    return {
      name: item.split("==")[0],
      version: item.split("==")[1]
    };
  });
};
Py.prototype.isInstalled = async function(moduleName) {
  const modules = await this.getModules();
  for (const m of modules) {
    if (m.name.indexOf(moduleName) === 0) {
      return true;
    }
  }
  return false;
};
Py.prototype.install = async function(moduleName, args) {
  const res = await S(
    this.getPythonCommand(),
    "-m",
    "pip",
    "install",
    moduleName,
    ...Array.isArray(args) ? args : []
  );
  return res;
};
Py.prototype.exec = async function(scriptPath, args) {
  const res = await S(
    this.getPythonCommand(),
    scriptPath,
    ...Array.isArray(args) ? args : []
  );
  return res;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Py
});
