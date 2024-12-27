<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<svelte:head>
	<title>Image Squash</title>
	<meta
		name="description"
		content="Batch compress and convert your images to AVIF, JPEG, JPEG XL, PNG, or WebP"
	/>
</svelte:head>

{@render children()}
