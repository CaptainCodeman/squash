<script lang="ts">
	interface Props {
		count: number
		onDownloadAll(): void
	}

	let { count, onDownloadAll }: Props = $props()
</script>

<button
	onclick={onDownloadAll}
	class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
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
	Download All ({count}
	{count === 1 ? 'image' : 'images'})
</button>
