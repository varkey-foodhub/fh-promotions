import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  inputProps?: TextInputProps;
};

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules,
  inputProps,
}: ControlledInputProps<T>) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      {label && (
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
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: fieldState.error
                    ? (colors.actionNegative ?? "red")
                    : fieldState.isTouched
                    ? colors.accentCO
                    : colors.borderLight,
                  backgroundColor: "#FAFAFA",
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.textPrimary,
                  },
                ]}
                value={value ? String(value) : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholderTextColor={colors.textLight}
                {...inputProps}
              />
            </View>
            {fieldState.error && (
              <View style={styles.errorContainer}>
                <Text
                  style={[
                    styles.errorText,
                    { color: colors.actionNegative ?? "red" },
                  ]}
                >
                  {fieldState.error.message}
                </Text>
              </View>
            )}
          </>
        )}
      />
    </View>
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
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
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