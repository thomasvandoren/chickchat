import {getAuth0Secret} from "./kmsTools"
import {KJUR} from "jsrsasign"

export function auth0Info(token) {
    token = token.split(' ')[1];
    return new Promise((resolve, reject) => {
        getAuth0Secret().then((data) => {
            const secret = Buffer(data.Plaintext.toString(), 'base64').toString('hex');
            if (!KJUR.jws.JWS.verifyJWT(token, secret, {
                    alg: ["HS256"],
                    iss: 'https://bookvote.auth0.com/',
                    aud: "h10ZPFeTiOL21yeSQfubmoIchyTmmX8R",
                })) {
                reject('JWT Signature Invalid');
                return;
            }
            resolve(JSON.parse(new Buffer(token.split('.')[1], 'base64').toString()))
        }).catch((err) => {
            reject(err)
        })
    });
}
