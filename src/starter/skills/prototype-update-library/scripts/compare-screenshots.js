// Compares two folders of screenshots, taken before and after an update, and
// says which screens look different, and where, so only those need looking
// at. Two pictures of the same screen are seldom the same to the byte, as
// text is smoothed a little differently each time, so a few changed pixels
// don't count.
//
//   node .claude/skills/prototype-update-library/scripts/compare-screenshots.js <before> <after>
//
// Prints a line for each picture: "same", "changed" with how many pixels and
// the area they're in (x, y, width and height, in the picture's pixels),
// "new" or "gone". No dependencies: it reads the PNGs the screenshots
// script writes itself.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const [beforeDir, afterDir] = process.argv.slice(2)
if (!beforeDir || !afterDir) {
  console.error('Usage: node compare-screenshots.js <before folder> <after folder>')
  process.exit(1)
}

// How far a channel can move, out of 255, before a pixel counts as changed:
// little, as a white card's corner on the pale blue page is only about 20.
// And how many must change before it's worth a look: smoothing moves a few
// dozen between one picture and the next; a corner a few points
// rounder moves hundreds.
const tolerance = 8
const worthALook = 200

/** A PNG's width, height and pixels, as RGBA. Only 8-bit, non-interlaced, as a browser writes them. */
function readPng(file) {
  const buffer = fs.readFileSync(file)
  let width, height, colourType
  const data = []
  for (let i = 8; i < buffer.length;) {
    const length = buffer.readUInt32BE(i)
    const type = buffer.toString('ascii', i + 4, i + 8)
    const body = buffer.subarray(i + 8, i + 8 + length)
    if (type === 'IHDR') {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      if (body[8] !== 8 || body[12] !== 0) throw new Error(`${file} isn't a PNG this can read.`)
      colourType = body[9]
    } else if (type === 'IDAT') {
      data.push(body)
    }
    i += 12 + length
  }
  const channels = { 2: 3, 6: 4 }[colourType]
  if (!channels) throw new Error(`${file} isn't a PNG this can read.`)
  const raw = zlib.inflateSync(Buffer.concat(data))
  const stride = width * channels
  const pixels = Buffer.alloc(width * height * 4)
  let previous = Buffer.alloc(stride)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)))
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? line[x - channels] : 0
      const up = previous[x]
      const upLeft = x >= channels ? previous[x - channels] : 0
      let add = 0
      if (filter === 1) add = left
      else if (filter === 2) add = up
      else if (filter === 3) add = (left + up) >> 1
      else if (filter === 4) {
        const p = left + up - upLeft
        const pa = Math.abs(p - left)
        const pb = Math.abs(p - up)
        const pc = Math.abs(p - upLeft)
        add = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft
      }
      line[x] = (line[x] + add) & 255
    }
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) pixels[(y * width + x) * 4 + c] = c < channels ? line[x * channels + c] : 255
    }
    previous = line
  }
  return { width, height, pixels }
}

function compare(a, b) {
  if (a.width !== b.width || a.height !== b.height) return `changed: a different size, ${a.width}×${a.height} before and ${b.width}×${b.height} after`
  let changed = 0
  let left = Infinity, top = Infinity, right = -1, bottom = -1
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4
      if (Math.abs(a.pixels[i] - b.pixels[i]) > tolerance || Math.abs(a.pixels[i + 1] - b.pixels[i + 1]) > tolerance || Math.abs(a.pixels[i + 2] - b.pixels[i + 2]) > tolerance) {
        changed++
        left = Math.min(left, x); right = Math.max(right, x)
        top = Math.min(top, y); bottom = Math.max(bottom, y)
      }
    }
  }
  if (changed < worthALook) return 'same'
  return `changed: ${changed} pixels, in the area at ${left}, ${top}, ${right - left + 1} wide and ${bottom - top + 1} high`
}

const pngs = folder => fs.existsSync(folder) ? fs.readdirSync(folder).filter(name => name.endsWith('.png')) : []
const names = [...new Set([...pngs(beforeDir), ...pngs(afterDir)])].sort()
for (const name of names) {
  const before = path.join(beforeDir, name)
  const after = path.join(afterDir, name)
  if (!fs.existsSync(before)) console.log(`${name}: new`)
  else if (!fs.existsSync(after)) console.log(`${name}: gone`)
  else console.log(`${name}: ${compare(readPng(before), readPng(after))}`)
}
