# Changes

## 0.4.1

- **Feature**: Add `spectacle-boilerplate` generation tool.

## 0.4.0

- **Breaking**: Extract MDX loader to https://github.com/FormidableLabs/spectacle-mdx-loader
- Corrects small bug in webpack `resolve.alias` for nested path imports.

## 0.3.0

- **Breaking**: Require node10+.
- Update various dependencies.

## 0.2.3

- Bugfix: Get hot reload properly working with `*.md` files. (Now runs `.md` through `file-loader` and just `.mdx` through `spectacle-mdx-loader`).
- Tests: Add `autoLayout` and `template` features to `examples`. [#10](https://github.com/FormidableLabs/spectacle-cli/issues/10)

## 0.2.2

- Updates to Spectacle 6.0.0-alpha.3 for presenter mode overflow fix

## 0.2.1

- Bugfix: `-b|--build` output builds now enable `production` webpack-optimized builds. [#6](https://github.com/FormidableLabs/spectacle-cli/issues/6)

## 0.2.0

- Add `--autoLayout, -f` option for autolayout. [#8](https://github.com/FormidableLabs/spectacle-cli/pulls/8)
- Add `--template, -t` option for user-provided deck template. [#8](https://github.com/FormidableLabs/spectacle-cli/pulls/8)

## 0.1.0

- Initial release.
- Markdown support `--src slides.md` with babel-less pure transform.
- MDX support `--src slides.mdx` with full babel + JS support.
- Actions (`-a|--action`): `server` (default), `build`
- Custom theme file support (`--theme theme.js`)
