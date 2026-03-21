#!/usr/bin/env node
// ---
// description: Add screenshot references from docs/artifacts/screenshots to a specific FLOW markdown file
// argument-hint: [MARKDOWN_FILE="docs/artifacts/FLOW260316-mobile-card-reader.md"]
// command: node docs/_ngan/command/add-screenshot-references.mjs docs/artifacts/FLOW260316-mobile-card-reader.md
// ---

import fs from 'node:fs/promises'
import path from 'node:path'

const [, , markdownArg] = process.argv

if (!markdownArg) {
  console.error('Usage: node docs/_ngan/command/add-screenshot-references.mjs <markdown-file>')
  process.exit(1)
}

const cwd = process.cwd()
const markdownPath = path.resolve(cwd, markdownArg)
const screenshotRoot = path.resolve(cwd, 'docs/artifacts/screenshots')
const flowArtifactsDir = path.resolve(cwd, 'docs/artifacts')
const auditPath = path.join(screenshotRoot, 'audit.md')

function nodeIdFromFilename(fileName) {
  const baseName = path.basename(fileName, path.extname(fileName))
  const match = baseName.match(/^(?:(v\d+)-)?([a-z0-9_]+)(?:-.+)?$/i)

  if (!match) {
    return null
  }

  return {
    versionPrefix: match[1]?.toLowerCase() ?? null,
    nodeId: match[2].toUpperCase(),
  }
}

