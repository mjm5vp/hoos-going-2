import { Contacts } from 'expo'
import _ from 'lodash'
import firebase from 'firebase'

export const getContactsAsync = async () => {
  let contacts = []
  try {
    contacts = await Contacts.getContactsAsync({
      fields: [Contacts.PHONE_NUMBERS]
    })
  } catch (e) {
    console.error(e)
    console.error('could not get contacts')
  }
  return formatContacts(contacts)
}

export const removeFriendsFromContacts = (contacts, friends) => {
  return contacts.filter(contact => {
    return !_.some(friends, ['number', contact.number])
  })
}

export const getUsersNumbers = async () => {
  let usersNumbers = []
  try {
    await firebase
      .database()
      .ref('/users')
      .once('value', snapshot => {
        usersNumbers = Object.keys(snapshot.val())
      })
  } catch (e) {
    console.error('Could not get users numbers')
    console.error(e)
  }
  return usersNumbers
}

export const formatContacts = contacts => {
  let contactsNamesAndNumbers = []

  contacts.data
    .filter(contact => contact.phoneNumbers[0])
    .forEach(contact =>
      contact.phoneNumbers.forEach(phoneNumber => {
        const { name } = contact
        const number = formatPhone(phoneNumber.number)
        if (
          number.length === 10
          // !_.some(this.props.myFriends, ['number', number])
        ) {
          contactsNamesAndNumbers.push({ name, number })
        }
      })
    )

  contactsNamesAndNumbers = _.uniqWith(contactsNamesAndNumbers, _.isEqual)
  return _.sortBy(contactsNamesAndNumbers, contact => contact.name)
}

export const formatPhone = phone => {
  const number = String(phone).replace(/[^\d]/g, '')
  return number.charAt(0) === '1' ? number.substring(1) : number
}
