# Breaking change in 8.0.5 @nestjs/platform-express

This reposiory contains reproduction for breaking change how middlewares behave.

## Steps

```shell
# install dependencies
$ npm install

# run e2e tets - should be failing
$ npm run test:e2e

# checkout branch with last working version
$ git checkout last_working

# install dependencies
$ npm install

# run e2e tests - should pass
$ npm run test:e2e
```

## Possible issue

My hunch is this change:
https://github.com/nestjs/nest/blob/b5d8db6d14e0c8d666f444816ab99e0e169919d6/packages/platform-express/adapters/express-adapter.ts#L121-L125

## Logs output

### Working

```shel
> jest --config ./test/jest-e2e.json

  express:application set "x-powered-by" to true +0ms
  express:application set "etag" to 'weak' +1ms
  express:application set "etag fn" to [Function: generateETag] +0ms
  express:application set "env" to 'test' +1ms
  express:application set "query parser" to 'extended' +0ms
  express:application set "query parser fn" to [Function: parseExtendedQueryString] +0ms
  express:application set "subdomain offset" to 2 +0ms
  express:application set "trust proxy" to false +0ms
  express:application set "trust proxy fn" to [Function: trustNone] +1ms
  express:application booting in test mode +0ms
  express:application set "view" to [Function: View] +0ms
  express:application set "views" to '/Users/freaz/Workspaces/OpenSource/middleware-issue/views' +0ms
  express:application set "jsonp callback name" to 'callback' +0ms
  express:router use '/' query +3ms
  express:router:layer new '/' +0ms
  express:router use '/' expressInit +1ms
  express:router:layer new '/' +0ms
  express:router use '/' jsonParser +0ms
  express:router:layer new '/' +0ms
  express:router use '/' urlencodedParser +10ms
  express:router:layer new '/' +0ms
  express:router:route new '/example' +4ms
  express:router:layer new '/example' +0ms
  express:router:route get '/example' +0ms
  express:router:layer new '/' +0ms
  express:router:route new '/' +2ms
  express:router:layer new '/' +0ms
  express:router:route get '/' +1ms
  express:router:layer new '/' +0ms
  express:router:route new '/example' +0ms
  express:router:layer new '/example' +0ms
  express:router:route get '/example' +0ms
  express:router:layer new '/' +0ms
  express:router use '/' <anonymous> +1ms
  express:router:layer new '/' +1ms
  express:router use '/' <anonymous> +0ms
  express:router:layer new '/' +0ms
  superagent GET http://127.0.0.1:49524/example +0ms
  express:router dispatching GET /example +31ms
  express:router query  : /example +1ms
  express:router expressInit  : /example +1ms
  express:router jsonParser  : /example +0ms
  body-parser:json skip empty body +0ms
  express:router urlencodedParser  : /example +0ms
  body-parser:urlencoded skip empty body +1ms
  superagent GET http://127.0.0.1:49524/example -> 200 +40ms
 PASS  test/app.e2e-spec.ts (5.071 s)
  AppController (e2e)
    ✓ /example (GET) (448 ms)

  console.log
    req.path /example

      at MyMiddleware.use (../src/my.middleware.ts:8:13)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.337 s
Ran all test suites.
```

### Failing

Notice line: `express:router trim prefix (/example) from url /example +0ms`

```shell
> jest --config ./test/jest-e2e.json

  express:application set "x-powered-by" to true +0ms
  express:application set "etag" to 'weak' +1ms
  express:application set "etag fn" to [Function: generateETag] +0ms
  express:application set "env" to 'test' +1ms
  express:application set "query parser" to 'extended' +1ms
  express:application set "query parser fn" to [Function: parseExtendedQueryString] +0ms
  express:application set "subdomain offset" to 2 +0ms
  express:application set "trust proxy" to false +0ms
  express:application set "trust proxy fn" to [Function: trustNone] +1ms
  express:application booting in test mode +0ms
  express:application set "view" to [Function: View] +7ms
  express:application set "views" to '/Users/freaz/Workspaces/OpenSource/middleware-issue/views' +2ms
  express:application set "jsonp callback name" to 'callback' +0ms
  express:router use '/' query +2ms
  express:router:layer new '/' +0ms
  express:router use '/' expressInit +1ms
  express:router:layer new '/' +0ms
  express:router use '/' jsonParser +0ms
  express:router:layer new '/' +0ms
  express:router use '/' urlencodedParser +0ms
  express:router:layer new '/' +0ms
  express:router use '/example' <anonymous> +3ms
  express:router:layer new '/example' +0ms
  express:router:route new '/' +2ms
  express:router:layer new '/' +0ms
  express:router:route get '/' +0ms
  express:router:layer new '/' +0ms
  express:router:route new '/example' +0ms
  express:router:layer new '/example' +0ms
  express:router:route get '/example' +0ms
  express:router:layer new '/' +0ms
  express:router use '/' <anonymous> +1ms
  express:router:layer new '/' +1ms
  express:router use '/' <anonymous> +0ms
  express:router:layer new '/' +0ms
  superagent GET http://127.0.0.1:49538/example +0ms
  express:router dispatching GET /example +22ms
  express:router query  : /example +1ms
  express:router expressInit  : /example +0ms
  express:router jsonParser  : /example +0ms
  body-parser:json skip empty body +0ms
  express:router urlencodedParser  : /example +1ms
  body-parser:urlencoded skip empty body +0ms
  express:router trim prefix (/example) from url /example +0ms
  express:router <anonymous> /example : /example +0ms
  superagent GET http://127.0.0.1:49538/example -> 200 +33ms
 FAIL  test/app.e2e-spec.ts
  AppController (e2e)
    ✕ /example (GET) (269 ms)

  ● AppController (e2e) › /example (GET)

    expected '/example' response body, got '/'

      20 |       .get('/example')
      21 |       .expect(200)
    > 22 |       .expect('/example');
         |        ^
      23 |   });
      24 | });
      25 |

      at Object.<anonymous> (app.e2e-spec.ts:22:8)
      ----
      at error (../node_modules/supertest/lib/test.js:356:13)
      at Test.Object.<anonymous>.Test._assertBody (../node_modules/supertest/lib/test.js:254:14)
      at ../node_modules/supertest/lib/test.js:80:15
      at Test.Object.<anonymous>.Test._assertFunction (../node_modules/supertest/lib/test.js:338:11)
      at Test.Object.<anonymous>.Test.assert (../node_modules/supertest/lib/test.js:209:21)
      at Server.localAssert (../node_modules/supertest/lib/test.js:167:12)

  console.log
    req.path /

      at MyMiddleware.use (../src/my.middleware.ts:8:13)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.173 s, estimated 6 s
Ran all test suites.
```
