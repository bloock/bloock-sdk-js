import { inject, injectable } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { InvalidArgumentException } from '../../shared/entity/exception/invalid-argument.exception'
import { sleep } from '../../shared/utils'
import { Anchor } from '../entity/anchor.entity'
import { AnchorNotFoundException } from '../entity/exception/anchor-not-found.exception'
import { WaitAnchorTimeoutException } from '../entity/exception/timeout.exception'
import { AnchorRepository } from '../repository/anchor.repository'
import { AnchorService } from './anchor.service'

@injectable()
export class AnchorServiceImpl implements AnchorService {
  constructor(
    @inject('AnchorRepository') private anchorRepository: AnchorRepository,
    @inject('ConfigService') private configService: ConfigService
  ) {}

  async getAnchor(anchorId: number): Promise<Anchor> {
    if (!Number.isInteger(anchorId)) {
      throw new InvalidArgumentException()
    }

    let anchor = await this.anchorRepository.getAnchor(anchorId)

    if (anchor == null) {
      throw new AnchorNotFoundException()
    }

    return anchor
  }
  async waitAnchor(anchorId: number, timeout: number = 300000): Promise<Anchor> {
    if (!Number.isInteger(anchorId) || !Number.isInteger(timeout)) {
      throw new InvalidArgumentException()
    }

    let attempts = 0
    let anchor = null
    let start = new Date().getTime()
    let nextTry = start + this.configService.getConfiguration().WAIT_MESSAGE_INTERVAL_DEFAULT
    let timeoutTime = start + timeout
    while (true) {
      try {
        anchor = await this.anchorRepository.getAnchor(anchorId)
        if (anchor.status == 'Success') {
          return anchor
        }
        let currentTime = new Date().getTime()

        if (currentTime > timeoutTime) {
          throw new WaitAnchorTimeoutException()
        }
        await sleep(10000)
      } catch (e) {
        let currentTime = new Date().getTime()
        while (currentTime < nextTry && currentTime < timeoutTime) {
          await sleep(200)
          currentTime = new Date().getTime()
        }
        nextTry +=
          attempts * this.configService.getConfiguration().WAIT_MESSAGE_INTERVAL_FACTOR +
          this.configService.getConfiguration().WAIT_MESSAGE_INTERVAL_DEFAULT

        attempts += 1

        if (currentTime >= timeoutTime) {
          throw new WaitAnchorTimeoutException()
        }
      }
    }
  }
}
