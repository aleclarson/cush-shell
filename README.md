# @cush/shell

[![npm](https://img.shields.io/npm/v/@cush/shell.svg)](https://www.npmjs.com/package/@cush/shell)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

> Throwaway shell scripts

**Features:**

- Anything a shell script can do
  - Piping
  - Multiple lines
  - Shebang
- Includes `set -e` automatically
- Optional blocking mode
- Cleans up after script finishes or when process exits
- Executed with [`@cush/exec`](https://www.npmjs.com/package/@cush/exec)
  - Arguments are passed through (see readme for more info)

&nbsp;

## Usage

```ts
import shell from '@cush/shell'

// Scripts can be indented if you like.
const script = `
  #!/usr/bin/bash
  ls | xargs -I {} echo {}
`

const proc = shell(script, (stdout, stderr) => {
  // This callback is optional.
  // See @cush/exec docs for more info.
})

// You can await the stdout.
const stdout = await proc

// Blocking mode
shell.sync(script)
```
