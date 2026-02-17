import { useMenu } from "@/src/features/menu/menu.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBundles, useCreatePromotion } from "../promotions.queries";
import { CreatePromotionPayload, FormValues } from "../promotions.types";
import { ControlledDatePicker } from "./form/ControlledDatePicker";
import { ThemedDropdown } from "./form/ControlledDropDown";
import { ControlledInput } from "./form/ControlledInput";
import CreatePromotionFieldTitle from "./form/CreatePromotionFieldTitle";
import SelectionButton from "./form/ToggleButton";
import MenuItemSelector from "./MenuItemSelector";

const CreatePromotionForm = () => {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const createMutation = useCreatePromotion();
  const router = useRouter();
  const { data: menuItems } = useMenu();
  const [isMenuSelectorVisible, setIsMenuSelectorVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
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
      conditions: {
        required_item_ids: [],
        min_order_value: "",
      },
    },
    mode: "onChange",
  });

  const selectedType = watch("type");
  const selectedItemIds = watch("conditions.required_item_ids") || [];
  const selectedBundleId = watch("promotion_bundle_id");
  const { data: bundles, isLoading: bundlesLoading, refetch } = useBundles();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const getSelectedItems = () => {
    if (!menuItems || selectedItemIds.length === 0) return [];
    return menuItems.filter((item) => selectedItemIds.includes(item.id));
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedIds = selectedItemIds.filter((id) => id !== itemId);
    setValue("conditions.required_item_ids", updatedIds);
  };

  // Prepare Dropdown Options
  const discountTypeOptions = [
    { label: "Percentage (%)", value: "PERCENTAGE" },
    { label: "Fixed Amount (₹)", value: "FIXED" },
    { label: "Bundle", value: "BUNDLE" },
  ];

  const bundleOptions = [
    { label: bundlesLoading ? "Loading..." : "Select bundle", value: null },
    ...(bundles
      ? bundles.map((b: any) => ({ label: b.name, value: b.id }))
      : []),
  ];

  const onSubmit = (data: FormValues) => {
    const payload: CreatePromotionPayload = {
      name: data.name,
      code: data.code,
      type: data.type,
      application_method: data.application_method,
      valid_from: data.valid_from,
      ...(data.valid_to &&
        data.valid_to.trim() !== "" && { valid_to: data.valid_to }),
      active: data.active,
      ...(data.type === "PERCENTAGE"
        ? { percent_off: Number(data.percent_off) }
        : data.type === "FIXED"
          ? { flat_amount: Number(data.flat_amount) }
          : {}),
      ...(data.type === "BUNDLE" && data.promotion_bundle_id
        ? { promotion_bundle_id: Number(data.promotion_bundle_id) }
        : {}),
    };

    // Add conditions if any are specified
    const hasRequiredItems =
      data.conditions?.required_item_ids &&
      data.conditions.required_item_ids.length > 0;
    const hasMinOrderValue =
      data.conditions?.min_order_value &&
      data.conditions.min_order_value.trim() !== "";

    if (hasRequiredItems || hasMinOrderValue) {
      payload.conditions = {
        ...(hasRequiredItems && {
          required_item_ids: data.conditions!.required_item_ids,
        }),
        ...(hasMinOrderValue && {
          min_order_value: Number(data.conditions!.min_order_value),
        }),
      };
    }

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
          {/* Promotion Type Section */}
          <View style={styles.section}>
            <CreatePromotionFieldTitle text="Promotion Type" />
            <Controller
              control={control}
              name="application_method"
              render={({ field: { onChange, value } }) => (
                <View style={styles.buttonContainer}>
                  <SelectionButton
                    label="Coupon Code"
                    isSelected={value === "CODE"}
                    onPress={() => onChange("CODE")}
                    colors={colors}
                  />
                  <SelectionButton
                    label="Auto Discount"
                    isSelected={value === "DISCOUNT"}
                    onPress={() => onChange("DISCOUNT")}
                    colors={colors}
                  />
                </View>
              )}
            />
            <ThemedText style={styles.helperText}>
              {watch("application_method") === "CODE"
                ? "Customers enter this code at checkout"
                : "Automatically applied to eligible orders"}
            </ThemedText>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionDivider} />
            <ControlledInput<FormValues>
              name="name"
              control={control}
              label="Promotion Name"
              required
              rules={{ required: "Promotion name is required" }}
              inputProps={{
                placeholder: "e.g., Summer Sale 2024",
              }}
            />

            <ControlledInput<FormValues>
              name="code"
              control={control}
              label="Promotion Code"
              required
              rules={{
                required: "Code is required",
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: "Code must be uppercase letters/numbers only",
                },
              }}
              inputProps={{
                placeholder: "e.g., SUMMER50",
                autoCapitalize: "characters",
              }}
            />
          </View>

          {/* Discount Value Section */}
          <View style={styles.section}>
            <View style={styles.sectionDivider} />
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <ThemedDropdown
                  label="Discount Type"
                  value={value}
                  onSelect={onChange}
                  options={discountTypeOptions}
                />
              )}
            />

            {/* Dynamic Value Input */}
            <View style={styles.valueInputWrapper}>
              {selectedType === "PERCENTAGE" ? (
                <ControlledInput<FormValues>
                  name="percent_off"
                  control={control}
                  label="Percentage Value"
                  required
                  rules={{
                    required: "Percentage is required",
                    min: {
                      value: 1,
                      message: "Must be at least 1%",
                    },
                    max: {
                      value: 100,
                      message: "Cannot exceed 100%",
                    },
                  }}
                  inputProps={{
                    placeholder: "e.g., 20",
                    keyboardType: "numeric",
                  }}
                />
              ) : selectedType === "FIXED" ? (
                <ControlledInput<FormValues>
                  name="flat_amount"
                  control={control}
                  label="Fixed Amount"
                  required
                  rules={{
                    required: "Amount is required",
                    min: {
                      value: 1,
                      message: "Must be at least ₹1",
                    },
                  }}
                  inputProps={{
                    placeholder: "e.g., 100",
                    keyboardType: "numeric",
                  }}
                />
              ) : null}

              {/* Bundle selection UI */}
              {selectedType === "BUNDLE" && (
                <View style={{ marginTop: 8, gap: 8 }}>
                  <Controller
                    control={control}
                    name="promotion_bundle_id"
                    render={({ field: { onChange, value } }) => (
                      <ThemedDropdown
                        label="Select Bundle"
                        value={value}
                        onSelect={onChange}
                        options={bundleOptions}
                        placeholder={
                          bundlesLoading ? "Loading..." : "Choose a bundle"
                        }
                      />
                    )}
                  />

                  {selectedBundleId && bundles && (
                    <View style={styles.selectedItemsList}>
                      {bundles
                        .find((b: any) => b.id === selectedBundleId)
                        ?.items.map((it: any) => (
                          <View
                            key={it.item_id}
                            style={[
                              styles.selectedItemChip,
                              { backgroundColor: colors.backgroundElevated },
                            ]}
                          >
                            <View style={styles.selectedItemInfo}>
                              <ThemedText style={styles.selectedItemName}>
                                {it.name}
                              </ThemedText>
                              <ThemedText style={styles.selectedItemPrice}>
                                ₹{it.price} • Qty: {it.quantity}
                              </ThemedText>
                            </View>
                          </View>
                        ))}
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => router.push("/(manager)/createBundle")}
                    style={[
                      styles.createBundleButton,
                      { borderColor: colors.borderLight },
                    ]}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      style={[
                        styles.createBundleText,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Create Bundle
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Validity Period Section */}
          <View style={styles.section}>
            <View style={styles.sectionDivider} />
            <CreatePromotionFieldTitle text="Validity Period" />

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

            <ThemedText style={styles.helperText}>
              Leave end date empty for no expiration
            </ThemedText>
          </View>

          {/* Conditions Section */}
          <View style={styles.section}>
            <View style={styles.sectionDivider} />
            <CreatePromotionFieldTitle text="Conditions (Optional)" />

            {/* Required Items */}
            <View>
              <ThemedText style={styles.label}>Required Items</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  { borderColor: colors.borderLight },
                ]}
                onPress={() => setIsMenuSelectorVisible(true)}
              >
                <ThemedText
                  style={[
                    styles.selectorText,
                    {
                      color:
                        selectedItemIds.length > 0
                          ? colors.textPrimary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {selectedItemIds.length > 0
                    ? `${selectedItemIds.length} item${selectedItemIds.length > 1 ? "s" : ""} selected`
                    : "Select items"}
                </ThemedText>
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>

              {/* Selected Items List */}
              {getSelectedItems().length > 0 && (
                <View style={styles.selectedItemsList}>
                  {getSelectedItems().map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.selectedItemChip,
                        { backgroundColor: colors.backgroundElevated },
                      ]}
                    >
                      <View style={styles.selectedItemInfo}>
                        <ThemedText style={styles.selectedItemName}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={styles.selectedItemPrice}>
                          ₹{item.price}
                        </ThemedText>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        style={styles.removeButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#D32F2F"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <ThemedText style={styles.helperText}>
                Select items required in cart for promotion to apply
              </ThemedText>
            </View>

            {/* Min Order Value */}
            <ControlledInput<FormValues>
              name="conditions.min_order_value"
              control={control}
              label="Minimum Order Value (Optional)"
              inputProps={{
                placeholder: "e.g., 500",
                keyboardType: "numeric",
              }}
            />
            <ThemedText style={styles.helperText}>
              Minimum cart value required for this promotion
            </ThemedText>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: Math.max(16, insets.bottom),
            backgroundColor: colors.backgroundElevated,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
          style={[
            styles.submitButton,
            {
              backgroundColor:
                isValid && !createMutation.isPending
                  ? "#D32F2F"
                  : colors.borderLight,
            },
          ]}
          activeOpacity={0.8}
        >
          <ThemedText
            style={[
              styles.buttonText,
              {
                color:
                  isValid && !createMutation.isPending
                    ? "white"
                    : colors.textSecondary,
              },
            ]}
          >
            {createMutation.isPending ? "Creating..." : "Create Promotion"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Menu Item Selector Modal */}
      <MenuItemSelector
        visible={isMenuSelectorVisible}
        onClose={() => setIsMenuSelectorVisible(false)}
        selectedIds={selectedItemIds}
        onConfirm={(ids) => setValue("conditions.required_item_ids", ids)}
      />
    </View>
  );
};

export default CreatePromotionForm;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  formContentContainer: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  valueInputWrapper: {
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
    marginTop: -8,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
    minHeight: 56,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  selectedItemsList: {
    marginTop: 12,
    gap: 8,
  },
  selectedItemChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  selectedItemPrice: {
    fontSize: 13,
    opacity: 0.6,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  createBundleButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  createBundleText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
