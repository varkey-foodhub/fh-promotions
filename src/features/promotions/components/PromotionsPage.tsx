import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { FilterBar } from "./FilterBar";
import { PaginationFooter } from "./PaginationFooter";
import { PromotionCard } from "./PromotionCard";

// API Hooks
import {
  useActivePromotions,
  useExpiredPromotions,
} from "../promotions.queries";

// Utils
import { useDebounce } from "../hooks/useDebounce";
import { fuzzySearch } from "../utils/search";

const PromotionsPage = () => {
  const colors = useThemeColor();
  const [expiredPage, setExpiredPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const expiredPageLimit = 5;

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch active promotions
  const {
    data: activeData,
    isLoading: activeLoading,
    error: activeError,
  } = useActivePromotions();

  // Fetch expired promotions with pagination
  const {
    data: expiredData,
    isLoading: expiredLoading,
    error: expiredError,
  } = useExpiredPromotions(expiredPage, expiredPageLimit);

  const activePromos = activeData?.data || [];
  const expiredPromos = expiredData?.data || [];
  const expiredPagination = expiredData?.pagination;

  // Fuzzy search on active promotions
  const filteredActivePromos = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return activePromos;
    return fuzzySearch(debouncedSearchQuery, activePromos, ["name", "code"]);
  }, [activePromos, debouncedSearchQuery]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Header & Title */}
        <ThemedText variant="title" style={styles.pageTitle}>
          Restaurant Dashboard
        </ThemedText>

        {/* 2. Main Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.createButton,
            { backgroundColor: colors.actionPrimary },
          ]}
        >
          <ThemedText variant="subtitle" style={{ color: colors.textInverse }}>
            + Create New Promotion
          </ThemedText>
        </TouchableOpacity>

        {/* 3. Filters */}
        <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* 4. Active Section */}
        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionHeader}>
            Active
            {activeLoading
              ? " (Loading...)"
              : `(${filteredActivePromos.length})`}
          </ThemedText>

          {activeLoading && (
            <ActivityIndicator size="large" color={colors.accentCO} />
          )}

          {activeError && (
            <ThemedText style={{ color: colors.textSecondary, marginTop: 12 }}>
              Error loading active promotions
            </ThemedText>
          )}

          {!activeLoading &&
            !activeError &&
            filteredActivePromos.length === 0 && (
              <ThemedText
                style={{ color: colors.textSecondary, marginTop: 12 }}
              >
                {searchQuery
                  ? "No active promotions match your search"
                  : "No active promotions"}
              </ThemedText>
            )}

          {filteredActivePromos.map((item) => (
            <PromotionCard key={item.id} item={item} onDelete={() => {}} />
          ))}
        </View>

        {/* 5. Expired Section */}
        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionHeader}>
            Expired Promotions
            {expiredLoading ? " (Loading...)" : `(${expiredPromos.length})`}
          </ThemedText>

          {expiredLoading && (
            <ActivityIndicator size="large" color={colors.accentCO} />
          )}

          {expiredError && (
            <ThemedText style={{ color: colors.textSecondary, marginTop: 12 }}>
              Error loading expired promotions
            </ThemedText>
          )}

          {!expiredLoading && !expiredError && expiredPromos.length === 0 && (
            <ThemedText style={{ color: colors.textSecondary, marginTop: 12 }}>
              No expired promotions
            </ThemedText>
          )}

          {expiredPromos.map((item) => (
            <PromotionCard key={item.id} item={item} onDelete={() => {}} />
          ))}

          {/* Pagination Controls */}
          {expiredPagination && expiredPagination.pages > 1 && (
            <View style={styles.paginationControls}>
              <TouchableOpacity
                onPress={() => setExpiredPage(Math.max(1, expiredPage - 1))}
                disabled={expiredPage === 1}
                style={[
                  styles.pageButton,
                  {
                    backgroundColor:
                      expiredPage === 1
                        ? colors.backgroundElevated
                        : colors.actionPrimary,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color:
                      expiredPage === 1
                        ? colors.textSecondary
                        : colors.textInverse,
                  }}
                >
                  Previous
                </ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.pageIndicator}>
                Page {expiredPage} of {expiredPagination.pages}
              </ThemedText>

              <TouchableOpacity
                onPress={() =>
                  setExpiredPage(
                    Math.min(expiredPagination.pages, expiredPage + 1),
                  )
                }
                disabled={expiredPage === expiredPagination.pages}
                style={[
                  styles.pageButton,
                  {
                    backgroundColor:
                      expiredPage === expiredPagination.pages
                        ? colors.backgroundElevated
                        : colors.actionPrimary,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color:
                      expiredPage === expiredPagination.pages
                        ? colors.textSecondary
                        : colors.textInverse,
                  }}
                >
                  Next
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 6. Footer */}
        <PaginationFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PromotionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  createButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    // Red button shadow
    shadowColor: "#D82927", // Hardcoded brand red for shadow or use colors.accentCO
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
    opacity: 0.8, // Slightly softer black for headers
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  pageIndicator: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
});
