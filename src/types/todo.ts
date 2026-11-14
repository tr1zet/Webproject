export interface TodoTask {
  id: string
  userId: string
  title: string
  done: boolean
}

export interface TaskSavePayload {
  id: string | null
  title: string
}

export interface TaskModalHandle {
  open: (task?: TodoTask | null, trigger?: Element | null) => void
}
