importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.setConfig({
  debug: true,
});

workbox.core.setCacheNameDetails({prefix: "vuepwa"});




self.addEventListener('message', (event) => {
 if (event.data && event.data.type === 'SKIP_WAITING') {
   self.skipWaiting();
 }
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute(self.__precacheManifest);


/*   let backgroundSyncSupported = 'sync' in self.registration
  registration ? true : false
  console.log('background sync supported: ', backgroundSyncSupported);

  let createPostQueue = null
  let editPostQueue = null

  if(backgroundSyncSupported){
     createPostQueue = new workbox.backgroundSync.Queue('createPostQueue');
     editPostQueue = new workbox.backgroundSync.Queue('editPostQueue');
  } */

   workbox.routing.registerRoute(
    ({url}) => url.host.startsWith('fonts.g'),
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        })
      ],
    })
  ); 

  workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('/getPosts.php'),
    new workbox.strategies.NetworkFirst()
  );

/*   workbox.routing.registerRoute(
    'https://polar-eyrie-48849.herokuapp.com/api/posts',
    new workbox.strategies.NetworkFirst()
  ); */



  workbox.routing.registerRoute(
    ({url}) => url.href.startsWith('http'),
    new workbox.strategies.StaleWhileRevalidate()
  );


/*     if(backgroundSyncSupported){
      self.addEventListener('fetch', (event) => {
        if(event.request.url.endsWith('/create/post')){
        // Clone the request to ensure it's safe to read when
        // adding to the Queue.
        const promiseChain = fetch(event.request.clone()).catch((err) => {
          return createPostQueue.pushRequest({request: event.request});
        });
        event.waitUntil(promiseChain);
        }
      });

      self.addEventListener('fetch', (event) => {
        if(event.request.url.endsWith('/edit/post')){
        // Clone the request to ensure it's safe to read when
        // adding to the Queue.
        const promiseChain = fetch(event.request.clone()).catch((err) => {
          return createPostQueue.pushRequest({request: event.request});
        });
        event.waitUntil(promiseChain);
        }
      });

    } */



} else {
  console.log(`Boo! Workbox didn't load 😬`);
}