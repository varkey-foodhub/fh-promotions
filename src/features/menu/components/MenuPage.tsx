import { useThemeColor } from "@/src/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMenu } from "../menu.queries";
import CartBar from "./user/CartBar";
import MenuItemCard from "./user/MenuItemCard";

const MenuHomePage = () => {
  const colors = useThemeColor();
  const router = useRouter();
  const { data, isLoading, error } = useMenu();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const columns = isWeb
    ? width >= 1400
      ? 8
      : width >= 1100
        ? 6
        : width >= 800
          ? 4
          : 3
    : 2;
  const gridGap = 16;
  const horizontalPadding = 32;
  const availableWidth = Math.max(
    0,
    width - horizontalPadding - gridGap * (columns - 1),
  );
  const cardWidth = isWeb ? Math.floor(availableWidth / columns) : undefined;

  const handler = {
    navigateToHome: () => {
      router.replace("/");
    },
  };
  if (isLoading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
      </SafeAreaView>
    );

  if (error)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Something went wrong</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      {/* 🔥 HEADER */}
      <View
        style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}
      >
        <TouchableOpacity onPress={handler.navigateToHome}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          FoodHub
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* 🔥 GRID LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MenuItemCard item={item} isWeb={isWeb} cardWidth={cardWidth} />
        )}
        numColumns={columns}
        columnWrapperStyle={
          isWeb ? styles.columnWrapperWeb : styles.columnWrapper
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <CartBar />
    </SafeAreaView>
  );
};

export default MenuHomePage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: 16,
    paddingBottom: 140,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  columnWrapperWeb: {
    justifyContent: "flex-start",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
