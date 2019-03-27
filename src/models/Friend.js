export class Friend {
  constructor(name, number, pushToken) {
    this.name = name
    this.number = number
    this.pushToken = pushToken
  }

  parseJSON(friend) {
    Object.keys(friend).forEach(key => {
      this[key] = friend[key]
    })
    return this
  }
}