function getSectionVersion(lines, startIndex) {
  for (let index = startIndex; index >= 0; index -= 1) {
    const match = lines[index].match(/^##\s+(V\d+)\b/i)

    if (match) {
      return match[1].toLowerCase()
    }
  }

  return null
}

function extractNodeIds(mermaidLines) {
  const nodeIds = []
  const seen = new Set()

  for (const line of mermaidLines) {
    const match = line.match(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*(?=(?:\(|\[|\{))/)

    if (!match) {
      continue
    }

    const nodeId = match[1]

    if (seen.has(nodeId)) {
      continue
    }

    seen.add(nodeId)
    nodeIds.push(nodeId)
  }

  return nodeIds
}

function stripScreenshotAssets(lines, startIndex) {
  if (lines[startIndex] !== '#### Screenshot Assets') {
    return { nextIndex: startIndex, removed: false }
  }

  let index = startIndex

  while (index < lines.length && lines[index] === '#### Screenshot Assets') {
    index += 1
  }

  while (index < lines.length && lines[index].trim() === '') {
    index += 1
  }

  while (index < lines.length && lines[index].startsWith('- ')) {
    index += 1
  }

  while (index < lines.length && lines[index].trim() === '') {
    index += 1
  }

  return { nextIndex: index, removed: true }
}

function buildScreenshotAssetsBlock(files, markdownDir, screenshotDir) {
  if (files.length === 0) {
    return []
  }

  const lines = ['#### Screenshot Assets', '']

  for (const file of files) {
    const absolutePath = path.join(screenshotDir, file)
    const relativePath = path.relative(markdownDir, absolutePath).split(path.sep).join('/')
    lines.push(`- [\`${file}\`](${relativePath})`)
  }

  return [...lines, '']
}

async function listScreenshotFiles(rootDir) {
  const files = []

  async function walk(currentDir) {
    let dirEntries = []

    try {
      dirEntries = await fs.readdir(currentDir, { withFileTypes: true })
    } catch (error) {
      if (error.code === 'ENOENT') {
        return
      }

      throw error
    }

    for (const entry of dirEntries) {
      const absolutePath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(absolutePath)
        continue
      }

      if (!entry.isFile() || entry.name === 'audit.md') {
        continue
      }

      files.push(path.relative(rootDir, absolutePath).split(path.sep).join('/'))
    }
  }

  await walk(rootDir)
  return files.sort()
}

async function listFlowMarkdowns() {
  const dirEntries = await fs.readdir(flowArtifactsDir, { withFileTypes: true })

  return dirEntries
    .filter((entry) => entry.isFile() && /^FLOW.*\.md$/i.test(entry.name))
    .map((entry) => path.join(flowArtifactsDir, entry.name))
    .sort()
}

function extractLinkedScreenshotPaths(markdownText) {
  const linked = new Set()
  const absolutePattern = /\/Users\/[^\s")]*\/docs\/artifacts\/screenshots\/([^\s")]+)/g
  const relativePattern = /\((screenshots\/[^)\s]+)\)/g

  for (const match of markdownText.matchAll(absolutePattern)) {
    linked.add(match[1])
  }

  for (const match of markdownText.matchAll(relativePattern)) {
    linked.add(match[1].replace(/^screenshots\//, ''))
  }

  return linked
}

async function updateAuditFile() {
  const [screenshotFiles, flowMarkdowns] = await Promise.all([
    listScreenshotFiles(screenshotRoot),
    listFlowMarkdowns(),
  ])
  const linkedFiles = new Set()

  for (const flowPath of flowMarkdowns) {
    const markdownText = await fs.readFile(flowPath, 'utf8')

    for (const linkedPath of extractLinkedScreenshotPaths(markdownText)) {
      linkedFiles.add(linkedPath)
    }
  }

  const lines = [
    '# Screenshot Audit',
    '',
    '| Screenshot File | Status |',
    '| --- | --- |',
  ]

  for (const screenshotFile of screenshotFiles) {
    const status = linkedFiles.has(screenshotFile) ? '✅' : '☐'
    lines.push(`| \`${screenshotFile}\` | ${status} |`)
  }

  await fs.mkdir(screenshotRoot, { recursive: true })
  await fs.writeFile(auditPath, `${lines.join('\n')}\n`)
}

async function main() {
  const raw = await fs.readFile(markdownPath, 'utf8')
  const screenshotDir = path.join(screenshotRoot, path.basename(markdownPath, path.extname(markdownPath)))
  const markdownDir = path.dirname(markdownPath)

  let screenshotFiles = []

  try {
    const dirEntries = await fs.readdir(screenshotDir, { withFileTypes: true })
    screenshotFiles = dirEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort()
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  const screenshotIndex = new Map()

  for (const file of screenshotFiles) {
    const parsed = nodeIdFromFilename(file)

    if (!parsed) {
      continue
    }

    const key = `${parsed.versionPrefix ?? 'default'}:${parsed.nodeId}`

    if (!screenshotIndex.has(key)) {
      screenshotIndex.set(key, file)
    }
  }

  const lines = raw.split('\n')
  const output = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    output.push(line)

    if (line !== '```mermaid') {
      continue
    }

    const mermaidStart = index + 1
    let mermaidEnd = mermaidStart

    while (mermaidEnd < lines.length && lines[mermaidEnd] !== '```') {
      mermaidEnd += 1
    }

    if (mermaidEnd >= lines.length) {
      throw new Error(`Unclosed mermaid block in ${markdownPath}`)
    }

    const versionPrefix = getSectionVersion(lines, index)
    const mermaidBody = lines.slice(mermaidStart, mermaidEnd)
    const cleanedBody = mermaidBody.filter((bodyLine) => !bodyLine.trimStart().startsWith('click '))
    const nodeIds = extractNodeIds(cleanedBody)
    const matchedFiles = []
    const clickLines = []

    for (const nodeId of nodeIds) {
      const key = `${versionPrefix ?? 'default'}:${nodeId}`
      const screenshotFile = screenshotIndex.get(key)

      if (!screenshotFile) {
        continue
      }

      matchedFiles.push(screenshotFile)
      const absolutePath = path.join(screenshotDir, screenshotFile)
      clickLines.push(`    click ${nodeId} "${absolutePath}" "Open screenshot"`)
    }

    output.pop()
    output.push('```mermaid')
    output.push(...cleanedBody)

    if (clickLines.length > 0) {
      output.push('')
      output.push(...clickLines)
    }

    output.push('```')

    index = mermaidEnd

    let nextIndex = index + 1
    while (nextIndex < lines.length && lines[nextIndex].trim() === '') {
      nextIndex += 1
    }

    const stripped = stripScreenshotAssets(lines, nextIndex)
    if (stripped.removed) {
      index = stripped.nextIndex - 1
    }

    const assetsBlock = buildScreenshotAssetsBlock(matchedFiles, markdownDir, screenshotDir)

    if (assetsBlock.length > 0) {
      output.push('')
      output.push(...assetsBlock)
      output.pop()
    }
  }

  await fs.writeFile(markdownPath, `${output.join('\n')}\n`)
  await updateAuditFile()
  console.log(`Updated screenshot references in ${path.relative(cwd, markdownPath)}`)
  console.log(`Updated screenshot audit at ${path.relative(cwd, auditPath)}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
