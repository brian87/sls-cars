/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateCarRequest {
  name: string
  dueDate: string
  marker: string
  year: number
  model: string
}
