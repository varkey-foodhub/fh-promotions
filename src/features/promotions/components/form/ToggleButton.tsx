import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SelectionButtonProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
};

const SelectionButton = ({
  label,
  isSelected,
  onPress,
  colors,
}: SelectionButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.toggleButton,
      {
        backgroundColor: isSelected ? colors.actionPrimary : "#FAFAFA",
        borderColor: isSelected ? colors.actionPrimary : colors.borderLight,
        borderWidth: 2,
      },
    ]}
    activeOpacity={0.7}
  >
    <View style={styles.buttonContent}>
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={colors.textInverse}
        />
      )}
      <Text
        style={[
          styles.toggleButtonText,
          {
            color: isSelected ? colors.textInverse : colors.textPrimary,
            fontWeight: isSelected ? "700" : "600",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

export default SelectionButton;

const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
});