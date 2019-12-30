# Contributing

Thanks for contributing!

## Development

### Installing dependencies

We use [`yarn`](https://yarnpkg.com/en/docs/getting-started).

Install all dependencies by running:

```sh
$ yarn
```

### Examples

We have various deck scenarios in `examples` that are part of the development process. So far, they are of following flavors:

- `examples/cli-{NAME}`: Test the CLI dev server for CLI scenarios

We have a helper script to run **all** of the CLI examples in dev server mode with:

```sh
$ yarn start:examples
```

#### `examples/cli-mdx`

A CLI build using MDX slides found in `examples/cli-mdx/slides.mdx`.

```sh
# In one terminal open CLI dev server
$ yarn start:cli-mdx

# In another open a browser to 3000
$ open http://localhost:3000/
```

#### `examples/cli-mdx-babel`

A CLI build using MDX slides found in `examples/cli-mdx-babel/slides.mdx`, a custom `.babelrc` for additional functionality beyond `@babel/preset-react`, a `Spectacle`-customized slide import, and a custom theme found at `examples/cli-mdx-babel/theme.js`.

```sh
# In one terminal open CLI dev server
$ yarn start:cli-mdx-babel

# In another open a browser to 3001
$ open http://localhost:3001/
```

#### `examples/cli-md`

A CLI build using vanilla Markdown slides found in `examples/cli-md/slides.md`.

```sh
# In one terminal open CLI dev server
$ yarn start:cli-md

# In another open a browser to 3100
$ open http://localhost:3100/
```

### Boilerplate

The additional CLI tool `spectacle-boilerplate` produces standalone projects that consist of a starting Spectacle deck (as `.js`, `.mdx`, or .`mdx`). In localdev, we create sample outputs in `.examples-boilerplate`.

We have a helper script to run **all** of the boilerplate examples in dev server mode with:

```sh
$ yarn start:boilerplate
```

#### `.examples-boilerplate/mdx`

A boilerplate build using MDX slides found in `examples/cli-mdx/slides.mdx`.

```sh
# Generate, install, and build. (Build not needed for `start` dev server.)
$ yarn boilerplate:generate:mdx
$ yarn boilerplate:install:mdx
$ yarn boilerplate:build:mdx

# In one terminal open CLI dev server
$ yarn boilerplate:start:mdx

# In another open a browser to 4000
$ open http://localhost:4000/
```

#### `.examples-boilerplate/md`

A boilerplate build using vanilla Markdown slides found in `examples/cli-md/slides.md`.

```sh
# Generate, install, and build. (Build not needed for `start` dev server.)
$ yarn boilerplate:generate:md
$ yarn boilerplate:install:md
$ yarn boilerplate:build:md

# In one terminal open CLI dev server
$ yarn boilerplate:start:md

# In another open a browser to 4100
$ open http://localhost:4100/
```


#### `.examples-boilerplate/js`

A boilerplate build using vanilla JavaScript slides found in `lib/templates/js-slides/index.js`. This file is modified from: https://github.com/FormidableLabs/spectacle/blob/task/rewrite/examples/js/index.js and we should try to keep it up to date.

```sh
# Generate, install, and build. (Build not needed for `start` dev server.)
$ yarn boilerplate:generate:js
$ yarn boilerplate:install:js
$ yarn boilerplate:build:js

# In one terminal open CLI dev server
$ yarn boilerplate:start:js

# In another open a browser to 4200
$ open http://localhost:4200/
```

### Testing

@TODO(3) https://github.com/FormidableLabs/spectacle-cli/issues/3

### Linting and Formatting

To check (and fix) code:

```sh
$ yarn lint
$ yarn lint-fix
```

### Before submitting a PR

Thanks for taking the time to help us make Spectacle even better! Before you go ahead and submit a PR, make sure that you have done the following:

- Consider if your changes should be incorporated in one or more `examples/*` scenarios. Like a new feature, option, etc. Let's try out everything we add!
- Add an `## UNRELEASED` `CHANGELOG.md` entry for later publishing ease.
- Check if the usage for `README.md` changes by executing `$ node bin/spectacle/cli.js -h`, `$ node bin/boilerplate/cli.js -h`,  and potentially updating.
- Check that all of the examples build: `yarn examples:build`.
- Check that all of the boilerplate examples generate, install, and build:

    ```sh
    $ yarn boilerplate:generate
    $ yarn boilerplate:install
    $ yarn boilerplate:build
    ```

- Run all checks using `yarn run check`

### Releasing a new version to NPM

_Only for project administrators_.

1. Update `CHANGELOG.md`, following format for previous versions
2. Commit as "Changes for version VERSION"
3. Run `npm version patch` (or `minor|major|VERSION`) to run tests and lint,
   build published directories, then update `package.json` + add a git tag.
4. Run `npm publish` and publish to NPM if all is well.
5. Run `git push && git push --tags`

## Contributor Covenant Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at emma.brillhart@formidable.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
