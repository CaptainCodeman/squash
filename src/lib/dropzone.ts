import { on } from 'svelte/events'

export function dropzone(node: HTMLElement, onDrop: (file: File) => void) {
	function handle(e: DragEvent) {
		e.stopPropagation()
		e.preventDefault()

		node.dataset.dragging = ''
		e.dataTransfer!.dropEffect = 'copy'
	}

	function dragEnter(e: DragEvent) {
		handle(e)

		node.dataset.dragging = ''
	}

	function dragLeave(e: DragEvent) {
		handle(e)

		delete node.dataset.dragging
	}

	function dragOver(e: DragEvent) {
		handle(e)

		node.dataset.dragging = ''
	}

	async function drop(e: DragEvent) {
		handle(e)

		delete node.dataset.dragging
		const dt = e.dataTransfer!

		for (const file of dt.files) {
			onDrop(file)
		}
	}

	const dragEnterOff = on(document, 'dragenter', dragEnter)
	const dragLeaveOff = on(document, 'dragleave', dragLeave)
	const dragOverOff = on(document, 'dragover', dragOver)
	const dropOff = on(document, 'drop', drop)

	return {
		destroy() {
			dragEnterOff()
			dragLeaveOff()
			dragOverOff()
			dropOff()
		}
	}
}
