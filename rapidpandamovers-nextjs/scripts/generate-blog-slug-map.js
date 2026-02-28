#!/usr/bin/env node
/**
 * Generates a slim blog slug map (en-slug → es-slug) from the full blog index files.
 * This avoids importing the large index.json files into the client bundle.
 *
 * Usage: node scripts/generate-blog-slug-map.js
 * Output: data/blog-slug-map.json
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const enIndex = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/blog/en/index.json'), 'utf-8'))
const esIndex = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/blog/es/index.json'), 'utf-8'))

const esById = new Map(esIndex.map((p) => [p.id, p.slug]))

const slugMap = {}
for (const post of enIndex) {
  const esSlug = esById.get(post.id)
  if (esSlug) {
    slugMap[post.slug] = esSlug
  }
}

const outPath = path.join(ROOT, 'data/blog-slug-map.json')
fs.writeFileSync(outPath, JSON.stringify(slugMap, null, 2) + '\n')

console.log(`Generated ${outPath} with ${Object.keys(slugMap).length} entries`)
