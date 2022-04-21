export class NoSignatureFoundExceptin implements Error {
  name: string = 'NoSignatureFoundExceptin'
  message: string = "Could not find any signature in the Record's metadata"
  stack?: string | undefined
}
