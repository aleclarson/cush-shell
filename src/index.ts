import exec, { Args, SyncArgs } from '@cush/exec'
import dedent from 'dedent'
import exitHook from 'exit-hook'
import md5Hex from 'md5-hex'
import os from 'os'
import path from 'path'
import fs from 'saxon/sync'

export default shell
shell.sync = shellSync

/** Create a temporary shell script and execute it immediately. */
function shell(script: string, ...args: Args) {
  return withScript(script, (bin, execPath, done) => {
    try {
      var result = exec(bin, [execPath], ...args)
    } catch (error) {
      throw (done(), error)
    }
    result.then(done, done)
    return result
  })
}

/** Create a temporary shell script and execute it synchronously. */
function shellSync(script: string, ...args: SyncArgs) {
  return withScript(script, (bin, execPath, done) => {
    try {
      return exec.sync(bin, [execPath], ...args)
    } finally {
      done()
    }
  })
}

function withScript<T>(
  script: string,
  exec: (bin: string, execPath: string, done: () => void) => T
) {
  const { bin, code } = prepareScript(script)
  const hexId = md5Hex(code).slice(0, 12)
  const execPath = path.join(getScriptDir(), hexId + '.sh')
  fs.write(execPath, code)
  return exec(bin, execPath, () => fs.remove(execPath))
}

let scriptDir = ''
function getScriptDir() {
  if (!scriptDir) {
    scriptDir = path.join(os.tmpdir(), 'cush-shell')
    fs.mkdir(scriptDir)
    exitHook(() => {
      fs.remove(scriptDir, true)
    })
  }
  return scriptDir
}

function prepareScript(script: string) {
  script = dedent(script)

  // Parse the shebang.
  let bin = 'sh'
  if (script.startsWith('#!')) {
    const match = /^#!\s*(.+?)(?:\n+(.+)|$)/.exec(script)
    if (match) {
      bin = match[1]
      script = match[2]
    }
  }

  // Bail on first non-zero exit code.
  script = 'set -e \n' + script

  return { bin, code: script }
}
