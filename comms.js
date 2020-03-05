var blake2b = require('blake2b-wasm'); //Works in browsers that support WASM and Node.js 8+.
require('isomorphic-fetch');

module.exports = {
    send: async function (data) {
        let postmsg = {"hash" : data}; 
        let res = await fetch('https://enchainte-api.azurewebsites.net/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(postmsg)
        });
        if (res.ok) {
            let jres = await res.json();
            return (jres.hash == data);
        }
        else return false;
    },

    verify: async function (data) {
        let postmsg = {"hash" : data}; 
        let res = await fetch('https://enchainte-api.azurewebsites.net/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(postmsg)
        });
        if (res.ok) {
            let jres = await res.json();
            return jres.proof;
        }
        else throw "POST response = not OK";
    }
}
