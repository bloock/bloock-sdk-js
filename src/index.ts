import 'reflect-metadata'
import { BloockClient } from './client'
import { NetworkConfiguration } from './config/entity/configuration.entity'
import Network from './config/entity/networks.entity'
import { Proof } from './proof/entity/proof.entity'
import { RecordReceipt } from './record/entity/record-receipt.entity'
import { Record } from './record/entity/record.entity'

export { BloockClient, Record, RecordReceipt, Proof, Network, NetworkConfiguration }
