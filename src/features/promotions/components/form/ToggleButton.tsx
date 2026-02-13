import { StyleSheet, Text, TouchableOpacity } from "react-native";
const SelectionButton = ({ label, isSelected, onPress, colors }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.toggleButton,
      {
        backgroundColor: isSelected ? colors.actionPrimary : "white",
        borderColor: colors.actionPrimary,
        borderWidth: 1,
      },
    ]}
  >
    <Text
      style={[
        styles.ToggleButtonText,
        {
          color: isSelected ? colors.textInverse : colors.textPrimary,
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
export default SelectionButton;
const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ToggleButtonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});
