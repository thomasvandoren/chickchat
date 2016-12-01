```
yarn
yarn start
```

Should get it running port 3001

There are 100ish messages in the db right now

All from me

Oh, and the create api is:

POST /message
{“text”: “blah” or null,
“data”: “data:….” or null
}

Technically both can be null b/c we’re super chill and don’t validate request bodies...
