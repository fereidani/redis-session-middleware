# redis-session-middleware
Krakenjs/Expressjs express-session redis middleware

The "redis-session-middleware" is a middleware for Expressjs 4.x/Kraken 1.x to use express-session with redis compatibility .

### How to install :

make a directory in root of your application and call it middleware .
clone project in it .
go to directory and run npm install .

##### if you use Kraken :
1. open to config/config.json
2. replace old session part or add a following part to "middleware" key :
```
        "session": {
            "module": {
                "name": "../../../middleware/redis-session-middleware",
                "arguments": [
                    {
                        "secret":"hello world!!"
                    },
                    {
                        "db":10
                    },
                    {
                        "defaultError":"Redis Connection Timeout/Problem !"
                    }
                ]
            }
        }
```
3. edit config parammeters according to your needs as explained in next section.

##### if you use Express :

* use this code in your app with your discretion :
```
 var reddisSessionMiddleware=require('./middleware/redis-session-middleware/')(
                    {
                        "secret":"hello world!!"
                    },
                    {
                        "db":10
                    },
                    {
                        "defaultError":"Redis Connection Timeout/Problem !"
                    });
app.use(reddisSessionMiddleware);
```
** you can edit config arguments as explained in next section .


### Config Parameters :

* Please notice module will work fine with default install of redis and default config , but it's highly recommended to change at least "secret" value and personalise your config file .

1. first parameter is express-session settings
2. second parameter is connect-redis , it contains redis connection settings .
3. third parameter is private settings of redis-session-middleware


#### express-session settings :

**Note** session data is _not_ saved in the cookie itself, just the session ID.
Session data is stored server-side.

##### cookie

Settings for the session ID cookie. See the "Cookie options" section below for
more information on the different values.

The default value is `{ path: '/', httpOnly: true, secure: false, maxAge: null }`.

##### name

The name of the session ID cookie to set in the response (and read from in the
request).

The default value is `'skyport'`.

##### proxy

Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto"
header).

The default value is `undefined`.

  - `true` The "X-Forwarded-Proto" header will be used.
  - `false` All headers are ignored and the connection is considered secure only
    if there is a direct TLS/SSL connection.
  - `undefined` Use the "trust proxy" setting from express

##### resave

Forces the session to be saved back to the session store, even if the session
was never modified during the request. Depending on your store this may be
necessary, but it can also create race conditions where a client has two
parallel requests to your server and changes made to the session in one
request may get overwritten when the other request ends, even if it made no
changes (this behavior also depends on what store you're using).

The default value is `true`, but using the default has been deprecated,
as the default will change in the future. Please research into this setting
and choose what is appropriate to your use-case. Typically, you'll want
`false`.

##### rolling

Force a cookie to be set on every response. This resets the expiration date.

The default value is `false`.

##### saveUninitialized

Forces a session that is "uninitialized" to be saved to the store. A session is
uninitialized when it is new but not modified. Choosing `false` is useful for
implementing login sessions, reducing server storage usage, or complying with
laws that require permission before setting a cookie. Choose `false` will also
help with race conditions where a client makes multiple parallel requests
without a session.

The default value is `true`, but using the default has been deprecated, as the
default will change in the future. Please research into this setting and
choose what is appropriate to your use-case.

**Note** if you are using Session in conjunction with PassportJS, Passport
will add an empty Passport object to the session for use after a user is
authenticated, which will be treated as a modification to the session, causing
it to be saved.

##### secret

**Required option**

This is the secret used to sign the session ID cookie.

##### store

deprecated - you can't use it in this module .

##### unset

Control the result of unsetting `req.session` (through `delete`, setting to `null`,
etc.).

The default value is `'keep'`.

  - `'destroy'` The session will be destroyed (deleted) when the response ends.
  - `'keep'` The session in the store will be ketp, but modifications made during
    the request are ignored and not saved.

#### Cookie options

Please note that `secure: true` is a **recommended** option. However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
If `secure` is set, and you access your site over HTTP, the cookie will not be set. If you have your node.js behind a proxy and are using `secure: true`, you need to set "trust proxy" in express:

```js
var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
```

For using secure cookies in production, but allowing for testing in development, the following is an example of enabling this setup based on `NODE_ENV` in express:

```js
var app = express()
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
```

By default `cookie.maxAge` is `null`, meaning no "expires" parameter is set
so the cookie becomes a browser-session cookie. When the user closes the
browser the cookie (and session) will be removed.

#### connect-redis settings :

* You don't need to change these settings in many use cases .

  A Redis client is required.  An existing client can be passed directly using the `client` param or created for you using the `host`, `port`, or `socket` params.
  - `client` An existing client created using `redis.createClient()`
  - `host` Redis server hostname
  - `port` Redis server portno
  - `socket` Redis server unix_socket

The following additional params may be included:

  - `ttl` Redis session TTL (expiration) in seconds
  - `disableTTL` disables setting TTL, keys will stay in redis until evicted by other means (overides `ttl`)
  - `db` Database index to use
  - `pass` Password for Redis authentication
  - `prefix` Key prefix defaulting to "sess:"
  - `unref` Set `true` to unref the Redis client. **Warning**: this is [an experimental feature](https://github.com/mranney/node_redis#clientunref).


#### redis-session-middleware settings :

The following additional params may be included :
- `defaultError` : it's possible that redis connection failed sometimes because of any expected reason ( timeout , io problems and etc )
                   to avoid execution of user request without successfully receiving session data , this module throw a error in these cases .
                   this field define error message that will show/log when these cases happened .



### Usage sample :


```
app.get('/khashayar',function(req,res){
      req.session.name="khashayar";
      if(req.session.counter){
        req.session.counter++;
      }else{
        req.session.counter=1;
      }
      res.send("Current Counter Value Of Your Session is "+req.session.counter);
});
```

for better performance and readability it's adviced to use session like this :

```
var sess=req.session;
sess.name="khashayar";
```
