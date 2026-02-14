import { useMenu } from "@/src/features/menu/menu.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface MenuItemSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedIds: number[];
  onConfirm: (selectedIds: number[]) => void;
}

const MenuItemSelector: React.FC<MenuItemSelectorProps> = ({
  visible,
  onClose,
  selectedIds,
  onConfirm,
}) => {
  const colors = useThemeColor();
  const { data: menuItems, isLoading } = useMenu();
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(selectedIds);

  const handleToggleItem = (itemId: number) => {
    setTempSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedIds);
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      setTempSelectedIds(selectedIds);
    }
  }, [visible, selectedIds]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.backgroundElevated },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Select Required Items</ThemedText>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D32F2F" />
              <ThemedText style={styles.loadingText}>Loading menu...</ThemedText>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = tempSelectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.menuItem,
                      { borderColor: colors.borderLight },
                    ]}
                    onPress={() => handleToggleItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemInfo}>
                      <ThemedText style={styles.itemName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={styles.itemPrice}>
                        ₹{item.price}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: isSelected ? "#D32F2F" : colors.borderLight,
                          backgroundColor: isSelected ? "#D32F2F" : "transparent",
                        },
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { backgroundColor: colors.borderLight },
              ]}
              onPress={handleCancel}
            >
              <ThemedText style={{ color: colors.textSecondary }}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <ThemedText style={{ color: "white" }}>
                Confirm ({tempSelectedIds.length})
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MenuItemSelector;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    // backgroundColor set dynamically
  },
  confirmButton: {
    backgroundColor: "#D32F2F",
  },
});
