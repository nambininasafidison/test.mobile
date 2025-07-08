import { View, Text, StyleSheet } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <View style={styles.logoInner} />
      </View>
      <Text style={styles.title}>Product Management</Text>
      <MaterialIcons name="refresh" size={24} color="#6b7280" style={styles.spinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 32,
  },
  spinner: {
    opacity: 0.6,
  },
})
