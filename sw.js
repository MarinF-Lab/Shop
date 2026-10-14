/* Service worker de la planilla.
   Guarda la aplicación para que abra sin señal; los datos no pasan por aquí:
   Firestore ya trae su propia caché offline y la autenticación debe ir siempre
   a la red. Al cambiar los archivos de la app, sube VERSION. */

var VERSION = "v2";
var CACHE_APP = "planilla-app-" + VERSION;
var CACHE_SDK = "planilla-sdk-" + VERSION;

var APP = [
  "./planilla-costos.html",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-maskable.png",
  "./icon-512-maskable.png"
];

/* el SDK de Firebase va con su versión en la URL: nunca cambia, se puede guardar */
var SDK = "https://www.gstatic.com/firebasejs/";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_APP).then(function (c) { return c.addAll(APP); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (k) {
        return k !== CACHE_APP && k !== CACHE_SDK;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  /* SDK de Firebase: primero la caché, porque es inmutable */
  if (req.url.indexOf(SDK) === 0) {
    e.respondWith(caches.open(CACHE_SDK).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          /* <script> de otro dominio sin CORS llega como respuesta opaca (ok = false):
             hay que guardarla igual, o el SDK nunca queda disponible sin señal */
          if (res.ok || res.type === "opaque") c.put(req, res.clone());
          return res;
        });
      });
    }));
    return;
  }

  /* todo lo demás de otros dominios (Firestore, Google, autenticación) va directo a la red */
  if (url.origin !== self.location.origin) return;
  /* rutas reservadas de Firebase Hosting para el inicio de sesión */
  if (url.pathname.indexOf("/__/") === 0) return;

  /* páginas: primero la red, para recibir siempre la versión nueva;
     sin señal, la última guardada */
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) {
        var copia = res.clone();
        caches.open(CACHE_APP).then(function (c) { c.put(req, copia); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        /* la raíz del sitio abre la planilla; cualquier otra página sin copia, error */
        if (/\/$/.test(url.pathname)) return caches.match("./planilla-costos.html");
        return Response.error();
      });
    }));
    return;
  }

  /* iconos y manifest: la caché, y de fondo se refresca */
  e.respondWith(caches.match(req).then(function (hit) {
    var red = fetch(req).then(function (res) {
      if (res.ok) {
        var copia = res.clone();
        caches.open(CACHE_APP).then(function (c) { c.put(req, copia); });
      }
      return res;
    }).catch(function () { return hit; });
    return hit || red;
  }));
});
