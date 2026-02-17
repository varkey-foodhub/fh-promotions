import { useThemeColor } from "@/src/hooks/useThemeColors";
import { axiosInstance } from "@/src/lib/axios";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMenu } from "../../menu/menu.queries";
type SelectedItem = {
  item_id: number;
  name: string;
  quantity: number;
};

const CreateBundlePage = () => {
  const colors = useThemeColor();
  const router = useRouter();

  const { data, isLoading } = useMenu();
  const menuItems = data || [];

  const [bundleName, setBundleName] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Add / Remove Menu Items
  const toggleItem = (item: any) => {
    const exists = selectedItems.find((i) => i.item_id === item.id);

    if (exists) {
      setSelectedItems((prev) => prev.filter((i) => i.item_id !== item.id));
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { item_id: item.id, name: item.name, quantity: 1 },
      ]);
    }
  };
  const handleCreateBundle = async () => {
    axiosInstance
      .post("/promotions/bundle", {
        name: bundleName,
        items: selectedItems,
      })
      .then(() => {
        Toast.show({ type: "success", text1: "Created bundle" });
        router.back();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const updateQuantity = (id: number, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.item_id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const totalItemsSelected = useMemo(
    () => selectedItems.length,
    [selectedItems],
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      {/* HEADER */}
      <LinearGradient
        colors={["#D32F2F", "#C62828"]}
        style={styles.headerGradient}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <ThemedText style={styles.headerTitle}>Create Bundle</ThemedText>

          <View style={{ width: 40 }} />
        </View>

        {/* Bundle Name Input */}
        <View
          style={[
            styles.nameInputCard,
            { backgroundColor: colors.backgroundElevated },
          ]}
        >
          <TextInput
            placeholder="Enter Bundle Name"
            placeholderTextColor={colors.textSecondary}
            value={bundleName}
            onChangeText={setBundleName}
            style={[styles.nameInput, { color: colors.textPrimary }]}
          />
        </View>
      </LinearGradient>

      {/* BODY */}
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.sectionIndicator,
              { backgroundColor: colors.actionPrimary },
            ]}
          />
          <ThemedText style={styles.sectionTitle}>
            SELECT ITEMS ({totalItemsSelected})
          </ThemedText>
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.actionPrimary}
            style={{ marginTop: 40 }}
          />
        )}

        {!isLoading &&
          menuItems.map((item: any) => {
            const selected = selectedItems.find((i) => i.item_id === item.id);

            return (
              <View
                key={item.id}
                style={[
                  styles.menuCard,
                  { backgroundColor: colors.backgroundElevated },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.menuName}>{item.name}</ThemedText>
                  <ThemedText style={styles.menuPrice}>
                    ₹{item.price}
                  </ThemedText>
                </View>

                {!selected ? (
                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      { backgroundColor: colors.actionPrimary },
                    ]}
                    onPress={() => toggleItem(item)}
                  >
                    <Ionicons name="add" size={18} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="remove" size={16} />
                    </TouchableOpacity>

                    <ThemedText style={styles.qtyText}>
                      {selected.quantity}
                    </ThemedText>

                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="add" size={16} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FOOTER SAVE BUTTON */}
      <View
        style={[styles.footer, { backgroundColor: colors.backgroundElevated }]}
      >
        <TouchableOpacity
          disabled={!bundleName || selectedItems.length === 0}
          style={[
            styles.saveButton,
            {
              backgroundColor:
                !bundleName || selectedItems.length === 0
                  ? colors.borderLight
                  : colors.actionPrimary,
            },
          ]}
        >
          <ThemedText
            onPress={handleCreateBundle}
            style={styles.saveButtonText}
          >
            CREATE BUNDLE
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateBundlePage;

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  nameInputCard: {
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    opacity: 0.7,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },
  menuName: {
    fontSize: 15,
    fontWeight: "600",
  },
  menuPrice: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#F0F0F0",
  },
  qtyText: {
    fontWeight: "700",
  },
  footer: {
    padding: 16,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
