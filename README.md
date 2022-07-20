# foundryvtt-dndmashup

Please add your description here.

## Installation

In Foundry, specify the manifest URL as:

    https://github.com/mdekrey/foundryvtt-dndmashup/releases/latest/download/system.json

## Development

### Prerequisites

In order to build this system, recent versions of `node` and `npm` are
required. Most likely, using `yarn` also works, but only `npm` is officially
supported. We recommend using the latest lts version of `node`. If you use `nvm`
to manage your `node` versions, you can simply run

```
nvm install
```

in the project's root directory.

You also need to install the project's dependencies. To do so, run

```
npm install
```

### Linking the built project to Foundry VTT

In order to provide a fluent development experience, it is recommended to link
the built system to your local Foundry VTT installation's data folder. In
order to do so, first add a file called `foundryconfig.json` to the project root
with the following content:

```
{
  "dataPath": "/absolute/path/to/your/FoundryVTT"
}
```

Then run

```
npm run link-project
```

On Windows, creating symlinks requires administrator privileges, so unfortunately
you need to run the above command in an administrator terminal for it to work.

### Creating new libs using Nx

```
nx generate @nrwl/react:library reactlib --compiler=swc --buildable
```

### Creating a release

Create a tag and release in GitHub.

## Licensing

This project is being developed under the terms of the
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT] for Foundry Virtual Tabletop.

Please add your licensing information here. Add your chosen license as
`LICENSE` file to the project root and mention it here. If you don't know which
license to choose, take a look at [Choose an open source license].

[league basic js module template]: https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template
[limited license agreement for module development]: https://foundryvtt.com/article/license/
[choose an open source license]: https://choosealicense.com/
