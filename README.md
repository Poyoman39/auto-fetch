# autoapi

Autoapi provides a [Proxy](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) generating fetch requests based on method names.

## Quick start

```
npm i autoapi
```
```
const createAutoApi = require('autoapi');

// ...

const api = createAutoApi({
  baseUrl: 'https://example.org',
  headers: { /* some default headers */ },
});

api.users.get(); // GET https://example.org/users
api.user.jamy.setPreferences.post(); // POST https://example.org/user/jamy/setPreferences
api.user.jamy.setPreferences(); // POST is default request method => POST https://example.org/user/jamy/setPreferences
```

## Doc

---
### createAutoApi(options)
Create a new autoapi

 - **options.baseUrl** *(required)* ***string***: Base url of future requests
 - **options.headers** *(default: null)* ***object***: default headers of future requests

---
### autoapi.some.path.method()
You can put as much url segments before calling the function.

method can be any REST method (get, post, put, patch, delete)