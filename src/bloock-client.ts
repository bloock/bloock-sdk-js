import { container } from 'tsyringe'
import { Anchor } from './anchor/entity/anchor.entity'
import { AnchorService } from './anchor/service/anchor.service'
import { ConfigEnv } from './config/entity/config-env.entity'
import { ConfigService } from './config/service/config.service'
import { HttpClient } from './infrastructure/http.client'
import { MessageReceipt } from './message/entity/message-receipt.entity'
import { Message } from './message/entity/message.entity'
import { MessageService } from './message/service/message.service'
import { Proof } from './proof/entity/proof.entity'
import { ProofService } from './proof/service/proof.service'
import { DependencyInjection } from './shared/dependency-injection'

/**
 * Entry-point to the Bloock SDK:
 *    This SDK offers all the features available in the Bloock Toolset:
 *      * Write messages
 *      * Get messages proof
 *      * Validate proof
 *      * Get messages details
 */
export class BloockClient {
  private anchorService: AnchorService
  private configService: ConfigService
  private messageService: MessageService
  private proofService: ProofService

  private httpClient: HttpClient

  /**
   * Constructor with API Key that enables accessing to Bloock's functionalities.
   * @param  {string} apiKey Client API Key.
   * @param  {ConfigEnv} [environment=ConfigEnv.PROD] Defines the Bloock's environment to use. By default: production.
   */
  constructor(apiKey: string, environment: ConfigEnv = ConfigEnv.PROD) {
    DependencyInjection.setUp()

    this.anchorService = container.resolve<AnchorService>('AnchorService')
    this.configService = container.resolve<ConfigService>('ConfigService')
    this.messageService = container.resolve<MessageService>('MessageService')
    this.proofService = container.resolve<ProofService>('ProofService')

    this.httpClient = container.resolve<HttpClient>('HttpClient')

    this.httpClient.setApiKey(apiKey)
    this.configService.setupEnvironment(environment)
  }
  /**
   * Sends a list of Message to Bloock.
   * @param  {Message[]} messages List of Message to send.
   * @returns {Promise<MessageReceipt[]>} List of MessageReceipt of each Message sent.
   * @throws {InvalidMessageException} At least one of the messages sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async sendMessages(messages: Message[]): Promise<MessageReceipt[]> {
    return this.messageService.sendMessages(messages)
  }
  /**
   * Retrieves all MessageReceipt for the specified Anchor.
   * @param  {Message[]} messages List of Message to fetch.
   * @returns {Promise<MessageReceipt[]>} List with the MessageReceipt of each message requested.
   * @throws {InvalidMessageException} At least one of the messages sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async getMessages(messages: Message[]): Promise<MessageReceipt[]> {
    return this.messageService.getMessages(messages)
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
   * Retrieves an integrity Proof for the specified list of Message.
   * @param  {Message[]} messages List of messages to validate.
   * @returns {Promise<Proof>} The Proof object containing the elements necessary to verify
   *          the integrity of the messages in the input list. If no message was requested, then returns None.
   * @throws {InvalidMessageException} At least one of the messages sent was not well formed.
   * @throws {HttpRequestException} Error return by Bloock's API.
   */
  public async getProof(messages: Message[]): Promise<Proof> {
    return this.proofService.retrieveProof(messages)
  }
  /**
   * Verifies if the specified integrity Proof is valid and checks if it's currently included in the blockchain.
   * @param  {Proof} proof Proof to validate.
   * @returns {Promise<number>} A number representing the timestamp in milliseconds when the anchor was registered in Blockchain
   * @throws {Web3Exception} Error connecting to blockchain.
   */
  public async verifyProof(proof: Proof): Promise<number> {
    return this.proofService.verifyProof(proof)
  }
  /**
   * It retrieves a proof for the specified list of Anchor using getProof and verifies it using verifyProof.
   * @param  {Message[]} messages list of messages to validate
   * @returns {Promise<number>} A number representing the timestamp in milliseconds when the anchor was registered in Blockchain
   * @throws {InvalidArgumentException} Informs that the input is not a number.
   * @throws {HttpRequestException} Error return by Bloock's API.
   * @throws {Web3Exception} Error connecting to blockchain.
   */
  public async verifyMessages(messages: Message[]): Promise<number> {
    return this.proofService.verifyMessages(messages)
  }
}
