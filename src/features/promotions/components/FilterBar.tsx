import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const FilterBar = ({
  searchQuery = "",
  onSearchChange,
}: FilterBarProps) => {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      {/* 1. Dropdowns Row */}
      <View style={styles.row}>
        {/* Mock Dropdown: Status */}
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.backgroundElevated,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <ThemedText variant="caption">Filter by Status</ThemedText>
          <Ionicons name="chevron-down" size={16} color={colors.textLight} />
        </TouchableOpacity>

        {/* Mock Dropdown: Type */}
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.backgroundElevated,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <ThemedText variant="caption">Filter by Type</ThemedText>
          <Ionicons name="chevron-down" size={16} color={colors.textLight} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  dropdown: {
    flex: 1, // Equal width
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
