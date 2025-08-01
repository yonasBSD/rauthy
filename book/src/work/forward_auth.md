# Forward Authentication

If you want to secure applications running behind a reverse proxy that do not have authn / authz on their own in terms
of being able to use OIDC flows or similar with them, you can use something like the [Traefik](https://traefik.io/)
middleware [ForwardAuth](https://doc.traefik.io/traefik/middlewares/http/forwardauth/), or Nginx `auth_request`. Other
proxies support this as well.

Incoming requests can be intercepted and forwarded to Rauthy first. It will check for a valid `Bearer` token in the
`Authorization` header. If it is valid, Rauthy will return an `HTTP 200 Ok` and will append additional headers with
information about the user to the request. These headers could easily be read by a downstream application.

The forward auth request can optionally add forward auth headers upon success. These will provide information about the
logged-in user to downstream applications. If your client app cannot make use of them, leaving them disabled is the best
idea. This is also the default, because they can leak information, if you do not set up your internal environment
carefully. You can enable the feature with

```toml
[auth_headers]
# You can enable authn/authz headers which would be added to the
# response of the `/auth/v1/oidc/forward_auth` endpoint. When set to
# `true`, the headers below will be added to authenticated requests.
# These could be used on legacy downstream applications, that don't
# support OIDC on their own.
#
# However, be careful when using this, since this kind of authn/authz
# has a lot of pitfalls out of the scope of Rauthy.
#
# default: false
# overwritten by: AUTH_HEADERS_ENABLE
enable = false
```

You can also change the header names containing the information, if you need to support some older application that
needs special naming for them:

```toml
[auth_headers]
# Configure the header names being used for the different values. You
# can change them to your needs, if you cannot easily change your
# downstream apps.
#
# default: x-forwarded-user
# overwritten by: AUTH_HEADER_USER
user = 'x-forwarded-user'
# default: x-forwarded-user-roles
# overwritten by: AUTH_HEADER_ROLES
roles = 'x-forwarded-user-roles'
# default: x-forwarded-user-groups
# overwritten by: AUTH_HEADER_GROUPS
groups = 'x-forwarded-user-groups'
# default: x-forwarded-user-email
# overwritten by: AUTH_HEADER_EMAIL
email = 'x-forwarded-user-email'
# default: x-forwarded-user-email-verified
# overwritten by: AUTH_HEADER_EMAIL_VERIFIED
email_verified = 'x-forwarded-user-email-verified'
# default: x-forwarded-user-family-name
# overwritten by: AUTH_HEADER_FAMILY_NAME
family_name = 'x-forwarded-user-family-name'
# default: x-forwarded-user-given-name
# overwritten by: AUTH_HEADER_GIVEN_NAME
given_name = 'x-forwarded-user-given-name'
# default: x-forwarded-user-mfa
# overwritten by: AUTH_HEADER_MFA
mfa = 'x-forwarded-user-mfa'
```

```admonish caution
This feature makes it really easy for any application behind your reverse proxy to serve protected resources, but you
really only use it, if you cannot use a proper OIDC client or something like that. 

Rauthy tries to catch as many config errors as possible, but a lot of issues can happen outside of its scope. Forward 
Auth has many pitfalls and you need to be very careful with your whole setup when using it. If you only have a tiny
configuration error in your reverse proxy or your whole environment, it's easily possible that all your security is gone
immediately. For instance, configuring the HTTP method forwarded to Rauthy wrongly could disable all CSRF checks, or if
there is a loopwhole in your setup and it's possible for someone to access your client app avoiding your reverse proxy,
it would be the same as if there was not forward auth at all.
 
A direct token validation inside your downstream application via **a native OIDC client should ALWAYS be preferred!** 
Use Forward Auth only as a last resort!
```

## Different Types

Rauthy provides 2 different types of Forward Auth. The first one is very basic and simple and in 99.9% of cases not
what you want. The second one is way more advances, but requires a more complicated setup.

## Simple Forward Auth

The simple Forward Auth expects a valid JWT token created by Rauthy in the `Authorization` header. That's it. This type
of Forward Auth exists mostly for compatibility reasons and is not what you want most of the time. It can work with
Traefik's middleware for instance, but you need to have some way to provide a JWT token, which usually requires manual
work or changing something about the client. The endpoint for this simple forward auth is:

```
/auth/v1/oidc/forward_auth
```

## Advanced Forward Auth

This second type is way more involved, but also a more secure. You need a more complicated reverse proxy setup, but if
Forward Auth is the only way for you to secure a legacy app, always use this type!

This book currently has examples for Traefik and nginx. If anyone wants to provide configuration examples for other
proxies, feel free to submit a PR.

### tl;dr

- Have a reverse proxy in front of the application you want to protect, like e.g. Traefik or nginx
- Make sure it's impossible(!) to access the client app by skipping the reverse proxy, e.g. with network policies,
  internal networks, or something like that.
- Find an unsued route on your client app, where you can inject Rauthys `/callback`. You will probably be fine with
  something like `/oidc/rauthy/callback`. The name does not matter, it just must not be used by the app already.
- Inject Rauthy special `/callback` endpoint into your client app with the help of your reverse proxy. This is a step
  that most other IdP's skip for a less secure setup. Rauthy does not let you skip this.
- Configure your reverse proxy properly, so it forwards each single request to your client app, or the routes that
  should be protected, to Rauthy, so that all requests are being validated.
- Have a Client configured on Rauthy with the following settings:
    - must have at least one allowed origin configured that matches the origin of the location where it will be injected
      into
    - the first configured `redirect_uri` must be absolute (not end with a wildcard *) - the redirect to the `/callback`
      will be created from the first allowed `redirect_uri` automatically to have another safety hook and prevent misuse
      on proxy level
    - must not have PKCE enabled, because it's an unnecessary overhead when Rauthy does a request against "itself"

### How it works

To make it work, you will have 2 endpoints:

- `/auth/v1/clients/{id}/forward_auth`
- `/auth/v1/clients/{id}/forward_auth/callback`

The `/auth/v1/clients/{id}/forward_auth` is used to process the auth requests. It reads a few different headers that are
injected by the proxy:

- `X-Forwarded-For` or `X-Real-Ip`
- `X-Forwarded-Proto`
- `X-Forwarded-Host`
- `X-Forwarded-Method`
- `X-Forwarded-URI` or `X-Original-URL`

The additional `X-Original-URL` is a duplicate and only exists because it's mentioned in many guides. However, Rauthy
accepts either `X-Forwarded-URI` or `X-Original-URL` and checks both of them to provide more compatibility. You can
provide any of them.

The `X-Forwarded-Proto` and `X-Forwarded-Host` will be merged into the final `Origin`, that would be provided by the
browser if it was a direct request. This is then matched against the `allowed_origin`s configuration for the client to
have an additional safety hook in case of proxy misconfiguration or exposing the wrong forward auth on the wrong route.
Depending on `X-Forwarded-Method`, Rauthy will do an additional CSRF check. It does 2 of them:

- Check the additional `strict` cookie and match the included, encrypted CSRF token value to the one from the also
  encrypted session cookie
- Make sure that the `sec-fetch-site` is either `none` or `same-origin`

Usually, one of the methods would already be sufficient. Checking both of them is an additional defense in depth. If you
use a somewhat up-to-date browser, this will secure you against CSRF.

Unlike the simple `forward_auth` above, this endpoint checks for an encrypted session cookie. This is much more secure,
but requires more setup. The session will be bound to the already running Rauthy session, so you can revoke it any time.

The forward auth headers will only be added, if they are enabled. The endpoint works just fine with them being disabled.
It will then only authenticate the request and you can skip parsing and forwarding all those response headers to the
client, which will make the config way smaller.

The `danger_cookie_insecure` param will make the cookie insecure for local testing. This makes it possible to test via
plain HTTP, which you of course should never set in prod. You have a second param `redirect_state` you can provide to
change the status code, if no session could be found. By default, it returns a `401`, which is why nginx in that case
extracts the `location` header and returns it to the user, which will redirect to the `/authorize` page. Traefik however
would need a `302` here. The request params allow you to adjust the behavior depending on your reverse proxy.

To make all of this work with secure cookies, (Rauthy sets `__Host-*` cookies for max security (without the
`danger_cookie_insecure`), you need to inject the callback URI into your client app with the reverse proxy.

The callback endpoint needs the following headers being forwarded:

- `X-Forwarded-For` or `X-Real-Ip`
- `X-Forwarded-Proto`
- `X-Forwarded-Host`

It will then, depending on the also encrypted `state` param from the `/authorize`, create new session cookies for that
injected domain which will be bound to the original Rauthy session created during the login. Afterward, it will
redirect to the original URI of the request before the forward auth failed for best UX `X-Original-URI` /
`X-Forwarded-URI`.

Rauthy will very strictly check and compare all headers against the configured client. It does not extract headers
dynamically to "just use them", to avoid issues like for instance re-using the wrong Forward Auth in an unintended
location, because reverse proxy configs can become very complex pretty quickly. Forwarding these headers (mentioned
below) is absolutely crucial for the security of this setup!

```admonish hint
If you end up in an infinite redirect loop later on, you most probably have an issue with your Cookies not being set
correctly. This can happen for instance, when you are testing in an insecure environment, but having not told Rauthy
to create insecure cookies, so they would get rejected by the browser on the `/callback` endpoint.
```

```admonish note
Both example configs for reverse proxies down below re-use Rauthy's own `/auth/v1/whoami` route for demonstration, 
instead of a separate client app. This endpoint helps you debugging your setup, if you have issues with headers maybe.
You can enable `access.whoami_headers = true` to make it also return all found headers.

The setup works in the exact same way though for a separate client application.
```

### Why is this secure?

The cookies are (by default) `__Host-*` cookies with all the necessary, hardened cookie settings. The session cookie is
`same-site: lax` to make routing possible and the additional CSRF check cookie is `same-site: strict`.

To harden these cookies that much, the `/callback` must be injected into the exact same domain / host as the client app.
This means you need to find a route that does not overlap. Probably something like `/callback` or `/oidc/callback`
should always be unused, when you client app does not support any of these mechanisms in the first place. You could also
do something very unlikely overlapping things like `/oidc/rauthy/fwd_auth/callback` or whatever makes sense in your
case. This does not matter, only the host, so the browser sets the cookie correctly.

### Prerequisites

1. have your reverse proxy in place
2. have you client app up and running
3. have Rauthy up and running
4. know a route you can overwrite on your client app, where you can inject Rauthys `/callback`
5. have a client on Rauthy:
    - Allowed Origins MUST point to the Origin of your client app
    - The first Redirect URI MUST be absolute and point to the injected `/callback` from point 4
    - disable both plain and S256 PKCE flows

### nginx

When using nginx, you need the `auth_request` module enabled. This should be the case by default usually in recent
container images and versions. The example config does not show the bare minimum, but also already includes some minor
optimizations for proxied requests. It also shows a testing setup on localhost and no HTTPS setup.

```
upstream rauthy {
    server localhost:8080;
}

server {
    listen       8000;
    server_name  localhost;

    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

    proxy_http_version 1.1;
    proxy_cache_bypass $cookie_session;
    proxy_no_cache $cookie_session;
    proxy_buffers 4 32k;
    client_body_buffer_size 128k;

    send_timeout 5m;
    proxy_read_timeout 240;
    proxy_send_timeout 240;
    proxy_connect_timeout 240;

    # this nginx-internal, virtual endpoint makes the magic happen
    location = /forward_auth {
        internal;

        # These are the requiered, above mentioned request headers.
        # The `X-Forwarded-For` is inserted into every request globally 
        # above already.
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header X-Forwarded-Method $request_method;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_set_header X-Forwarded-URI $request_uri;

        # We don't want to forward any body to Rauthy. This would be a 
        # huge waste of resources.
        proxy_set_header Content-Length "";
        proxy_set_header Connection "";
        proxy_pass_request_body off;

        # This line is the one that forwards the request to Rauthy.
        # The client used in this example url has the id `test`.
        #
        # NEVER set `danger_cookie_insecure=true` in production!
        # This is only used for testing purposes!
        #
        # Apart from `danger_cookie_insecure`, you can optionally pass in
        # `redirect_state` which will change the default `401` state if
        # validation failed and nginx should redirect. nginx can handle this
        # dynamically, but it exists for compatibility.
        proxy_pass http://rauthy/auth/v1/clients/test/forward_auth?danger_cookie_insecure=true;
    }

    # This is the callback endpoint, that you inject into your client app.
    # In this example, we use the same host, because we are using Rauthy's 
    # own /whoami endpoint for better debugging.
    #
    # To have less chance of conflicts with your client app, you could set it
    # to something like /oidc/rauthy/callback and adjust the Allowed Redirect URI
    # for the client you are using accordingly. The first redirect URI for the 
    # Rauthy client MUST point to exactly this location.
    location = /callback {
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host;

        proxy_pass http://rauthy/auth/v1/clients/test/forward_auth/callback?$args;
    }

    # This is our protected "client app". In this example, we are re-using Rauthy's
    # own whoami endpoint for better debugging and so the example does not need
    # another deployment.
    location /whoami {
        auth_request /forward_auth;
        auth_request_set $redirection_url $upstream_http_location;
        error_page 401 =302 $redirection_url;

        # If you have auth headers disabled, you can skip these next 2 blocks,
        # which are basically just copying them from the Rauthy repsonse
        # into the request that is forwarded to the client app.
        
        ## Auth Headers Rauthy sends when `auth_headers.enable = true`
        auth_request_set $user $upstream_http_x_forwarded_user;
        auth_request_set $roles $upstream_http_x_forwarded_user_roles;
        auth_request_set $groups $upstream_http_x_forwarded_user_groups;
        auth_request_set $email $upstream_http_x_forwarded_user_email;
        auth_request_set $email_verified $upstream_http_x_forwarded_user_email_verified;
        auth_request_set $family_name $upstream_http_x_forwarded_user_family_name;
        auth_request_set $given_name $upstream_http_x_forwarded_user_given_name;
        auth_request_set $mfa $upstream_http_x_forwarded_user_mfa;

        ## Inject Auth Headers into the request to the client app
        proxy_set_header x-forwarded-user $user;
        proxy_set_header x-forwarded-user-roles $roles;
        proxy_set_header x-forwarded-user-groups $groups;
        proxy_set_header x-forwarded-user-email $email;
        proxy_set_header x-forwarded-user-email-verified $email_verified;
        proxy_set_header x-forwarded-user-family-name $family_name;
        proxy_set_header x-forwarded-user-given-name $given_name;
        proxy_set_header x-forwarded-user-mfa $mfa;

        proxy_pass http://rauthy/auth/v1/whoami;
    }
}
```

### Traefik

This Traefik example config is for an `IngressRoute` when Traefik is deployed inside K8s. It should be pretty similar,
if you run it in docker though. This example re-used Rauthy's own `/whoami` endpoint again for simplicity, but the
setup is the same for a dedicated client app.

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: fwd-auth
spec:
  forwardAuth:
    # The id for the properly configured client is `fwd-auth-test` in this case.
    # Unlike nginx, Traefik also expects a `302` status code on unsuccessful authentication.
    # We are using Rauthy's K8s-internal address here, but it will work in the same way with 
    # a public one.
    address: http://rauthy.rauthy-dev.svc.cluster.local:8080/auth/v1/clients/fwd-auth-test/forward_auth?redirect_state=302
    # If you don't have auth headers enabled, you can remove this block.
    authResponseHeaders:
      - x-forwarded-user
      - x-forwarded-user-roles
      - x-forwarded-user-groups
      - x-forwarded-user-email
      - x-forwarded-user-email-verified
      - x-forwarded-user-family-name
      - x-forwarded-user-given-name
      - x-forwarded-user-mfa
---
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: fwd-auth-callback
spec:
  replacePath:
    # The id for the properly configured client is `fwd-auth-test` in this case.
    # By simply replacing the path to the correct one, we can freely choose any
    # location where we want to inject the callback URI into the client app.
    path: /auth/v1/clients/fwd-auth-test/forward_auth/callback
---
# You probably don't need this middleware when protecting a client app.
# It just exists for this example to route to Rauthys whoami endpoint properly.
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: whoami-replace
spec:
  replacePath:
    path: /auth/v1/whoami
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: rauthy-https
  namespace: rauthy-dev
spec:
  entryPoints:
    - websecure
  tls:
    secretName: iam.sebadob.dev-tls
  routes:
    - match: Host(`iam.sebadob.dev`)
      kind: Rule
      services:
        - name: rauthy
          port: 8080
    # This is the route to your client app you want to protect.
    - match: Host(`iam.sebadob.dev`) && Path(`/whoami`)
      kind: Rule
      middlewares:
        # CAUTION: very important to have the fwd-auth BEFORE any path rewriting.
        # You can set a fixed redirect URI when you overwrite `X-Forwarded-URL`.
        # Also, Traefik can mess up some headers if you have path rewriting applied.
        # If you have issues with this, make sure to check this.
        - name: fwd-auth
        - name: whoami-replace
      services:
        - name: rauthy
          port: 8080
    # This is the callback route you need to inject into your client app.
    - match: Host(`iam.sebadob.dev`) && Path(`/callback`)
      kind: Rule
      middlewares:
        - name: fwd-auth-callback
      services:
        - name: rauthy
          port: 8080
```

### Caddy

This is a very simple Caddy config example to get you started:

```
test.example.com {
    handle {
        forward_auth rauthy {
            uri /auth/v1/clients/test/forward_auth?redirect_state=302
        }
        reverse_proxy x.x.x.x:xx
    }
    handle /auth/v1/clients/* {
        reverse_proxy rauthy {
            header_up X-Forwarded-Method {method}
            header_up X-Forwarded-Uri {uri}
        }
    }
}
```
