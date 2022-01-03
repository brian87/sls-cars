/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateCarRequest {
  maker: string
  purchaseDate: string
  model: string
  year: number
  purchased: boolean
}