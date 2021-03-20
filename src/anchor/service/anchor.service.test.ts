import { container } from 'tsyringe';
import { MockProxy, mock } from 'jest-mock-extended';

import { ConfigService } from '../../config/service/config.service';
import { HttpClient} from '../../infrastructure/http.client';
import { AnchorRepository } from '../repository/anchor.repository';
import { AnchorServiceImpl } from './anchor-impl.service';
import { AnchorRetrieveResponse } from '../entity/dto/anchor-retrieve-response.entity';
import { AnchorService } from './anchor.service';
import { Anchor } from '../entity/anchor.entity';
import { ConfigRepository } from '../../config/repository/config.repository';
import { Configuration } from '../../config/entity/configuration.entity';

describe('Anchor Service Tests', () => {

    let configRepositoryMock: MockProxy<ConfigRepository>;
    let httpClientMock: MockProxy<HttpClient>;
    let anchorRepositoryMock: MockProxy<AnchorRepository>;

    beforeEach(() => {
        configRepositoryMock = mock<ConfigRepository>();
        httpClientMock = mock<HttpClient>();
        anchorRepositoryMock = mock<AnchorRepository>();

        container.registerInstance("ConfigRepository", configRepositoryMock);
        container.registerInstance("HttpClient", httpClientMock);
        container.registerInstance("AnchorRepository", anchorRepositoryMock);
        container.register("AnchorService", {
            useClass: AnchorServiceImpl
        });
    });

    it('should get anchor', async () => {
        let anchor = 1;
        let apiResponse = new AnchorRetrieveResponse({
            anchor_id: anchor,
            block_roots: [],
            networks: [],
            root: "root",
            status: "Pending"
        });
        let expectedResult = new Anchor(anchor, [], [], "root", "Pending");

        anchorRepositoryMock.getAnchor
            .calledWith(anchor).mockResolvedValue(apiResponse);
            
        let anchorService = container.resolve<AnchorService>("AnchorService");
        let result = await anchorService.getAnchor(anchor);

        expect(result).toMatchObject(expectedResult)
    });

    it('should wait anchor', async () => {
        let anchor = 1;
        let apiResponse = [
            new AnchorRetrieveResponse({
                anchor_id: anchor,
                block_roots: [],
                networks: [],
                root: "root",
                status: "Pending"
            }),
            new AnchorRetrieveResponse({
                anchor_id: anchor,
                block_roots: [],
                networks: [],
                root: "root",
                status: "Success"
            })
        ];
        let expectedResult = new Anchor(anchor, [], [], "root", "Success");

        let config = new Configuration();
        config.WAIT_MESSAGE_INTERVAL_DEFAULT = 1;
        config.WAIT_MESSAGE_INTERVAL_FACTOR = 1;

        configRepositoryMock.getConfiguration
            .calledWith()
            .mockReturnValue(config);

        anchorRepositoryMock.getAnchor
            .calledWith(anchor)
            .mockResolvedValueOnce(apiResponse[0])
            .mockResolvedValueOnce(apiResponse[1]);
            
        let anchorService = container.resolve<AnchorService>("AnchorService");
        let result = await anchorService.waitAnchor(anchor);

        expect(result).toMatchObject(expectedResult)
    });
});
