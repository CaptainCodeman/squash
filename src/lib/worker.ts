/// <reference lib="webworker" />

import type { Format } from './format'
import { process, thumbnail } from './vips'

self.addEventListener(
	'message',
	async (e: MessageEvent<{ source: ArrayBuffer; format: Format; quality: number }>) => {
		const { source, format, quality } = e.data

		try {
			const thumb = await thumbnail(source)
			self.postMessage({ thumb }, [thumb])
		} catch (error) {
			// TODO: set placeholder thumbnail
		}

		try {
			const result = await process(source, format, quality)
			self.postMessage(result, [result.buffer])
		} catch (error) {
			console.error(error)
			self.postMessage({ error })
		}
	}
)
