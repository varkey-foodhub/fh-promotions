import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
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
import { PromotionCard } from "./PromotionCard";

import { useRouter } from "expo-router";
import { Promotion } from "../promotions.types";
// Hooks & Utils
import { useDebounce } from "../hooks/useDebounce";
import {
  useActivePromotions,
  useDeletePromotion,
  useExpiredPromotions,
} from "../promotions.queries";
import { fuzzySearch } from "../utils/search";
const PromotionsPage = () => {
  const colors = useThemeColor();
  const router = useRouter();
  const deleteMutation = useDeletePromotion();

  // --- State ---
  const [expiredPage, setExpiredPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // "ACTIVE" | "EXPIRED" | null
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const expiredPageLimit = 5;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // --- Data Fetching ---
  const { data: activeData, isLoading: activeLoading } = useActivePromotions();

  const { data: expiredData, isLoading: expiredLoading } = useExpiredPromotions(
    expiredPage,
    expiredPageLimit,
  );

  const activePromos = activeData?.data || [];
  const expiredPromos = expiredData?.data || [];

  // Combine for calculating available types dynamically
  const allPromos = useMemo(
    () => [...activePromos, ...expiredPromos],
    [activePromos, expiredPromos],
  );

  // Derive available types from ALL data (so the dropdown isn't empty if we filter one side)
  const availableTypes = useMemo(() => {
    return Array.from(new Set(allPromos.map((p) => p.type)));
  }, [allPromos]);

  // --- Unified Filter Logic ---
  const getFilteredList = (list: Promotion[]) => {
    let result = list;

    // 1. Filter by Type
    if (typeFilter) {
      result = result.filter((p) => p.type === typeFilter);
    }

    // 2. Filter by Search (Name or Code)
    if (debouncedSearchQuery.trim()) {
      result = fuzzySearch(debouncedSearchQuery, result, ["name", "code"]);
    }

    return result;
  };

  // Apply common filters (Type & Search) first
  const displayActive = useMemo(
    () => getFilteredList(activePromos),
    [activePromos, typeFilter, debouncedSearchQuery],
  );
  const displayExpired = useMemo(
    () => getFilteredList(expiredPromos),
    [expiredPromos, typeFilter, debouncedSearchQuery],
  );

  // Determine visibility based on Status Filter
  const showActiveSection = statusFilter === null || statusFilter === "ACTIVE";
  const showExpiredSection =
    statusFilter === null || statusFilter === "EXPIRED";

  // --- Handlers ---
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    console.log("Delete", id);
  };

  const handleToggle = (id: number, val: boolean) => {
    // Implement toggle mutation here
    console.log("Toggle", id, val);
  };

  const handler = {
    navigateBack: () => {
      router.dismissAll();
      router.replace("/");
    },
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      edges={["top"]}
    >
      <View style={styles.contentContainer}>
        {/* --- Header --- */}
        <View style={styles.headerContainer}>
          <View>
            <View
              style={[
                styles.header,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <TouchableOpacity onPress={handler.navigateBack}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <ThemedText
                variant="title"
                style={{ fontSize: 20, color: "#471913" }}
              >
                BorgirKing
              </ThemedText>
              <View style={{ width: 24 }} />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.createButton,
                { backgroundColor: colors.actionPrimary },
              ]}
            >
              <ThemedText
                variant="subtitle"
                style={{ color: colors.textInverse }}
              >
                + Create New Promotion
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* --- Filter Bar --- */}
          <View
            style={[
              styles.filterCard,
              { backgroundColor: colors.backgroundElevated },
            ]}
          >
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              availableTypes={availableTypes}
            />
          </View>
        </View>

        {/* --- Scrollable Content --- */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Active Section */}
          {showActiveSection && (
            <View style={styles.section}>
              <ThemedText variant="caption" style={styles.sectionHeader}>
                ACTIVE {activeLoading ? "..." : `(${displayActive.length})`}
              </ThemedText>

              {activeLoading && <ActivityIndicator color={colors.accentCO} />}

              {!activeLoading && displayActive.length === 0 && (
                <ThemedText style={styles.emptyText}>
                  {searchQuery || typeFilter
                    ? "No active promotions match your filters."
                    : "No active promotions found."}
                </ThemedText>
              )}

              {displayActive.map((item) => (
                <PromotionCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onToggleActive={handleToggle}
                />
              ))}
            </View>
          )}

          {/* 2. Expired Section */}
          {showExpiredSection && (
            <View style={styles.section}>
              <ThemedText variant="caption" style={styles.sectionHeader}>
                EXPIRED {expiredLoading ? "..." : `(${displayExpired.length})`}
              </ThemedText>

              {expiredLoading && <ActivityIndicator color={colors.accentCO} />}

              {!expiredLoading && displayExpired.length === 0 && (
                <ThemedText style={styles.emptyText}>
                  {searchQuery || typeFilter
                    ? "No expired promotions match your filters."
                    : "No expired promotions found."}
                </ThemedText>
              )}

              {displayExpired.map((item) => (
                <PromotionCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onToggleActive={handleToggle}
                />
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PromotionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterCard: {
    padding: 12,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontWeight: "700",
    opacity: 0.5,
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 1,
  },
  emptyText: {
    opacity: 0.5,
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 10,
  },
});
