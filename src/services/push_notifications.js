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
    return null
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync()

  return token
}

export const registerForRemoteNotifications = async previousToken => {
  if (previousToken) {
    return previousToken
  }

  const { status } = await Permissions.askAsync(
    Permissions.REMOTE_NOTIFICATIONS
  )

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

export const sendNotifications = async ({
  friendsWithPushTokens,
  poo,
  myInfo
}) => {
  const ROOT_URL =
    'https://us-central1-one-time-password-698fc.cloudfunctions.net'

  try {
    await axios.post(`${ROOT_URL}/sendPushNotification`, {
      friendsWithPushTokens,
      poo,
      myInfo
    })
  } catch (err) {
    console.log('try axios error')
    console.log(err)
  }
}
