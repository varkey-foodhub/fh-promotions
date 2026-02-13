import { useThemeColor } from "@/src/hooks/useThemeColors";
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
import CreatePromotionFieldTitle from "./CreatePromotionFieldTitle";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  // New prop to accept validation rules (e.g. required: "Error message")
  rules?: RegisterOptions<T, Path<T>>;
  inputProps?: TextInputProps;
};

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules, // Destructure rules
  inputProps,
}: ControlledInputProps<T>) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      {label && <CreatePromotionFieldTitle text={label} />}

      <Controller
        control={control}
        name={name}
        rules={rules} // Pass rules to the Controller
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: fieldState.error
                    ? (colors.actionNegative ?? "red")
                    : colors.borderLight,
                  color: colors.textPrimary,
                  backgroundColor: colors.backgroundPrimary, // Ensure background matches theme
                },
              ]}
              value={value ? String(value) : ""}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={colors.textLight}
              {...inputProps}
            />

            {fieldState.error && (
              <Text
                style={[
                  styles.errorText,
                  { color: colors.actionNegative ?? "red" },
                ]}
              >
                {fieldState.error.message}
              </Text>
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
