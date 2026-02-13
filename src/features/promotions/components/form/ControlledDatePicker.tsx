import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  // Added rules prop for validation
  rules?: RegisterOptions<T, Path<T>>;
};

export function ControlledDatePicker<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules,
}: Props<T>) {
  const colors = useThemeColor();
  const [show, setShow] = useState(false);

  const formatDate = (date?: string) => {
    if (!date) return "dd/mm/yyyy";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules} // Pass validation rules
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            {required && (
              <Text
                style={[
                  styles.asterisk,
                  { color: colors.actionNegative ?? "red" },
                ]}
              >
                *
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                // Dynamic border color based on error state
                borderColor: error
                  ? (colors.actionNegative ?? "red")
                  : colors.borderLight,
              },
            ]}
            onPress={() => setShow(true)}
          >
            <ThemedText
              style={{
                color: value ? colors.textPrimary : colors.textLight,
              }}
            >
              {value ? formatDate(value) : "dd/mm/yyyy"}
            </ThemedText>

            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>

          {/* Error Message Display */}
          {error && (
            <Text
              style={[
                styles.errorText,
                { color: colors.actionNegative ?? "red" },
              ]}
            >
              {error.message}
            </Text>
          )}

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                // On Android, we close the picker after selection
                if (Platform.OS === "android") {
                  setShow(false);
                }

                if (selectedDate) {
                  // Store as ISO string
                  onChange(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Parent container handles gap usually, or set to 16 if needed
  },
  labelRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  asterisk: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
