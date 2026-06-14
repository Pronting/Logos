#!/usr/bin/env node
/**
 * parse-issue.mjs — turn a GitHub issue payload into a normalized JSON
 *
 * Input:
 *   - GitHub event JSON file (or stdin) — $GITHUB_EVENT_PATH equivalent
 *   - The issue must have been created from a form template that includes
 *     a leading "category" field (one of: blog, book, book-review, column, article).
 *
 * Output:
 *   - writes .cms-tmp/payload.json with shape { category, slug, payload }
 *   - exits 0 on success, 1 on parse error
 *
 * Body parsing strategy:
 *   GitHub issue forms render the body with hidden HTML comments of the form:
 *     ### Tasklist
 *     <!-- tasklist -->
 *     - [x] something
 *
 *   For form templates (checkboxes/dropdown/input), the form fields are NOT in
 *   hidden comments — they're rendered as a structured YAML-ish block. We
 *   parse a custom convention: the issue body MUST start with a fenced YAML
 *   block ```yaml ... ```. Inside that block the user fills category + fields.
 *
 *   This is a pragmatic choice that works without depending on GitHub's
 *   unstable internal form-rendering format.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { categorySchema, schemaByCategory } from './schemas.mjs'

const FENCE_RE = /```yaml\s*\n([\s\S]*?)```/

async function readEvent(eventPath) {
  if (eventPath && eventPath !== '-') {
    const raw = await fs.readFile(eventPath, 'utf8')
    return JSON.parse(raw)
  }
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function extractYamlBlock(body) {
  if (!body) throw new Error('issue body is empty')
  const m = FENCE_RE.exec(body)
  if (!m) {
    throw new Error(
      'issue body must start with a fenced ```yaml ... ``` block (this is a CMS issue template requirement)',
    )
  }
  return m[1]
}

function extractBodyAfterYaml(body) {
  const idx = body.indexOf('```', body.indexOf('```yaml'))
  if (idx === -1) return ''
  return body.slice(idx).replace(/^```\s*/, '').trim()
}

export function parseIssueBody(body) {
  const yamlText = extractYamlBlock(body)
  const obj = YAML.parse(yamlText)
  if (!obj || typeof obj !== 'object') {
    throw new Error('YAML block did not parse to an object')
  }
  const category = obj.category
  const cat = categorySchema.parse(category)
  const schema = schemaByCategory[cat]
  // Pull only known fields
  const raw = { ...obj }
  delete raw.category
  const payload = schema.parse(raw)
  const bodyContent = extractBodyAfterYaml(body ?? '')
  return { category: cat, payload: { ...payload, body: bodyContent } }
}

async function main() {
  const eventPath = process.argv[2] || process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    console.error('Usage: parse-issue.mjs <event.json>  (or set GITHUB_EVENT_PATH)')
    process.exit(1)
  }
  const event = await readEvent(eventPath)
  const issueBody = event?.issue?.body ?? event?.comment?.body ?? ''
  let parsed
  try {
    parsed = parseIssueBody(issueBody)
  } catch (err) {
    console.error(`❌ parse failed: ${err.message}`)
    process.exit(1)
  }
  const out = {
    issueNumber: event?.issue?.number,
    issueTitle: event?.issue?.title,
    issueAuthor: event?.issue?.user?.login,
    ...parsed,
  }
  const outDir = path.resolve('.cms-tmp')
  await fs.mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, 'payload.json')
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log(`✅ parsed → ${outPath}`)
  console.log(`   category=${out.category}  slug=${out.payload.slug}`)
}

// Only run main() when invoked as a CLI (not when imported by tests)
const isCli = import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}` ||
              process.argv[1]?.endsWith('parse-issue.mjs')
if (isCli) {
  main().catch((err) => {
    console.error('parse-issue crashed:', err)
    process.exit(1)
  })
}
