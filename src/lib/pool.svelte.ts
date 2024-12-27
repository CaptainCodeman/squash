import type { Format } from './format'
// import Worker from './worker?worker'

export interface Task {
	id: number
	source: File
	format: Format
	quality: number
	result?: Blob
	preview?: string
	ms?: number
	error?: any
	status: 'pending' | 'processing' | 'complete' | 'error'
}

class Pool {
	private last_id = 0
	private workers = $state<WorkerThread[]>([])

	private pending = $state<Task[]>([])
	private processing = $state<Task[]>([])
	private completed = $state<Task[]>([])

	tasks = $derived(
		[...this.completed, ...this.processing, ...this.pending].toSorted((a, b) => a.id - b.id)
	)

	completedCount = $derived(this.completed.length)

	constructor(size: number) {
		for (let i = 0; i < size; i++) {
			this.workers.push(new WorkerThread(this))
		}
	}

	enqueue(source: File, format: Format, quality: number) {
		this.last_id++
		const id = this.last_id
		const task: Task = { id, source, format, quality, status: 'pending' }
		const worker = this.workers.shift()
		if (worker) {
			task.status = 'processing'
			this.processing.push(task)
			worker.process(task)
		} else {
			this.pending.push(task)
		}
	}

	async preview(worker: WorkerThread, preview: Blob) {
		const task = this.processing.find((task) => task.id === worker.task_id)
		if (task) {
			const url = await URL.createObjectURL(preview)
			task.preview = url
		}
	}

	async result(worker: WorkerThread, result: Blob, ms: number) {
		const task = this.processing.find((task) => task.id === worker.task_id)
		if (task) {
			task.status = 'complete'
			task.result = result
			task.ms = ms
			this.processing = this.processing.filter((task) => task.id !== worker.task_id)
			this.completed.push(task)
		}

		const next = this.pending.shift()
		if (next) {
			next.status = 'processing'
			this.processing.push(next)
			worker.process(next)
		} else {
			this.workers.push(worker)
		}
	}

	error(worker: WorkerThread, error: any) {
		const task = this.processing.find((task) => task.id === worker.task_id)
		if (task) {
			task.status = 'error'
			task.error = error
			this.processing = this.processing.filter((task) => task.id !== worker.task_id)
			this.completed.push(task)
		}

		const next = this.pending.shift()
		if (next) {
			next.status = 'processing'
			this.processing.push(next)
			worker.process(next)
		} else {
			this.workers.push(worker)
		}
	}

	clear(task_id: number) {
		this.pending = this.pending.filter((task) => task.id !== task_id)
		this.processing = this.processing.filter((task) => task.id !== task_id)
		this.completed = this.completed.filter((task) => task.id !== task_id)
	}

	clearAll() {
		this.pending = []
		this.processing = []
		this.completed = []
	}
}

class WorkerThread {
	task_id = 0

	private started = 0
	private worker: Worker

	constructor(private readonly pool: Pool) {
		this.worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
		this.worker.addEventListener('message', this.callback.bind(this))
	}

	async process(task: Task) {
		this.task_id = task.id
		this.started = performance.now()
		const { format, quality } = task
		const source = await task.source.arrayBuffer()
		this.worker.postMessage({ source, format, quality }, [source])
	}

	callback(event: MessageEvent<{ thumb: ArrayBuffer } & { buffer: ArrayBuffer; type: string } & { error: any }>) {
		const ms = performance.now() - this.started
		const { thumb, buffer, type, error } = event.data
		if (error) {
			this.pool.error(this, error)
		} else if (thumb) {
			const preview = new Blob([thumb], { type: 'image/jpeg' })
			this.pool.preview(this, preview)
		} else {
			const result = new Blob([buffer], { type })
			this.pool.result(this, result, ms)
		}
	}

	terminate() {
		this.worker.terminate()
	}
}

export const pool = new Pool(2)
