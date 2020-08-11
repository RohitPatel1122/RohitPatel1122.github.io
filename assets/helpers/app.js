const pushsubscriptionbaseURL = "http://ticketappapp.eba-9c9rggpp.ap-southeast-1.elasticbeanstalk.com/"
const postapiurl = new URL('api/pushsubscription/postsubscription/',pushsubscriptionbaseURL);
const getVapidPublicKeyapi = new URL('api/pushsubscription/getpublickey/',pushsubscriptionbaseURL);

//Need to remove this hardcoded auth token and user id
// const auth_token= sessionStorage.getItem("auth_key");
// const user_id= sessionStorage.getItem("user_id");
const auth_token= '50c752670f24aca19e013228931797544cca413d'
const user_id = 1;
var pushCheckbox;



function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**** START register-sw ****/
function registerServiceWorker() {
  return navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function (err) {
      console.error('Unable to register service worker.', err);
    });
}
/**** END register-sw ****/

// This is just to make sample code eaier to read.
// TODO: Move into a variable rather than register each time.
function getSWRegistration() {
  return navigator.serviceWorker.register('service-worker.js');
}

/**** START request-permission ****/
function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
}
/**** END request-permission ****/

/**
 * Using `Notification.permission` directly can be slow (locks on the main
 * thread). Using the permission API with a fallback to
 * `Notification.permission` is preferable.
 * @return {Promise<String>} Returns a promise that resolves to a notification
 * permission state string.
 */
/**** START get-permission-state ****/
function getNotificationPermissionState() {
  if (navigator.permissions) {
    return navigator.permissions.query({ name: 'notifications' })
      .then((result) => {
        return result.state;
      });
  }

  return new Promise((resolve) => {
    resolve(Notification.permission);
  });
}
/**** END get-permission-state ****/

function unsubscribeUserFromPush() {
  return registerServiceWorker()
    .then(function (registration) {
      // Service worker is active so now we can subscribe the user.
      return registration.pushManager.getSubscription();
    })
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .then(function (subscription) {
      pushCheckbox.disabled = false;
      pushCheckbox.checked = false;
    })
    .catch(function (err) {
      console.error('Failed to subscribe the user.', err);
      getNotificationPermissionState()
        .then((permissionState) => {
          pushCheckbox.disabled = permissionState === 'denied';
          pushCheckbox.checked = false;
        });
    });
}

/**** START send-subscription-to-server ****/
function sendSubscriptionToBackEnd(subscription) {
  console.log("sending subscription to save")
  var data = JSON.stringify({ "auth_key": auth_token, "user_id": user_id, "subscription": subscription});
  return fetch(postapiurl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  })
    .then(function (response) {
      console.log(response)
      if (response.status!=201) {
        throw new Error('Bad status code from server.');
      }else {
        console.log("subscription saved")
      }
      return response.json();
    })
}
/**** END send-subscription-to-server ****/

/**** START subscribe-user ****/
 function subscribeUserToPush() {
  console.log("Subscribing user for push")
  
  return getSWRegistration().then(async function (registration) {
    getVapidPublicKeyapi.searchParams.append('user_id', user_id)
    getVapidPublicKeyapi.searchParams.append('auth_key',auth_token)
    const response = await fetch(getVapidPublicKeyapi);
    const vapid_public_key = await response.text();
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          vapid_public_key
        )
      };
      return registration.pushManager.subscribe(subscribeOptions);
    }).then(function (pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription;
    });

  
}
/**** END subscribe-user ****/

function setUpPush(checkbox) {
  console.log(checkbox);
  pushCheckbox = checkbox;
  return Promise.all([
    registerServiceWorker(),
    getNotificationPermissionState()
  ])
    .then(function (results) {
      const registration = results[0];
      const currentPermissionState = results[1];

      if (currentPermissionState === 'denied') {
        console.warn('The notification permission has been blocked. Nothing we can do.');
        pushCheckbox.disabled = true;
        return;
      }

      pushCheckbox.addEventListener('change', function (event) {
        // Disable UI until we've handled what to do.
        event.target.disabled = true;

        if (event.target.checked) {
          // Just been checked meaning we need to subscribe the user
          // Do we need to wait for permission?
          let promiseChain = Promise.resolve();
          if (currentPermissionState !== 'granted') {
            promiseChain = askPermission();
          }

          promiseChain
            .then(subscribeUserToPush)
            .then(function (subscription) {
              if (subscription) {
                return sendSubscriptionToBackEnd(subscription)
                  .then(function () {
                    return subscription;
                  });
              }

              return subscription;
            })
            .then(function (subscription) {
              // We got a subscription AND it was sent to our backend,
              // re-enable our UI and set up state.
              pushCheckbox.disabled = false;
              pushCheckbox.checked = subscription !== null;
            })
            .catch(function (err) {
              console.error('Failed to subscribe the user.', err);

              // An error occured while requestion permission, getting a
              // subscription or sending it to our backend. Re-set state.
              pushCheckbox.disabled = currentPermissionState === 'denied';
              pushCheckbox.checked = false;
            });
        } else {
          // Just been unchecked meaning we need to unsubscribe the user
          unsubscribeUserFromPush();
        }
      });

      if (currentPermissionState !== 'granted') {
        // If permission isn't granted than we can't be subscribed for Push.
        pushCheckbox.disabled = false;
        return;
      }

      return registration.pushManager.getSubscription()
        .then(function (subscription) {
          pushCheckbox.checked = subscription !== null;
          pushCheckbox.disabled = false;
        });
    })
    .catch(function (err) {
      console.log('Unable to register the service worker: ' + err);
    });
}
function allowPush(){
  console.log('app.js');
}
// window.onload = function () {
//   /**** START feature-detect ****/
//   // const pushCheckbox = document.querySelector('.js-push-toggle-checkbox');
//   if (!('serviceWorker' in navigator)) {
//     // Service Worker isn't supported on this browser, disable or hide UI.
//     return;
//   }

//   if (!('PushManager' in window)) {
//     // Push isn't supported on this browser, disable or hide UI.
//     return;
//   }
//   /**** END feature-detect ****/
//   setUpPush();
// };
