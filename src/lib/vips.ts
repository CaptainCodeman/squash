import Vips from 'wasm-vips'
import jxl_url from 'wasm-vips/vips-jxl.wasm?url'
import heif_url from 'wasm-vips/vips-heif.wasm?url'
import type { Format } from './format'
import { DEV } from 'esm-env'

const dynamicLibraries = DEV
	? undefined
	: [
			jxl_url.substring(jxl_url.lastIndexOf('assets/')),
			heif_url.substring(heif_url.lastIndexOf('assets/'))
		]

let cleanup: Function

const vips = await Vips({
	dynamicLibraries,
	preRun: (module) => {
		module.setAutoDeleteLater(false)
		module.setDelayFunction((fn: Function) => (cleanup = fn))
	}
})

vips.Cache.max(0)

export async function thumbnail(source: ArrayBuffer) {
	console.time('thumbnail')

	const image = vips.Image.thumbnailBuffer(source, 128)
	const thumb = image.jpegsaveBuffer({
		Q: 50,
		keep: vips.ForeignKeep.none
	})

	console.log({thumb})

	image.delete()

	console.timeEnd('thumbnail')

	return thumb.buffer
}

export async function process(source: ArrayBuffer, format: Format, quality: number) {
	console.time('process')

	const image = vips.Image.newFromBuffer(source)

	let type: string
	let encoded: Uint8Array

	switch (format) {
		case 'AVIF':
			type = 'image/avif'
			encoded = image.heifsaveBuffer({
				Q: quality,
				effort: 4,
				compression: 'av1',
				subsample_mode: vips.ForeignSubsample.on,
				keep: vips.ForeignKeep.none
			})
			break
		case 'JPEG':
			type = 'image/jpeg'
			encoded = image.jpegsaveBuffer({
				Q: quality,
				optimize_coding: true,
				trellis_quant: true,
				quant_table: 3,
				subsample_mode: vips.ForeignSubsample.on,
				keep: vips.ForeignKeep.none
			})
			break
		case 'JXL':
			type = 'image/jxl'
			encoded = image.jxlsaveBuffer({
				Q: quality,
				keep: vips.ForeignKeep.none
			})
			break
		case 'PNG':
			type = 'image/png'
			encoded = image.pngsaveBuffer({
				keep: vips.ForeignKeep.none
			})
			break
		case 'WEBP':
			type = 'image/webp'
			encoded = image.webpsaveBuffer({
				Q: quality,
				min_size: true,
				effort: 6,
				keep: vips.ForeignKeep.none
			})
			break
	}

	image.delete()

	if (cleanup) cleanup()

	console.timeEnd('process')

	return { buffer: encoded.buffer, type }
}
