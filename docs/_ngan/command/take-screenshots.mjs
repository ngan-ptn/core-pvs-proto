#!/usr/bin/env node
// ---
// description: Take one or many screenshots from generic URLs using Playwright
// argument-hint: [--url "https://..."] [--output "docs/screenshots/example.png"] [--manifest "docs/_ngan/command/screenshot-manifest.example.json"]
// command: node docs/_ngan/command/take-screenshots.mjs --url "https://example.com" --output "docs/screenshots/example.png"
// command: node docs/_ngan/command/take-screenshots.mjs --manifest "docs/_ngan/command/screenshot-manifest.example.json"
// ---
//
// How to use:
// 1. Install dependencies once:
//    pnpm install
//
// 2. Take one screenshot:
//    pnpm auto:screenshot -- --url "https://example.com" --output "docs/screenshots/example.png"
//
// 3. Take many screenshots from a manifest:
//    pnpm auto:screenshot -- --manifest "docs/_ngan/command/screenshot-manifest.example.json"
//
// 4. Optional extras:
//    --wait-for "text=Example Domain"
//    --delay 1000
//    --viewport 1440x900
//    --full-page
//    --headed
//
// Notes:
// - Use the double "--" after pnpm auto:screenshot so your options are passed to this script.
// - The script creates missing output folders automatically.
// - If Playwright browsers are missing, run:
//   pnpm exec playwright install

import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_VIEWPORT = { width: 1440, height: 900 }
const DEFAULT_TIMEOUT = 30_000
const DEFAULT_WAIT_UNTIL = 'domcontentloaded'

function printHelp() {
  console.log(`
Generic Screenshot Tool

Single URL mode:
  node docs/_ngan/command/take-screenshots.mjs \\
    --url "https://example.com" \\
    --output "docs/screenshots/example.png"

Batch manifest mode:
  node docs/_ngan/command/take-screenshots.mjs \\
    --manifest "docs/_ngan/command/screenshot-manifest.example.json"

Options:
  --url <value>          URL to capture in single mode
  --output <value>       Output image path in single mode
  --manifest <value>     JSON manifest path for batch mode
  --wait-for <value>     Playwright selector to wait for before capture
  --delay <ms>           Extra wait time before capture
  --viewport <WxH>       Example: 1440x900
  --full-page            Capture the full page instead of only the viewport
  --headed               Show the browser while capturing
  --timeout <ms>         Timeout for page load and waiting steps
  --wait-until <value>   Page load event: load | domcontentloaded | networkidle | commit
  --help                 Show this help

Manifest format:
  [
    {
      "url": "https://example.com",
      "output": "docs/screenshots/example-home.png",
      "waitFor": "text=Sign in",
      "delay": 1000,
      "fullPage": true,
      "viewport": "1440x900"
    }
  ]
`.trim())
}

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function parseInteger(value, flagName) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 0) {
    fail(`${flagName} must be a non-negative integer.`)
  }

  return parsed
}

function parseViewport(value, flagName = '--viewport') {
  const match = /^(\d+)x(\d+)$/i.exec(value)

  if (!match) {
    fail(`${flagName} must use the format WIDTHxHEIGHT, for example 1440x900.`)
  }

  return {
    width: parseInteger(match[1], `${flagName} width`),
    height: parseInteger(match[2], `${flagName} height`),
  }
}

function parseArgs(argv) {
  const options = {
    delay: 0,
    fullPage: false,
    headed: false,
    timeout: DEFAULT_TIMEOUT,
    viewport: DEFAULT_VIEWPORT,
    waitUntil: DEFAULT_WAIT_UNTIL,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    switch (arg) {
      case '--url':
        options.url = argv[index + 1]
        index += 1
        break
      case '--output':
        options.output = argv[index + 1]
        index += 1
        break
      case '--manifest':
        options.manifest = argv[index + 1]
        index += 1
        break
      case '--wait-for':
        options.waitFor = argv[index + 1]
        index += 1
        break
      case '--delay':
        options.delay = parseInteger(argv[index + 1], '--delay')
        index += 1
        break
      case '--viewport':
        options.viewport = parseViewport(argv[index + 1], '--viewport')
        index += 1
        break
      case '--timeout':
        options.timeout = parseInteger(argv[index + 1], '--timeout')
        index += 1
        break
      case '--wait-until':
        options.waitUntil = argv[index + 1]
        index += 1
        break
      case '--full-page':
        options.fullPage = true
        break
      case '--headed':
        options.headed = true
        break
      case '--help':
      case '-h':
        options.help = true
        break
      default:
        fail(`Unknown argument: ${arg}. Run with --help to see the supported options.`)
    }
  }

  return options
}

