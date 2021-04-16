export class WaitAnchorTimeoutException implements Error {
  name: string = 'WaitAnchorTimeoutException'
  message: string = 'Timeout exceeded while waiting for anchor'
  stack?: string | undefined
}
