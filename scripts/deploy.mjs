import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')

function run(command, cwd) {
  execSync(command, { cwd, stdio: 'inherit' })
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Missing dist/index.html — run npm run build first.')
  process.exit(1)
}

const remote = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim()
const workDir = mkdtempSync(join(tmpdir(), 'dianakmnguyen-gh-pages-'))

try {
  cpSync(dist, workDir, { recursive: true })
  run('git init', workDir)
  run('git checkout -b gh-pages', workDir)
  run('git add -A', workDir)
  run('git commit -m "Deploy"', workDir)
  run(`git push -f "${remote}" gh-pages`, workDir)
} finally {
  rmSync(workDir, { recursive: true, force: true })
}
