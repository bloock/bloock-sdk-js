
export class EncryptData {
    public ciphertext: string;
    public iv: string;
    public tag: string;
    public protect?: string;
    public encrypted_key?: string;
    public header?: Headers

    constructor(
        ciphertext: string,
        iv: string,
        tag: string,
        protect?: string,
        encrypted_key?: string,
        header?: Headers
    ) {
        this.ciphertext = ciphertext;
        this.iv = iv;
        this.tag = tag;
        this.protect = protect;
        this.encrypted_key = encrypted_key;
        this.header = header
    }
}

type Headers = {
  alg?: string
  [propName: string]: unknown
}