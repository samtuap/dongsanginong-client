importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyDWOhjh5Zi-Bs9TN6CRQJ_tIx3k0X5z89M",
  authDomain: "dongsanginong-24f95.firebaseapp.com",
  projectId: "dongsanginong-24f95",
  storageBucket: "dongsanginong-24f95.appspot.com",
  messagingSenderId: "331466655968",
  appId: "1:331466655968:web:f9802c140ab1701b63a885",
  measurementId: "G-WK79L8VKTR"
};
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {   
      // console.log(
      //   '[firebase-messaging-sw.js] Received background message ',
      //   payload
      // );
      console.log("!!");  

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "favicon.ico"
      };

  
      self.registration.showNotification(notificationTitle, notificationOptions);
    });


    messaging.onMessage((payload) => {   
      // console.log(
      //   '[firebase-messaging-sw.js] Received foreground message!! ',
      //   payload
      // );

      console.log("~~");
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "favicon.ico"
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });