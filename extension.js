const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
const { LanguageClient } = require("vscode-languageclient/node");

let client;

function executableName() {
  return process.platform === "win32"
    ? "x-language-server.exe"
    : "x-language-server";
}

function configuredServerPath(context) {
  const configured = vscode.workspace
    .getConfiguration("xlang")
    .get("serverPath", "")
    .trim();
  if (!configured) return undefined;

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  return path.isAbsolute(configured)
    ? configured
    : path.resolve(workspaceFolder ?? context.extensionPath, configured);
}

function findServer(context) {
  const configured = configuredServerPath(context);
  if (configured) return configured;

  const executable = executableName();
  const packaged = context.asAbsolutePath(path.join("server", executable));
  if (fs.existsSync(packaged)) return packaged;

  const development = path.resolve(context.extensionPath, "../xc/target/debug", executable);
  if (fs.existsSync(development)) return development;
  return packaged;
}

async function activate(context) {
  const outputChannel = vscode.window.createOutputChannel("X Language Server");
  context.subscriptions.push(outputChannel);

  const serverPath = findServer(context);
  if (!fs.existsSync(serverPath)) {
    const message = `X language server was not found at ${serverPath}. Build it with the extension's F5 task or set xlang.serverPath.`;
    outputChannel.appendLine(message);
    await vscode.window.showErrorMessage(message);
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const serverOptions = {
    command: serverPath,
    args: [],
    options: workspaceFolder ? { cwd: workspaceFolder } : undefined,
  };
  const clientOptions = {
    documentSelector: [{ scheme: "file", language: "x" }],
    outputChannel,
  };

  client = new LanguageClient(
    "xLanguageServer",
    "X Language Server",
    serverOptions,
    clientOptions,
  );
  await client.start();
}

async function deactivate() {
  if (!client) return undefined;
  const currentClient = client;
  client = undefined;
  return currentClient.stop();
}

module.exports = { activate, deactivate };
