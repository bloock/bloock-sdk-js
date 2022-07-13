import * as jose from 'jose';
import { ConfigData } from '../../config/repository/config-data';
import { TypedArray } from "../../shared/utils";
import { Encryption, EncryptionClient, Headers } from "../encryption.client";


export class JWEClient implements EncryptionClient {
  async encrypt(payload: TypedArray, rawSecretKey: string): Promise<Encryption> {
    const configData = new ConfigData()
    
    try {
      const secret = await importSecretKey(rawSecretKey)
      const jwe = await new jose.GeneralEncrypt(new Uint8Array(payload))
      .setProtectedHeader({ enc: configData.config.ENCRYPTION_ALGORITHM })
      .addRecipient(secret)
      .setUnprotectedHeader({ alg: configData.config.SECRET_KEY_ALGORITHM })
      .encrypt();
      
      let firstJWE = jwe.recipients[0]
      if (firstJWE) {
        let jweHeader = firstJWE.header
        if (jweHeader) {
          let ciphertext: string = jwe.ciphertext
          let iv: string = jwe.iv
          let protect: string | undefined = jwe.protected
          let tag: string = jwe.tag
          let encrypted_key: string | undefined = firstJWE.encrypted_key
          let header: Headers = { ...jweHeader }
          
          return { ciphertext, iv, tag, protect, encrypted_key, header }
        }
        
      }
      
      return Promise.reject("couldn't generate encryption") 
    } catch (error) {
      return Promise.reject(error)
    }

  }

  async decrypt(jwe: Encryption, rawSecretKey: string): Promise<TypedArray> {
    try {
      const secret = await importSecretKey(rawSecretKey)
      const jweInput = {
        ciphertext: jwe.ciphertext,
        iv: jwe.iv,
        tag: jwe.tag,
        protected: jwe.protect,
        recipients: [
          {
            encrypted_key: jwe.encrypted_key,
            header: jwe.header,
          },
        ],
      };

      const { plaintext, protectedHeader, additionalAuthenticatedData } =
        await jose.generalDecrypt(jweInput, secret);

      if (plaintext) {
        return Uint8Array.from(plaintext)
      }
      return Promise.reject("couldn't decrypt message") 
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async generateSecretKey(): Promise<string> {
    const configData = new ConfigData()

    const key = await jose.generateSecret(configData.config.SECRET_KEY_ALGORITHM)
    const exportedKey = await jose.exportJWK(key)
    const newSecretKey = exportedKey.k
    
    if (newSecretKey) {
      return newSecretKey
    }

    return Promise.reject("couldn't generate secret key")  
  }
}

async function importSecretKey(key: string): Promise<jose.KeyLike | Uint8Array> {
    const configData = new ConfigData()

    const encodedKey = jose.base64url.encode(key)
    const params = {
      kty: configData.config.KEY_SYNC_TYPE_ALGORITHM,
      k: key,
    }

    const secret = await jose.importJWK(params, configData.config.SECRET_KEY_ALGORITHM)

    return secret
}

  

