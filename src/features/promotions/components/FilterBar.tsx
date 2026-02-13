import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Types ---
interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string | null;
  onStatusChange: (value: string | null) => void;
  typeFilter: string | null;
  onTypeChange: (value: string | null) => void;
  availableTypes: string[];
}

interface SelectionOption {
  label: string;
  value: string | null;
}

// --- Reusable Modal Component ---
const SelectionModal = ({
  visible,
  onClose,
  title,
  options,
  onSelect,
  currentValue,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectionOption[];
  onSelect: (value: string | null) => void;
  currentValue: string | null;
  colors: any;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.backgroundElevated },
          ]}
        >
          <View style={styles.modalHeader}>
            <ThemedText variant="subtitle">{title}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => {
              const isSelected = item.value === currentValue;
              return (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.borderLight },
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <ThemedText
                    style={{
                      fontWeight: isSelected ? "bold" : "normal",
                      color: isSelected ? colors.tint : colors.textPrimary,
                    }}
                  >
                    {item.label}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={colors.tint} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

// --- Main Component ---
export const FilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  availableTypes,
}: FilterBarProps) => {
  const colors = useThemeColor();

  // Track which modal is open: 'STATUS' | 'TYPE' | null
  const [activeModal, setActiveModal] = useState<"STATUS" | "TYPE" | null>(
    null,
  );

  // 1. Prepare Status Options
  const statusOptions: SelectionOption[] = [
    { label: "All Statuses", value: null },
    { label: "Active", value: "ACTIVE" },
    { label: "Expired", value: "EXPIRED" },
  ];

  // 2. Prepare Type Options
  const typeOptions: SelectionOption[] = [
    { label: "All Types", value: null },
    ...availableTypes.map((t) => ({ label: t, value: t })),
  ];

  // Helper to get display label for buttons
  const getLabel = (
    value: string | null,
    options: SelectionOption[],
    defaultLabel: string,
  ) => {
    if (!value) return defaultLabel;
    const found = options.find((o) => o.value === value);
    return found ? found.label : defaultLabel;
  };

  return (
    <View style={styles.container}>
      {/* 1. Dropdowns Row */}
      <View style={styles.row}>
        {/* Status Dropdown Trigger */}
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.backgroundElevated,
              borderColor: statusFilter
                ? colors.borderAccentCM
                : colors.borderLight,
            },
          ]}
          onPress={() => setActiveModal("STATUS")}
        >
          <ThemedText
            variant="caption"
            style={{
              color: statusFilter ? colors.borderAccentCM : colors.textPrimary,
            }}
          >
            {getLabel(statusFilter, statusOptions, "Filter by Status")}
          </ThemedText>
          <Ionicons
            name="chevron-down"
            size={16}
            color={statusFilter ? colors.borderAccentCM : colors.textLight}
          />
        </TouchableOpacity>

        {/* Type Dropdown Trigger */}
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.backgroundElevated,
              borderColor: typeFilter
                ? colors.borderAccentCM
                : colors.borderLight,
            },
          ]}
          onPress={() => setActiveModal("TYPE")}
        >
          <ThemedText
            variant="caption"
            style={{
              color: typeFilter ? colors.borderAccentCM : colors.textPrimary,
            }}
          >
            {getLabel(typeFilter, typeOptions, "Filter by Type")}
          </ThemedText>
          <Ionicons
            name="chevron-down"
            size={16}
            color={typeFilter ? colors.borderAccentCM : colors.textLight}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by name or code..."
          placeholderTextColor={colors.textLight}
          style={[styles.input, { color: colors.textPrimary }]}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange?.("")}>
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* --- Modals --- */}

      {/* Status Modal */}
      <SelectionModal
        visible={activeModal === "STATUS"}
        onClose={() => setActiveModal(null)}
        title="Select Status"
        options={statusOptions}
        onSelect={onStatusChange}
        currentValue={statusFilter}
        colors={colors}
      />

      {/* Type Modal */}
      <SelectionModal
        visible={activeModal === "TYPE"}
        onClose={() => setActiveModal(null)}
        title="Select Type"
        options={typeOptions}
        onSelect={onTypeChange}
        currentValue={typeFilter}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    zIndex: 1, // Ensure dropdowns stay accessible if context requires
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  dropdown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12, // Increased slightly for touch target
    borderRadius: 8,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    height: 44, // Fixed height for consistency
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 12,
    padding: 16,
    maxHeight: "60%",
    // Shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  optionItem: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
