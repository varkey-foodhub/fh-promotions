import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const PaginationFooter = () => {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <ThemedText
        variant="caption"
        style={{ color: colors.textLight, marginBottom: 12 }}
      >
        Showing 1 to 4 of 4 Promotions
      </ThemedText>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.backgroundElevated }]}
        >
          <ThemedText variant="caption" style={{ color: colors.textLight }}>
            Previous
          </ThemedText>
        </TouchableOpacity>

        {/* Active Page */}
        <View style={[styles.pageNumber, { backgroundColor: colors.accentCO }]}>
          <ThemedText
            variant="caption"
            style={{ color: colors.textInverse, fontWeight: "bold" }}
          >
            1
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.backgroundElevated }]}
        >
          <ThemedText variant="caption" style={{ color: colors.textLight }}>
            Next
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  pageNumber: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
