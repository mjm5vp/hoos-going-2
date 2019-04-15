import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import AlphaScrollFlatList from 'alpha-scroll-flat-list'
import { connect } from 'react-redux'

const WIDTH = Dimensions.get('window').width
const ITEM_HEIGHT = 50

class AddContactsScreen extends Component {
  keyExtractor(item) {
    return item.id
  }

  renderItem({ item }) {
    return (
      <View key={item.number} style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.number}</Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <AlphaScrollFlatList
          keyExtractor={this.keyExtractor.bind(this)}
          data={this.props.allContacts.sort((prev, next) =>
            prev.name.localeCompare(next.name)
          )}
          renderItem={this.renderItem.bind(this)}
          scrollKey={'name'}
          reverse={false}
          itemHeight={ITEM_HEIGHT}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { allContacts } = state.friends

  return { allContacts }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    width: WIDTH,
    flex: 1,
    flexDirection: 'column',
    height: ITEM_HEIGHT
  },
  itemTitle: {
    fontWeight: 'bold',
    color: '#888',
    padding: 5
  },
  itemSubtitle: {
    color: '#ddd',
    padding: 5,
    paddingTop: 0
  }
}

export default connect(
  mapStateToProps,
  {}
)(AddContactsScreen)
