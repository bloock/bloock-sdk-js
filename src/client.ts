import { container } from 'tsyringe'
import { Anchor } from './anchor/entity/anchor.entity'
import { AnchorService } from './anchor/service/anchor.service'
import { NetworkConfiguration } from './config/entity/configuration.entity'
import Network from './config/entity/networks.entity'
import { ConfigService } from './config/service/config.service'
import { HttpClient } from './infrastructure/http.client'
import { Proof } from './proof/entity/proof.entity'
import { ProofService } from './proof/service/proof.service'
import { RecordReceipt } from './record/entity/record-receipt.entity'
import { Record } from './record/entity/record.entity'
import { RecordService } from './record/service/record.service'
import { DependencyInjection } from './shared/dependency-injection'

/**
 * Entrypoint to the Bloock SDK:
 *    This SDK offers all the features available in the Bloock Toolset:
 *      * Write records
 *      * Get records proof
 *      * Validate proof
 *      * Get records details
 */
export class BloockClient {
  private anchorService: AnchorService
  private configService: ConfigService
  private recordService: RecordService
  private proofService: ProofService

  private httpClient: HttpClient

  /**
   * Constructor with API Key that enables accessing to Bloock's functionalities.
   * @param  {string} apiKey Client API Key.
   * @param  {ConfigEnv} [environment=ConfigEnv.PROD] Defines the Bloock's environment to use. By default: production.
   */
  constructor(apiKey: string) {
    DependencyInjection.setUp()

    this.anchorService = container.resolve<AnchorService>('AnchorService')
    this.configService = container.resolve<ConfigService>('ConfigService')
    this.recordService = container.resolve<RecordService>('RecordService')
    this.proofService = container.resolve<ProofService>('ProofService')

    this.httpClient = container.resolve<HttpClient>('HttpClient')

    this.httpClient.setApiKey(apiKey)
  }
  /**
   * Overrides the API host.
   * @param  {string} host The API host to apply
   * @returns {void}
   */
  public setApiHost(host: string): void {
    return this.configService.setApiHost(host)
  }
  /**
   * Overrides the Network configuration.
   * @param  {string} host The API host to apply
   * @returns {void}
   */
  public setNetworkConfiguration(network: Network, configuration: NetworkConfiguration): void {
    return this.configService.setNetworkConfiguration(network, configuration)
  }
  /**
   * Sends a list of Record to Bloock.
   * @param  {Record[]} records List of Record to send.
   * @returns {Promise<RecordReceipt[]>} List of RecordReceipt of each Record sent.
   * @throws {InvalidRecordException} At least one of the records sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async sendRecords(records: Record[]): Promise<RecordReceipt[]> {
    return this.recordService.sendRecords(records)
  }
  /**
   * Retrieves all RecordReceipt for the specified Anchor.
   * @param  {Record[]} records List of Record to fetch.
   * @returns {Promise<RecordReceipt[]>} List with the RecordReceipt of each record requested.
   * @throws {InvalidRecordException} At least one of the records sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async getRecords(records: Record[]): Promise<RecordReceipt[]> {
    return this.recordService.getRecords(records)
  }
  /**
   * Gets an specific anchor id details.
   * @param  {number} anchor Id of the Anchor to look for.
   * @returns {Promise<Anchor>} Anchor object matching the id.
   * @throws {InvalidArgumentException} Informs that the input is not a number.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async getAnchor(anchor: number): Promise<Anchor> {
    return this.anchorService.getAnchor(anchor)
  }
  /**
   * Waits until the anchor specified is confirmed in Bloock.
   * @param  {number} anchor Id of the Anchor to wait for.
   * @param  {number} [timeout=120000] Timeout time in miliseconds. After exceeding this time returns an exception.
   * @returns {Promise<Anchor>} Anchor object matching the id.
   * @throws {InvalidArgumentException} Informs that the input is not a number.
   * @throws {AnchorNotFoundException} The anchor provided could not be found.
   * @throws {WaitAnchorTimeoutException} Returned when the function has exceeded the timeout.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async waitAnchor(anchor: number, timeout?: number): Promise<Anchor> {
    return this.anchorService.waitAnchor(anchor, timeout)
  }
  /**
   * Retrieves an integrity Proof for the specified list of Record.
   * @param  {Record[]} records List of records to validate.
   * @returns {Promise<Proof>} The Proof object containing the elements necessary to verify
   *          the integrity of the records in the input list. If no record was requested, then returns None.
   * @throws {InvalidRecordException} At least one of the records sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async getProof(records: Record[]): Promise<Proof> {
    return this.proofService.retrieveProof(records)
  }

  /**
   * Validates if the root it's currently included in the blockchain.
   * @param {Record} root root to validate
   * @param {Network} network blockchain network where the record will be validated
   * @returns {Promise<number>} A number representing the timestamp in milliseconds when the anchor was registered in Blockchain
   * @throws {Web3Exception} Error connecting to blockchain.
   */
  public async validateRoot(root: Record, network: Network): Promise<number> {
    return this.proofService.validateRoot(root, network)
  }

  /**
   * Verifies if the specified integrity Proof is valid.
   * @param  {Proof} proof Proof to validate.
   * @returns {Promise<Record>} Record prepared to validate in Blockchain
   * @throws {ProofException} Error when verifying the proof
   */
  public async verifyProof(proof: Proof): Promise<Record> {
    return this.proofService.verifyProof(proof)
  }
  /**
   * It retrieves a proof for the specified list of Anchor using getProof and verifies it using verifyProof.
   * @param  {Record[]} records list of records to validate
   * @param  {Network} network OPTIONAL. Blockchain network where the records will be validated
   * @returns {Promise<number>} A number representing the timestamp in milliseconds when the anchor was registered in Blockchain
   * @throws {InvalidArgumentException} Informs that the input is not a number.
   * @throws {HttpRequestException} Error return by Bloock's API.
   * @throws {Web3Exception} Error connecting to blockchain.
   */
  public async verifyRecords(records: Record[], network?: Network): Promise<number> {
    return this.proofService.verifyRecords(records, network)
  }

  /**
   * Verifies if the specified integrity Proof is valid.
   * 
   * @param  {Proof} Proof to validate.
   * @return {Record} Integrity proof's root record.
   * @throws {ProofNotFoundException} Proof not found.
   */
  public async verifySignatures(records: Record[]): Promise<boolean> {
    return this.proofService.verifySignatures(records)
  }
}
