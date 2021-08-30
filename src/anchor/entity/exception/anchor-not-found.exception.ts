export class AnchorNotFoundException implements Error {
  name: string = 'AnchorNotFoundException'
  message: string = 'Anchor not found'
  stack?: string | undefined
}
