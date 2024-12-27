<script lang="ts">
	import { Format } from '$lib'

	interface Props {
		format: Format
		quality: number
	}

	let { format = $bindable(), quality = $bindable() }: Props = $props()
</script>

<div class="space-y-6 rounded-lg bg-white p-6 shadow-sm">
	<div>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="mb-2 block text-sm font-medium text-gray-700"> Output Format </label>
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
			{#each Format as f}
				<button
					class={`rounded-md px-4 py-2 text-sm font-medium uppercase ${
						f === format ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					}`}
					onclick={() => (format = f)}
				>
					{f}
				</button>
			{/each}
		</div>
	</div>

	{#if format !== 'PNG'}
		<div>
			<label for="quality" class="mb-2 block text-sm font-medium text-gray-700">
				Quality: {quality}%
			</label>
			<input id="quality" type="range" min="1" max="100" bind:value={quality} class="w-full" />
		</div>
	{/if}
</div>
