import { inject, injectable } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { Anchor } from '../entity/anchor.entity'
import { AnchorRetrieveResponse } from '../entity/dto/anchor-retrieve-response.entity'
import { AnchorRepository } from './anchor.repository'

@injectable()
export class AnchorRepositoryImpl implements AnchorRepository {
  constructor(
    @inject('HttpClient') private httpClient: HttpClient,
    @inject('ConfigService') private configService: ConfigService
  ) {}

  async getAnchor(anchor: number): Promise<Anchor> {
    let url = `${this.configService.getApiBaseUrl()}/core/anchor/${anchor}`
    let response = await this.httpClient.get<AnchorRetrieveResponse>(url)
    return new Anchor(
      response.id,
      response.block_roots,
      response.networks,
      response.root,
      response.status
    )
  }
}
