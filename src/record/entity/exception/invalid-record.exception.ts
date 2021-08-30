export class InvalidRecordException implements Error {
  name: string = 'InvalidRecordException'
  message: string = 'Record not valid'
  stack?: string | undefined
}
