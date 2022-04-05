import { TypedArray } from '../shared/utils'

export interface HashingClient {
  generateHash(data: TypedArray): string
}
