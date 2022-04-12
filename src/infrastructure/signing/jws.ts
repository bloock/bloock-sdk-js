import crypto from 'crypto'
import * as jose from 'jose'
import KeyEncoder from 'key-encoder'
import { injectable } from 'tsyringe'
import { ConfigData } from '../../config/repository/config-data'
import { TypedArray } from '../../shared/utils'
import { Headers, Signature, SigningClient, VerifyResult } from '../signing.client'

@injectable()
export class JWSClient implements SigningClient {
  async sign(
    payload: TypedArray,
    rawPrivateKey: string,
    headers?: { [name: string]: string }
  ): Promise<Signature> {
    const configData = new ConfigData()
    if (!rawPrivateKey) {
      return Promise.reject('undefined private key')
    }
    try {
      let privateKey = serializePrivateKey(rawPrivateKey)
      let publicKey = generatePublicKey(privateKey)

      let unprotectedHeader = {
        kty: configData.config.KEY_TYPE_ALGORITHM,
        crv: configData.config.ELLIPTIC_CURVE_KEY,
        alg: configData.config.SIGNATURE_ALGORITHM,
        kid: publicKey,
        ...(headers ? headers : {})
      }

      const encoder = new TextEncoder()
      const jws = await new jose.GeneralSign(Uint8Array.from(payload))
        .addSignature(privateKey)
        .setUnprotectedHeader(unprotectedHeader)
        .sign()

      let firstSignature = jws.signatures[0]
      if (firstSignature) {
        let signatureHeader = firstSignature.header
        if (signatureHeader) {
          let signature: string = firstSignature.signature
          let header: Headers = { ...signatureHeader }

          return { signature, header }
        }
      }
      return Promise.reject("couldn't generate signature")
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async verify(payload: TypedArray, ...signatures: Signature[]): Promise<VerifyResult[]> {
    try {
      let results: VerifyResult[] = []
      for (const signature of signatures) {
        if (signature.header.kid) {
          let publicKey = crypto.createPublicKey({ key: signature.header.kid })
          let jws: jose.GeneralJWSInput = {
            payload: jose.base64url.encode(Uint8Array.from(payload)),
            signatures: [signature]
          }
          results.push(await jose.generalVerify(jws, publicKey))
        } else {
          return Promise.reject('kid header not found')
        }
      }
      return results
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

function generatePublicKey(privateKey: crypto.KeyObject): string {
  let publicKeyObject = crypto.createPublicKey(privateKey)

  return publicKeyObject.export({ type: 'spki', format: 'pem' }).toString()
}
