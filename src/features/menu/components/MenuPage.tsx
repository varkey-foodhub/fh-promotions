import { useThemeColor } from "@/src/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
        <TouchableOpacity onPress={() => router.back()}>
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
        renderItem={({ item }) => <MenuItemCard item={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
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
