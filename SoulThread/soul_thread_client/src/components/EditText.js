import { StyleSheet, Text, TextInput, View } from 'react-native'

function EditText({
  marginTop,
  label,
  placeholder,
  onChangeText,
  isPassword = false,
})
{
    return (
      <View style={[styles.container, { marginTop: marginTop ? marginTop : 0 }]}>
      <Text style={styles.text}>{label}</Text>
      <TextInput
        secureTextEntry={isPassword}
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </View>
    )
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontWeight: 700,
  },
  input: {
    borderRadius: 5,
    borderColor: 'lightgray',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 7,
    paddingHorizontal: 15,
  },
})


export default EditText
