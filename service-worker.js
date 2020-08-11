function handlePushEvent(event) {
  const DEFAULT_TAG = 'NeedAndDeal-Default'
  return Promise.resolve()
  .then(() => {
    return event.data.json();
  })
  .then((data) => {
    const title = data.notification.title;
    const options = data.notification;
    if (!options.tag) {
      options.tag = DEFAULT_TAG;
    }
    return registration.showNotification(title, options);
  })
  .catch((err) => {
    console.error('Push event caused an error: ', err);

    const title = 'Message Received';
    const options = {
      body: event.data.text(),
      tag: DEFAULT_TAG
    };
    return registration.showNotification(title, options);
  });
}

self.addEventListener('push', function(event) {
  console.log(event);
  event.waitUntil(handlePushEvent(event));

});




/**** START simpleNotification ****/
self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  //NOTE:clickedNotification.data => has url to redirect
    event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
    // If a Window tab matching the targeted URL already exists, focus that;
    const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === clickedNotification.data ? (windowClient.focus(), true) : false);
    // Otherwise, open a new tab to the applicable URL and focus it.
    if (!hadWindowToFocus) clients.openWindow(clickedNotification.data).then(windowClient => windowClient ? windowClient.focus() : null);
  }));

  
});
/**** END simpleNotification ****/