function normalizeTask(rawTask, index, defaults) {
  if (!rawTask || typeof rawTask !== 'object' || Array.isArray(rawTask)) {
    fail(`Manifest item ${index + 1} must be an object.`)
  }

  if (!rawTask.url || typeof rawTask.url !== 'string') {
    fail(`Manifest item ${index + 1} is missing a valid "url".`)
  }

  if (!rawTask.output || typeof rawTask.output !== 'string') {
    fail(`Manifest item ${index + 1} is missing a valid "output".`)
  }

  return {
    url: rawTask.url,
    output: rawTask.output,
    waitFor: typeof rawTask.waitFor === 'string' ? rawTask.waitFor : undefined,
    delay: rawTask.delay == null ? defaults.delay : parseInteger(String(rawTask.delay), `manifest item ${index + 1} delay`),
    fullPage: rawTask.fullPage == null ? defaults.fullPage : Boolean(rawTask.fullPage),
    timeout: rawTask.timeout == null ? defaults.timeout : parseInteger(String(rawTask.timeout), `manifest item ${index + 1} timeout`),
    waitUntil: typeof rawTask.waitUntil === 'string' ? rawTask.waitUntil : defaults.waitUntil,
    viewport: rawTask.viewport == null
      ? defaults.viewport
      : typeof rawTask.viewport === 'string'
        ? parseViewport(rawTask.viewport, `manifest item ${index + 1} viewport`)
        : rawTask.viewport,
  }
}

async function loadTasks(options) {
  if (options.manifest && (options.url || options.output)) {
    fail('Use either single URL mode or manifest mode in one run, not both together.')
  }

  if (options.manifest) {
    const manifestPath = path.resolve(process.cwd(), options.manifest)
    const raw = await fs.readFile(manifestPath, 'utf8')
    const data = JSON.parse(raw)

    if (!Array.isArray(data)) {
      fail('The manifest file must contain a JSON array.')
    }

    return data.map((task, index) => normalizeTask(task, index, options))
  }

  if (!options.url || !options.output) {
    fail('Single URL mode requires both --url and --output.')
  }

  return [
    {
      url: options.url,
      output: options.output,
      waitFor: options.waitFor,
      delay: options.delay,
      fullPage: options.fullPage,
      timeout: options.timeout,
      viewport: options.viewport,
      waitUntil: options.waitUntil,
    },
  ]
}

async function ensureDirectory(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  return absolutePath
}

async function captureTask(browser, task, index, total) {
  const context = await browser.newContext({ viewport: task.viewport })
  const page = await context.newPage()
  const absoluteOutput = await ensureDirectory(task.output)
  const label = `[${index + 1}/${total}]`

  try {
    console.log(`${label} Opening ${task.url}`)
    await page.goto(task.url, {
      timeout: task.timeout,
      waitUntil: task.waitUntil,
    })

    if (task.waitFor) {
      console.log(`${label} Waiting for ${task.waitFor}`)
      await page.waitForSelector(task.waitFor, { timeout: task.timeout })
    }

    if (task.delay > 0) {
      console.log(`${label} Waiting an extra ${task.delay}ms`)
      await page.waitForTimeout(task.delay)
    }

    await page.screenshot({
      fullPage: task.fullPage,
      path: absoluteOutput,
    })

    console.log(`${label} Saved ${task.output}`)
    return { ok: true, output: task.output }
  } catch (error) {
    console.error(`${label} Failed for ${task.url}`)
    console.error(`  ${error.message}`)
    return { ok: false, output: task.output, error }
  } finally {
    await context.close()
  }
}

async function loadPlaywright() {
  try {
    return await import('playwright')
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      fail(
        'Playwright is not installed in this checkout yet. Run "pnpm install" first. ' +
        'If Chromium is still missing after that, run "pnpm exec playwright install".',
      )
    }

    throw error
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    return
  }

  const tasks = await loadTasks(options)
  const { chromium } = await loadPlaywright()
  const browser = await chromium.launch({ headless: !options.headed })
  const results = []

  console.log(`Starting ${tasks.length} screenshot task${tasks.length === 1 ? '' : 's'}.`)

  try {
    for (let index = 0; index < tasks.length; index += 1) {
      const result = await captureTask(browser, tasks[index], index, tasks.length)
      results.push(result)
    }
  } finally {
    await browser.close()
  }

  const failures = results.filter((result) => !result.ok)

  console.log('')
  console.log(`Finished ${results.length} task${results.length === 1 ? '' : 's'}.`)
  console.log(`Successful: ${results.length - failures.length}`)
  console.log(`Failed: ${failures.length}`)

  if (failures.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
