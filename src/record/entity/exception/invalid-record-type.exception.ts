export class InvalidRecordTypeException implements Error {
  name: string = 'InvalidRecordTypeException'
  message: string = 'This function is not allowed for this Record type'
  stack?: string | undefined
}
