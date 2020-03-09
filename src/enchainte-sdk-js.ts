import Hash from './hash';

export default class EnchainteSDK {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public write(hash: Hash) {
        return this.send(hash.getHash());
    }

    public getProof(hash: Hash) {
        return this.verify(hash.getHash());
    }

    private async send(data: string): Promise<boolean> {
        const postmsg = { "hash": data };
        const res = await fetch(`${this.url}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(postmsg)
        });
        if (res.ok) {
            const jres = await res.json();
            return (jres.hash === data);
        }
        else return false;
    }

    private async verify(data: string): Promise<string> {
        const postmsg = { "hash": data };
        const res = await fetch(`${this.url}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(postmsg)
        });
        if (res.ok) {
            const jres = await res.json();
            return jres.proof;
        }
        else throw new Error("Proof could not be generated");
    }
}