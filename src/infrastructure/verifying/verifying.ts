import crypto from 'crypto';
import * as jose from 'jose';
import KeyEncoder from 'key-encoder';
import { injectable } from 'tsyringe';
import { Signature } from "../../record/entity/document/signature";
import { VerifyingClient } from '../verifying.client';

@injectable()
export class Verifying implements VerifyingClient {
  async JWSVerify(jws: Signature): Promise<void> {
    try {
      for (const sig of jws.signatures) {
        if (sig.header.kid) {
          let publicKey = serializePublicKey(sig.header.kid)

          await jose.generalVerify(jws, publicKey)
        }
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

function serializePublicKey(rawPublicKey: string): crypto.KeyObject {
  // ECDSA algorithm
  const keyEncoder: KeyEncoder = new KeyEncoder('secp256k1')

  // Encoding Public Keys as PEMs: format that stores an RSA public key
  // -----BEGIN PUBLIC KEY-----
  // -----END PUBLIC KEY-----
  const pemPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem')

  return crypto.createPublicKey({ key: pemPublicKey })
} 