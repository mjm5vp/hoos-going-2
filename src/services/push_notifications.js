import { Notifications, Permissions } from 'expo'

import axios from 'axios'

export const registerForPushNotificationsAsync = async () => {
  // const { currentUser } = firebase.auth();

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync()
  console.log('notification token')
  console.log(token)

  // POST the token to your backend server from where you
  // can retrieve it to send push notifications.
  // try {
  //   await firebase.database().ref(`users/${currentUser.uid}/notifications`)
  //     .set({ token });
  // } catch (err) {
  //   console.log(err);
  //   console.log('could not save notification token');
  // }

  return token
}

export const registerForRemoteNotifications = async previousToken => {
  if (previousToken) {
    console.log('previousToken exists')
    console.log(previousToken)
    return previousToken
  }

  const { status } = await Permissions.askAsync(
    Permissions.REMOTE_NOTIFICATIONS
  )

  console.log('status')
  console.log(status)

  if (status !== 'granted') {
    return null
  }

  const newToken = await Notifications.getExpoPushTokenAsync()
  return newToken
}

export const checkIfNotificationsOn = async () => {
  const { status } = await Permissions.getAsync(
    Permissions.REMOTE_NOTIFICATIONS
  )

  return status === 'granted'
}

export const checkAndSetPushToken = async () => {
  const notificationsOn = await checkIfNotificationsOn()

  if (notificationsOn) {
    return await Notifications.getExpoPushTokenAsync()
  }
  return null
}

export const sendNotifications = async ({ pushTokens }) => {
  const ROOT_URL =
    'https://us-central1-one-time-password-698fc.cloudfunctions.net'
  const text = 'test text'
  const info = 'test info'

  try {
    await axios.post(`${ROOT_URL}/sendPushNotification`, {
      pushTokens,
      text,
      info
    })
    console.log('sent')
  } catch (err) {
    console.log('try axios error')
    console.log(err)
  }
}
