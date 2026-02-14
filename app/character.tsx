import { StyleSheet, Text, View } from "react-native";

export default function CharacterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
