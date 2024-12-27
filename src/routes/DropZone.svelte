<script lang="ts">
	import { dropzone } from '$lib'

	interface Props {
		onFile(file: File): void
	}

	let { onFile }: Props = $props()

	function oninput(e: Event) {
		const el = e.target as HTMLInputElement
		if (el.files) {
			for (let i = 0; i < el.files.length; i++) {
				const file = el.files[i]
				onFile(file)
			}
		}
	}
</script>

<div
	class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-blue-500"
	use:dropzone={onFile}
>
	<input type="file" id="fileInput" class="hidden" multiple accept="image/*,.jxl" {oninput} />
	<label for="fileInput" class="flex cursor-pointer flex-col items-center gap-4">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-12 w-12 text-gray-400"
			><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
				points="17 8 12 3 7 8"
			/><line x1="12" x2="12" y1="3" y2="15" /></svg
		>
		<div>
			<p class="text-lg font-medium text-gray-700">Drop images here or click to upload</p>
			<p class="text-sm text-gray-500">Supports JPEG, PNG, WebP, AVIF, and JXL</p>
		</div>
	</label>
</div>
