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
    if (!date) return "Select date";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
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
                borderColor: error
                  ? (colors.actionNegative ?? "red")
                  : value
                  ? colors.accentCO
                  : colors.borderLight,
                backgroundColor: "#FAFAFA",
              },
            ]}
            onPress={() => setShow(true)}
            activeOpacity={0.7}
          >
            <View style={styles.dateContent}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={value ? colors.textPrimary : colors.textLight}
              />
              <ThemedText
                style={{
                  color: value ? colors.textPrimary : colors.textLight,
                  fontSize: 15,
                  fontWeight: value ? "500" : "400",
                }}
              >
                {formatDate(value)}
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.textLight}
            />
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text
                style={[
                  styles.errorText,
                  { color: colors.actionNegative ?? "red" },
                ]}
              >
                {error.message}
              </Text>
            </View>
          )}

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") {
                  setShow(false);
                }
                if (selectedDate) {
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
    marginBottom: 0,
  },
  labelRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  asterisk: {
    fontSize: 14,
    fontWeight: "700",
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorContainer: {
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
  },
});