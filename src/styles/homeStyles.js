const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#eee'
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    height: null
  },
  scrollViewContainer: {
    flex: 1
    // justifyContent: 'flex-start',
    // alignItems: 'center'
  },
  headerStyle: {
    marginTop: 60,
    marginBottom: 10,
    fontSize: 60,
    fontWeight: '900',
    textAlign: 'center',
    // fontFamily: 'Bradley Hand',
    color: 'orange',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  addView: {
    borderWidth: 2,
    borderColor: 'black',
    height: 150,
    width: 150,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,150,136,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  addText: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  addImage: {
    height: 125,
    width: 125
  },
  mapButton: {
    backgroundColor: 'rgba(0,150,136,0.5)',
    width: 250,
    height: 30,
    margin: 10
  },
  bigButton: {
    backgroundColor: 'rgba(0,150,136,0.5)',
    width: 250,
    height: 200,
    margin: 10
  },
  iconView: {
    borderWidth: 2,
    borderColor: 'black',
    height: 150,
    width: 150,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,150,136,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  iconRowView: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
}

export default styles
