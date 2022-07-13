export class Configuration {
  public HOST: string = ''
  public WAIT_MESSAGE_INTERVAL_FACTOR: number = 2
  public WAIT_MESSAGE_INTERVAL_DEFAULT: number = 1000
  public KEY_TYPE_ALGORITHM: string = 'EC'
  public ELLIPTIC_CURVE_KEY: string = 'secp256k1'
  public SIGNATURE_ALGORITHM: string = 'ES256K'
  public SECRET_KEY_ALGORITHM: string = 'A256KW'
  public ENCRYPTION_ALGORITHM: string = 'A256GCM'
  public KEY_SYNC_TYPE_ALGORITHM: string = 'oct'
}

export class NetworkConfiguration {
  public CONTRACT_ADDRESS: string = ''
  public CONTRACT_ABI: string = ''
  public HTTP_PROVIDER: string = ''
}
