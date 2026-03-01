#!/usr/bin/env node
/**
 * Pre-compile blog markdown files into JSON for Cloudflare Workers compatibility.
 *
 * Cloudflare Workers can't use fs.readdirSync/readFileSync at runtime.
 * This script generates JSON files that webpack bundles at build time.
 *
 * Usage: node scripts/blog/generate-blog-json.js
 * Run automatically via the "prebuild" npm script.
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const blogRoot = path.join(__dirname, '../../content/blog')
const outputDir = path.join(__dirname, '../../data')

const locales = ['en', 'es']

for (const locale of locales) {
  const dir = path.join(blogRoot, locale)
  if (!fs.existsSync(dir)) {
    console.log(`Skipping ${locale}: directory not found`)
    continue
  }

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()

  const posts = []
  for (const filename of files) {
    try {
      const filePath = path.join(dir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      if (!data.id || !data.title || !data.slug || !data.date) {
        continue
      }

      posts.push({
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        date: data.date,
        updated: data.updated || data.date,
        readTime: data.readTime || '3 min read',
        category: data.category || 'Moving Tips',
        image_folder: data.image_folder || null,
        featured: data.featured || null,
        image_keywords: data.image_keywords || [],
        images: data.images || [],
        service_link: data.service_link || null,
        location_link: data.location_link || null,
        status: data.status || 'pending',
        needs_ai_image: data.needs_ai_image || false,
        content: content.trim(),
      })
    } catch (err) {
      console.error(`Failed to parse ${filename}:`, err.message)
    }
  }

  const outputPath = path.join(outputDir, `blog-posts-${locale}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(posts))
  const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1)
  console.log(`${locale}: ${posts.length} posts → ${outputPath} (${sizeMB} MB)`)
}
