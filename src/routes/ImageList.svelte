<script lang="ts">
	import type { Task } from '$lib'

	interface Props {
		images: Task[]
		onDownload(task: Task): void
		onRemove(task: Task): void
	}

	let { images, onDownload, onRemove }: Props = $props()

	function formatFileSize(bytes: number) {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
	}

	function lazy(img: HTMLImageElement, url: string) {
		function loaded() {
			// URL.revokeObjectURL(url)
		}
		if (img.complete) {
			loaded()
		} else {
			img.onload = loaded
		}
	}
</script>

<div class="space-y-4">
	{#each images as image (image.id)}
		<div class="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
			{#if image.preview}
				<img
					src={image.preview}
					alt={image.source.name}
					class="h-16 w-16 rounded object-cover"
					use:lazy={image.preview}
				/>
			{/if}
			<div class="min-w-0 flex-1">
				<div class="flex items-center justify-between">
					<p class="truncate text-sm font-medium text-gray-900">
						{image.source.name}
					</p>
					<div class="flex items-center gap-2">
						{#if image.result}
							<button
								class="text-gray-400 hover:text-gray-600"
								title="Download"
								onclick={() => onDownload(image)}
								aria-label="Download"
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
									><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
										points="7 10 12 15 17 10"
									/><line x1="12" x2="12" y1="15" y2="3" /></svg
								>
							</button>
						{/if}
						<button
							class="text-gray-400 hover:text-gray-600"
							title="Remove"
							onclick={() => onRemove(image)}
							aria-label="Remove"
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
								class="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
							>
						</button>
					</div>
				</div>
				<div class="mt-1 flex items-center gap-2 text-sm text-gray-500">
					{#if image.status === 'pending'}
						<span>Ready to process</span>
					{/if}
					{#if image.status === 'processing'}
						<span class="flex items-center gap-2">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4 w-4 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg
							>
							Processing...
						</span>
					{/if}
					{#if image.status === 'complete'}
						<span class="flex items-center gap-2 text-green-600">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4 w-4"
								><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg
							>
							Complete
						</span>
					{/if}
					{#if image.status === 'error'}
						<span class="flex items-center gap-2 text-red-600">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4 w-4"
								><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line
									x1="12"
									x2="12.01"
									y1="16"
									y2="16"
								/></svg
							>
							{image.error || 'Error processing image'}
						</span>
					{/if}
				</div>
				<div class="mt-1 text-sm text-gray-500">
					{formatFileSize(image.source.size)}
					{#if image.result}
						→
						{formatFileSize(image.result.size)}
						<span class="text-green-600">
							({Math.round(((image.source.size - image.result.size) / image.source.size) * 100)}%
							smaller)
						</span>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
