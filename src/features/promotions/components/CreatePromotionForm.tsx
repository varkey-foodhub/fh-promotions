import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreatePromotion } from "../promotions.queries";
import { CreatePromotionPayload, FormValues } from "../promotions.types";
import { ControlledDatePicker } from "./form/ControlledDatePicker";
import { ControlledInput } from "./form/ControlledInput";
import CreatePromotionFieldTitle from "./form/CreatePromotionFieldTitle";
import SelectionButton from "./form/ToggleButton";
const CreatePromotionForm = () => {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const createMutation = useCreatePromotion();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }, // 1. Get validation state
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      code: "",
      type: "PERCENTAGE",
      application_method: "CODE",
      percent_off: "",
      valid_from: "",
      valid_to: "",
      active: true,
    },
    mode: "onChange", // 2. Enable real-time validation checking
  });

  const selectedType = watch("type");

  const onSubmit = (data: FormValues) => {
    const payload: CreatePromotionPayload = {
      name: data.name,
      code: data.code,
      type: data.type,
      application_method: data.application_method,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      active: data.active,
      ...(data.type === "PERCENTAGE"
        ? { percent_off: Number(data.percent_off) }
        : { flat_amount: Number(data.flat_amount) }),
    };
    console.log(payload);
    createMutation.mutate(payload, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContentContainer}>
          {/* Promotion Type */}
          <View>
            <CreatePromotionFieldTitle text="Promotion Type" />
            <Controller
              control={control}
              name="application_method"
              render={({ field: { onChange, value } }) => (
                <View style={styles.buttonContainer}>
                  <SelectionButton
                    label="Coupon"
                    isSelected={value === "CODE"}
                    onPress={() => onChange("CODE")}
                    colors={colors}
                  />
                  <SelectionButton
                    label="Discount"
                    isSelected={value === "DISCOUNT"}
                    onPress={() => onChange("DISCOUNT")}
                    colors={colors}
                  />
                </View>
              )}
            />
          </View>

          <ControlledInput<FormValues>
            name="name"
            control={control}
            label="Promotion Name"
            required
            rules={{ required: "Promotion name is required" }}
          />

          <ControlledInput<FormValues>
            name="code"
            control={control}
            label="Promotion Code"
            required
            rules={{ required: "Code is required" }}
          />

          {/* Value Type */}
          <View>
            <CreatePromotionFieldTitle text="Value Type" />
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.dropdownContainer,
                    { borderColor: colors.borderLight },
                  ]}
                >
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    dropdownIconColor={colors.textPrimary}
                    style={{ color: colors.textPrimary }}
                  >
                    <Picker.Item label="Select..." value="" />
                    <Picker.Item label="Percentage (%)" value="PERCENTAGE" />
                    <Picker.Item label="Fixed Amount ($)" value="FIXED" />
                  </Picker>
                </View>
              )}
              rules={{ required: true }}
            />
          </View>

          {/* Dynamic Field */}
          {selectedType === "PERCENTAGE" ? (
            <ControlledInput<FormValues>
              name="percent_off"
              control={control}
              label="Percentage Value"
              required
              rules={{ required: "Percentage is required" }}
              inputProps={{
                placeholder: "e.g., 20",
                keyboardType: "numeric",
              }}
            />
          ) : (
            <ControlledInput<FormValues>
              name="flat_amount"
              control={control}
              label="Fixed Amount Details"
              required
              rules={{ required: "Amount is required" }}
              inputProps={{
                placeholder: "e.g., 10.00",
                keyboardType: "numeric",
              }}
            />
          )}

          <ControlledDatePicker<FormValues>
            name="valid_from"
            control={control}
            label="Start Date"
            required
            rules={{ required: "Start date is required" }}
          />

          <ControlledDatePicker<FormValues>
            name="valid_to"
            control={control}
            label="End Date (Optional)"
          />

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: 48 + insets.bottom,
            backgroundColor: "white",
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid} // Disable interaction if invalid
          style={[
            styles.submitButton,
            {
              // 4. Grey out if invalid, Primary color if valid
              backgroundColor: isValid
                ? colors.actionPrimary
                : colors.borderLight, // or a specific 'disabled' gray color
            },
          ]}
        >
          <ThemedText
            style={[
              styles.buttonText,
              {
                // Optional: Change text color when disabled
                color: isValid ? "white" : colors.textSecondary,
              },
            ]}
          >
            Create Promotion
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePromotionForm;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formContentContainer: {
    gap: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
