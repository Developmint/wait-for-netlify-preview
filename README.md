# wait-for-netlify-preview

> Let your Travis CI wait for the Netlify build preview

[![npm (scoped with tag)](https://img.shields.io/npm/v/wait-for-netlify-preview/latest.svg?style=flat-square)](https://npmjs.com/package/wait-for-netlify-preview)
[![npm](https://img.shields.io/npm/dt/wait-for-netlify-preview.svg?style=flat-square)](https://npmjs.com/package/wait-for-netlify-preview)
[![Build Status](https://travis-ci.com/Developmint/wait-for-netlify-preview.svg?branch=master)](https://travis-ci.com/Developmint/wait-for-netlify-preview)
[![codecov](https://codecov.io/gh/Developmint/wait-for-netlify-preview/branch/master/graph/badge.svg)](https://codecov.io/gh/Developmint/wait-for-netlify-preview)
[![Dependencies](https://david-dm.org/Developmint/wait-for-netlify-preview/status.svg?style=flat-square)](https://david-dm.org/Developmint/wait-for-netlify-preview)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)
[![thanks](https://img.shields.io/badge/thanks-%E2%99%A5-ff69b4.svg)](https://thanks.lichter.io/)

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

### Yarn

```
$ yarn add wait-for-netlify-preview
```

### npm

```
$ npm install --save wait-for-netlify-preview
```

## Usage

Requires the following environment variables:
 - `GITHUB_API_TOKEN`
 - `TRAVIS_PULL_REQUEST_SHA`
 - `TRAVIS_REPO_SLUG`

```
$ wait-for-netlify-preview
```

An example `.travis.yml` can be found here soon!

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## Inspiration

Inspired by [wait-for-now](https://github.com/wyze/wait-for-now)

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter
