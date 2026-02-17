import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Option {
  label: string;
  value: any;
}

interface ThemedDropdownProps {
  label?: string;
  value: any;
  options: Option[];
  onSelect: (value: any) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const ThemedDropdown: React.FC<ThemedDropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = "Select an option",
  error,
  disabled = false,
}) => {
  const colors = useThemeColor();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (itemValue: any) => {
    onSelect(itemValue);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <TouchableOpacity
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.trigger,
          {
            borderColor: error ? "#D32F2F" : colors.borderLight,
            backgroundColor: disabled ? "#F5F5F5" : colors.backgroundPrimary,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.valueText,
            {
              color: selectedOption ? colors.textPrimary : colors.textSecondary,
            },
          ]}
        >
          {displayValue}
        </ThemedText>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.backgroundElevated },
                ]}
              >
                <View style={styles.modalHeader}>
                  <ThemedText style={styles.modalTitle}>
                    {label || placeholder}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={colors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={options}
                  keyExtractor={(item, index) => `${item.value}-${index}`}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => {
                    const isSelected = item.value === value;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: isSelected
                              ? colors.accentCM + "15" // 15 is slightly transparent hex
                              : "transparent",
                          },
                        ]}
                        onPress={() => handleSelect(item.value)}
                      >
                        <ThemedText
                          style={[
                            styles.optionLabel,
                            {
                              fontWeight: isSelected ? "600" : "400",
                              color: isSelected
                                ? colors.accentCM
                                : colors.textPrimary,
                            },
                          ]}
                        >
                          {item.label}
                        </ThemedText>
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={colors.accentCM}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50, // Matches standard input height
    borderWidth: 1,
    borderRadius: 8, // Matches ControlledInput border radius usually
    paddingHorizontal: 16,
  },
  valueText: {
    fontSize: 16,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Bottom sheet style
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20, // Safe area padding
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 16,
  },
});
