import * as jose from 'jose'
import secp256k1 from 'secp256k1'
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
      const privateKey = Buffer.from(rawPrivateKey, 'hex');
      const publicKey = secp256k1.publicKeyCreate(privateKey, false);

      const josePrivateKey = await generateJWK(publicKey, privateKey)

      let unprotectedHeader = {
        kty: configData.config.KEY_TYPE_ALGORITHM,
        crv: configData.config.ELLIPTIC_CURVE_KEY,
        alg: configData.config.SIGNATURE_ALGORITHM,
        kid: Buffer.from(publicKey).toString('hex'),
        ...(headers ? headers : {})
      }

      const jws = await new jose.GeneralSign(Uint8Array.from(payload))
        .addSignature(josePrivateKey)
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
          let signingKey = Buffer.from(signature.header.kid, 'hex');
          let josePublicKey = await generateJWK(signingKey)

          let jws: jose.GeneralJWSInput = {
            payload: jose.base64url.encode(Uint8Array.from(payload)),
            signatures: [signature]
          }
          results.push(await jose.generalVerify(jws, josePublicKey))
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

async function generateJWK(publicKey: Uint8Array, privateKey?: Buffer): Promise<jose.KeyLike | Uint8Array> {
  const configData = new ConfigData()

  const x = Buffer.from(publicKey.slice(1, 33)).toString('base64url')
  const y = Buffer.from(publicKey.slice(33, 65)).toString('base64url')
  let params = null

  if (privateKey) {
    const d = privateKey.toString('base64url')
    params = {
      crv: configData.config.ELLIPTIC_CURVE_KEY,
      kty: configData.config.KEY_TYPE_ALGORITHM,
      d: d,
      x: x,
      y: y
    }
  } else {
    params = {
      crv: configData.config.ELLIPTIC_CURVE_KEY,
      kty: configData.config.KEY_TYPE_ALGORITHM,
      x: x,
      y: y
    }
  }

  const josePrivateKey = await jose.importJWK(params, configData.config.SIGNATURE_ALGORITHM)

  return josePrivateKey
}
