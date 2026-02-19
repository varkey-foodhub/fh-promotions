import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useMarkBackInStock,
  useMarkOutOfStock,
  useMenu,
} from "../menu.queries";
import { MenuItem } from "../menu.types";
import { MenuEditorItemCard } from "./MenuIEditortemCard";

const MenuEditorPage = () => {
  const { data, isLoading, error } = useMenu();
  const colors = useThemeColor();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Responsive columns — same pattern as MenuHomePage
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

  const { mutate: markOOS } = useMarkOutOfStock();
  const { mutate: markBIS } = useMarkBackInStock();

  const handler = {
    navigateBack: () => router.back(),
    toggleStock: (id: number, currentStatus: boolean) => {
      if (currentStatus) markBIS(id);
      else markOOS(id);
    },
  };

  if (isLoading) {
    return (
      <View
        style={[styles.center, { backgroundColor: colors.backgroundSecondary }]}
      >
        <ActivityIndicator size="large" color={colors.accentCO} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View
        style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}
      >
        <TouchableOpacity onPress={handler.navigateBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20, color: "#471913" }}>
          BorgirKing
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={data as MenuItem[]}
        keyExtractor={(item) => item.id.toString()}
        numColumns={columns}
        key={columns} // forces re-render when columns change
        columnWrapperStyle={isWeb ? styles.columnWrapperWeb : styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MenuEditorItemCard
            item={item}
            onToggleStock={handler.toggleStock}
            cardWidth={cardWidth}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MenuEditorPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  columnWrapperWeb: {
    justifyContent: "flex-start",
    gap: 16,
  },
});
