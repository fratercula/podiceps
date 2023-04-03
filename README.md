# Podiceps

A middleware design library for request

## Dev

### Initialization

```bash
yarn
```

### Run Script

```bash
lerna run xxx --scope=@podiceps/xxx
```

### Update Version

> commit first

```bash
lerna version patch/minor/major
```

### Publish

```bash
lerna publish from-package
```

### Create Package

```bash
lerna create @podiceps/xxx
```

### Add Module

```bash
lerna add @podiceps/core --scope=@podiceps/auth --dev
```

or

fill package.json dependencies

```bash
lerna bootstrap
```
