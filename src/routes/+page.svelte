<script lang="ts">
	import { defaultQuality, Format, pool, type Task } from '$lib'
	import CompressionOptions from './CompressionOptions.svelte'
	import DownloadAll from './DownloadAll.svelte'
	import DropZone from './DropZone.svelte'
	import ImageList from './ImageList.svelte'

	let format = $state<Format>('WEBP')
	let quality = $state<number>(defaultQuality.WEBP)

	$effect(() => {
		quality = defaultQuality[format]
	})

	function onFile(file: File) {
		pool.enqueue(file, format, quality)
	}

	function onRemove(task: Task) {
		pool.clear(task.id)
	}

	function onClearAll() {
		pool.clearAll()
	}

	function onDownload(task: Task) {
		if (task.status === 'complete') {
			const link = document.createElement('a')
			link.href = URL.createObjectURL(task.result!)
			link.download = `${task.source.name.split('.')[0]}.${task.format.toLowerCase()}`
			link.click()
			URL.revokeObjectURL(link.href)
			link.parentNode?.removeChild(link)
		}
	}

	function onDownloadAll() {
		for (const task of pool.tasks) {
			onDownload(task)
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl px-4 py-12">
		<div class="mb-8 text-center">
			<div class="mb-4 flex items-center justify-center gap-2">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-8 w-8 text-blue-500"
					><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
						cx="9"
						cy="9"
						r="2"
					/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
				>
				<h1 class="text-3xl font-bold text-gray-900">Squash</h1>
			</div>
			<p class="text-gray-600">
				Compress and convert your images to AVIF, JPEG, JPEG XL, PNG, or WebP
			</p>
		</div>

		<div class="space-y-6">
			<CompressionOptions bind:format bind:quality />
			<DropZone {onFile} />

			{#if pool.completedCount}
				<DownloadAll {onDownloadAll} count={pool.completedCount} />
			{/if}

			<ImageList images={pool.tasks} {onDownload} {onRemove} />

			{#if pool.tasks.length}
				<button
					onclick={onClearAll}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-5 w-5"
						><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
							d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
						/><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg
					>
					Clear All
				</button>
			{/if}
		</div>
	</div>
</div>
