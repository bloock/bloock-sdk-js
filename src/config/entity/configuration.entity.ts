export class Configuration {
  public HOST: string = ''
  public WAIT_MESSAGE_INTERVAL_FACTOR: number = 2
  public WAIT_MESSAGE_INTERVAL_DEFAULT: number = 1000
}

export class NetworkConfiguration {
  public CONTRACT_ADDRESS: string = ''
  public CONTRACT_ABI: string = ''
  public HTTP_PROVIDER: string = ''
}
