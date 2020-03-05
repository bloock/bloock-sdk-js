var blake2b = require('blake2b-wasm'); //Works in browsers that support WASM and Node.js 8+.
var comms = require('./comms.js');

var coreLib = {
    //input: json; output: string
    genHash: function (data) {
        let hashBlake;
        blake2b.ready(async function (err) {
            if (err) throw err
           
            hashBlake = blake2b()
                .update(Buffer.from(JSON.stringify(data)))
                .digest('hex');
        }).then(hashBlake);
        return hashBlake.toString();
    },
    //input: json; output: boolean
    write: async function (data) {
        let hashS = this.genHash(data);
        return await comms.send(hashS);
    },
    //input: json; output: string
    getProof: async function (data) {
        let hashS = this.genHash(data);
        return await comms.verify(hashS);
    }
}