import {KMS} from "aws-sdk"

const auth0Secret = {
    // "KeyId": "arn:aws:kms:us-west-2:298206515678:key/2a9e8b54-4d17-443c-9ef1-2b6ce43f412d",
    "CiphertextBlob": Buffer("AQECAHhae99zvssV0Z+gn77B+Vi5dLqB1BoNh93meApKFBCITAAAAKIwgZ8GCSqGSIb3DQEHBqCBkTCBjgIBADCBiAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAxQi/DYu8pEaQ4soskCARCAWxdprWL78kWWkxRG4L7T8I0igxVhN3S/De2rjU9Oek0Zuu6aTVpzryFjCzpu5nVjAtTpXZosQ3UgteFLrMXdKYQ+14tU0K7Osw+RGfoHkeGTb4M5daldYWqPRZk=", 'base64')
};

const kms = new KMS();

export function getAuth0Secret() {
    return new Promise((resolve, reject) => {
        kms.decrypt(auth0Secret, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        })
    });
}
