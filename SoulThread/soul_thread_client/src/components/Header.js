import { StyleSheet,View,Text } from "react-native"

function Header({title}) {
  return (
    <View style={styles.container}>
       <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    height: 44,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
})

export default Header
