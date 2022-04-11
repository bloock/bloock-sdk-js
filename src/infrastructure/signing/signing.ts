import crypto from 'crypto';
import * as jose from 'jose';
import KeyEncoder from 'key-encoder';
import { injectable } from 'tsyringe';
import { ConfigData } from '../../config/repository/config-data';
import { Headers, KeyPair, Signature } from '../../record/entity/document/signature/signature';
import { SigningClient } from '../signing.client';

@injectable()
export class Signing implements SigningClient {
  async JWSSign(rawKeyPair: KeyPair, payload: string, headers?: { [name: string]: string }): Promise<Signature> {
    const configData = new ConfigData()
    if (!rawKeyPair.privateKey) {
      return Promise.reject('undefined private key')
    }
    let privateKey = serializePrivateKey(rawKeyPair.privateKey)
    let unprotectedHeader = {
      kty: configData.config.KEY_TYPE_ALGORITHM,
      crv: configData.config.ELLIPTIC_CURVE_KEY,
      alg: configData.config.SIGNATURE_ALGORITHM,
      kid: rawKeyPair.publicKey,
      ...(headers ? headers : {})
    }
    try {
      const jws = await new jose.GeneralSign(
        new TextEncoder().encode(
          payload
        )
      )
        .addSignature(privateKey)
        .setUnprotectedHeader(unprotectedHeader)
        .sign()

      let firstSignature = jws.signatures[0]
      if (firstSignature) {
        let signatureHeader = firstSignature.header
        if (signatureHeader) {
          let signature: string = firstSignature.signature
          let header: Headers = { ...signatureHeader }

          let result: Signature = { payload: jws.payload, signatures: [{ signature: signature, header }] }
          return result
        }
      }
      return Promise.reject("couldn't generate signature")

    } catch (error) {
      return Promise.reject(error)
    }
  }
}

function serializePrivateKey(rawPrivateKey: string): crypto.KeyObject {
  // ECDSA algorithm
  const keyEncoder: KeyEncoder = new KeyEncoder('secp256k1')

  // Encoding Private Keys as PEMs: format that stores an RSA private key
  // -----BEGIN EC PRIVATE KEY-----
  // -----END EC PRIVATE KEY-----
  const pemPrivateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'pem')

  return crypto.createPrivateKey({ key: pemPrivateKey })
} 
