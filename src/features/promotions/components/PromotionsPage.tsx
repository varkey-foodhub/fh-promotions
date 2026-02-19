import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Components
import { FilterBar } from "./FilterBar";
import { PromotionCard } from "./PromotionCard";

import { useFocusEffect, useRouter } from "expo-router";
import { Promotion } from "../promotions.types";
// Hooks & Utils
import { useDebounce } from "../hooks/useDebounce";
import {
  useActivePromotions,
  useDeletePromotion,
  useExpiredPromotions,
  useTogglePromotion,
} from "../promotions.queries";
import { fuzzySearch } from "../utils/search";

const PromotionsPage = () => {
  const colors = useThemeColor();
  const router = useRouter();
  const deleteMutation = useDeletePromotion();
  const toggleMutation = useTogglePromotion();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  // --- State ---
  const [expiredPage, setExpiredPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const expiredPageLimit = 5;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // --- Data Fetching ---
  const {
    data: activeData,
    isLoading: activeLoading,
    refetch: refetchActive,
  } = useActivePromotions();

  const {
    data: expiredData,
    isLoading: expiredLoading,
    refetch: refetchExpired,
  } = useExpiredPromotions(expiredPage, expiredPageLimit);

  const activePromos = activeData?.data || [];
  const expiredPromos = expiredData?.data || [];
  const refetchAll = async () => {
    await Promise.all([refetchActive(), refetchExpired()]);
  };

  useFocusEffect(
    useCallback(() => {
      refetchAll();
    }, []),
  );

  const allPromos = useMemo(
    () => [...activePromos, ...expiredPromos],
    [activePromos, expiredPromos],
  );

  const availableTypes = useMemo(() => {
    return Array.from(new Set(allPromos.map((p) => p.type)));
  }, [allPromos]);

  // --- Unified Filter Logic ---
  const getFilteredList = (list: Promotion[]) => {
    let result = list;

    if (typeFilter) {
      result = result.filter((p) => p.type === typeFilter);
    }

    if (debouncedSearchQuery.trim()) {
      result = fuzzySearch(debouncedSearchQuery, result, ["name", "code"]);
    }

    return result;
  };

  const displayActive = useMemo(
    () => getFilteredList(activePromos),
    [activePromos, typeFilter, debouncedSearchQuery],
  );
  const displayExpired = useMemo(
    () => getFilteredList(expiredPromos),
    [expiredPromos, typeFilter, debouncedSearchQuery],
  );

  const showActiveSection = statusFilter === null || statusFilter === "ACTIVE";
  const showExpiredSection =
    statusFilter === null || statusFilter === "EXPIRED";

  // --- Handlers ---
  const handleToggle = (id: number, val: boolean) => {
    toggleMutation.mutate({ id, active: val });
  };

  const handler = {
    navigateBack: () => {
      router.dismissAll();
      router.replace("/");
    },
    navigateToCreatePromotions: () => {
      router.navigate("/(manager)/createPromotion");
    },
    handleDelete: (id: number) => {
      deleteMutation.mutate(id);
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with Gradient Background */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#D32F2F", "#C62828"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Back Button & Title */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handler.navigateBack}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText variant="title" style={styles.headerTitle}>
              BorgirKing
            </ThemedText>
            <View style={{ width: 24 }} />
          </View>

          {/* Create Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.createButton}
            onPress={handler.navigateToCreatePromotions}
          >
            <Ionicons name="add-circle-outline" size={20} color="#D32F2F" />
            <ThemedText variant="subtitle" style={styles.createButtonText}>
              Create New Promotion
            </ThemedText>
          </TouchableOpacity>
        </LinearGradient>

        {/* Filter Card - Outside gradient, overlapping */}
        <View style={styles.filterCardContainer}>
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
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.sectionsWrapper,
            isDesktop && styles.sectionsWrapperDesktop,
          ]}
        >
          {/* Active Section */}
          {showActiveSection && (
            <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <View
                    style={[
                      styles.sectionIndicator,
                      { backgroundColor: colors.actionPositive },
                    ]}
                  />
                  <ThemedText variant="caption" style={styles.sectionTitle}>
                    ACTIVE PROMOTIONS
                  </ThemedText>
                </View>
                {!activeLoading && (
                  <View
                    style={[
                      styles.countBadge,
                      { backgroundColor: colors.actionPositive + "20" },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.countText,
                        { color: colors.actionPositive },
                      ]}
                    >
                      {displayActive.length}
                    </ThemedText>
                  </View>
                )}
              </View>

              {activeLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#D32F2F" />
                </View>
              )}

              {!activeLoading && displayActive.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="pricetag-outline"
                    size={48}
                    color={colors.textSecondary}
                    style={{ opacity: 0.3 }}
                  />
                  <ThemedText style={styles.emptyText}>
                    {searchQuery || typeFilter
                      ? "No active promotions match your filters"
                      : "No active promotions yet"}
                  </ThemedText>
                  <ThemedText style={styles.emptySubtext}>
                    {!searchQuery && !typeFilter && "Create one to get started"}
                  </ThemedText>
                </View>
              )}

              <View style={styles.cardsContainer}>
                {displayActive.map((item) => (
                  <PromotionCard
                    key={item.id}
                    item={item}
                    onDelete={handler.handleDelete}
                    onToggleActive={handleToggle}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Expired Section */}
          {showExpiredSection && (
            <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <View
                    style={[
                      styles.sectionIndicator,
                      { backgroundColor: colors.textSecondary },
                    ]}
                  />
                  <ThemedText variant="caption" style={styles.sectionTitle}>
                    EXPIRED PROMOTIONS
                  </ThemedText>
                </View>
                {!expiredLoading && (
                  <View
                    style={[
                      styles.countBadge,
                      { backgroundColor: colors.textSecondary + "20" },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.countText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {displayExpired.length}
                    </ThemedText>
                  </View>
                )}
              </View>

              {expiredLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={colors.textSecondary}
                  />
                </View>
              )}

              {!expiredLoading && displayExpired.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="time-outline"
                    size={48}
                    color={colors.textSecondary}
                    style={{ opacity: 0.3 }}
                  />
                  <ThemedText style={styles.emptyText}>
                    {searchQuery || typeFilter
                      ? "No expired promotions match your filters"
                      : "No expired promotions"}
                  </ThemedText>
                </View>
              )}

              <View style={styles.cardsContainer}>
                {displayExpired.map((item) => (
                  <PromotionCard
                    key={item.id}
                    item={item}
                    onDelete={handler.handleDelete}
                    onToggleActive={handleToggle}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PromotionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerWrapper: {
    position: "relative",
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 200, // Extra space for overlapping filter card
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "600",
  },
  filterCardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    transform: [{ translateY: 40 }], // Overlap effect
    marginBottom: 40,
  },
  filterCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60, // Account for overlapping filter card
  },
  sectionsWrapper: {
    gap: 24,
  },
  sectionsWrapperDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionDesktop: {
    flex: 1,
    marginBottom: 0,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
  },
  cardsContainer: {
    gap: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.4,
    textAlign: "center",
  },
});
