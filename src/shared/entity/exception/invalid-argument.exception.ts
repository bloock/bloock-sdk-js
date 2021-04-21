export class InvalidArgumentException implements Error {
  name: string = 'InvalidArgumentException'
  message: string = 'Invalid argument provided'
  stack?: string | undefined
}
