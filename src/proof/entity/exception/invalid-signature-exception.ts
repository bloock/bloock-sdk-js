export class InvalidSignatureException implements Error {
  name: string = 'InvalidSignatureException'
  message: string = 'Invalid signature provided'
  stack?: string | undefined
}