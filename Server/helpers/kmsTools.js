import {KMS} from "aws-sdk"

const auth0Secret = {
    "CiphertextBlob": Buffer("AQECAHg2JpjKdNCumSgN2xQLw3T5OOS6lVjvxC9t4PJoCGVubgAAAKIwgZ8GCSqGSIb3DQEHBqCBkTCBjgIBADCBiAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAz8tb6vogF9Dek2lpACARCAW3DTXvwcfOMrBkBT/AJOjJ1sxSSKHKxCMNG5VFfKGTzzKqluxKT3HNBRjhIik7CME/rYGZk6//4za+fs0zX9qSmiCFVO8yWE9vmfY2MPe3qZOqI5QBfZSKMAOY0=", 'base64')
};

const kms = new KMS({
  region: 'us-west-2'
});

export function getAuth0Secret() {
    return new Promise((resolve, reject) => {
        kms.decrypt(auth0Secret, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Plaintext.toString())
            }
        })
    });
}
