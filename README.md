# xlang — X language support for VS Code

Provides VS Code syntax highlighting, live diagnostics, and inferred type hovers for `.x`, `.xs`, and `.xd` files. The Rust language server checks source without executing it.

## Features

- Keywords, types, and modifiers highlighted (kept in sync with the spec, incl. `linear`, `defer`, etc.)
- Literals: integer / float / string / char / boolean / name literals `\name`
- Lifetimes `'a` / `'_` and reference types `T 'a &`
- Comments, operators, string interpolation `\(e)`, loop labels `'label`
- Live parser and supported static type diagnostics
- Hover over an expression to see its inferred type in an X syntax-highlighted card; VS Code highlights the matching expression

## Install

This is a local extension, not published to the VS Code Marketplace. Choose one:

### Option 1: Package as VSIX (recommended)

```sh
cd ext
pnpm install
pnpm package-local              # produces xlang-0.0.4.vsix for this host
```

Then in VS Code: Extensions panel → `...` menu → **Install from VSIX…** → select the generated `.vsix`. Reload the window.

### Option 2: Development mode

Run `pnpm install` in `ext`, open the `ext` folder in VS Code, then press `F5` to bundle the client, build the debug language server, and launch an Extension Development Host window. Open a `.x` file there to see highlighting, diagnostics, and type hovers.

Set `xlang.serverPath` to use a different language server executable. Relative paths are resolved from the current workspace. When unset, the extension uses its packaged executable or the workspace's `xc/target/debug/x-language-server` build.

## Development notes

- Grammar file: `syntaxes/x.tmLanguage.json` (TextMate grammar, kept in sync with the `docs/` spec)
- Language configuration: `language-configuration.json` (comments, bracket pairing)
- `pnpm package-local` builds and temporarily stages the current host's Rust server, creates a VSIX, then removes only the staging directory it created.
- The first VSIX is a local build; `publisher: xlang` is only the package identifier and does not imply a Marketplace listing.

## Changelog

See CHANGELOG.md.
