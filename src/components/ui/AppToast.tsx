import { useThemeColor } from "@/src/hooks/useThemeColors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AppToastConfig = () => {
  const colors = useThemeColor();

  return {
    success: (props: any) => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.backgroundElevated,
            borderLeftColor: colors.actionPrimary,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {props.text2}
          </Text>
        )}
      </View>
    ),

    error: (props: any) => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.backgroundElevated,
            borderLeftColor: "#ff4d4f",
          },
        ]}
      >
        <Text style={[styles.title, { color: "#ff4d4f" }]}>{props.text1}</Text>
        {props.text2 && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {props.text2}
          </Text>
        )}
      </View>
    ),

    info: (props: any) => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.backgroundElevated,
            borderLeftColor: colors.accentCO,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {props.text2}
          </Text>
        )}
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    width: "92%",
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    fontSize: 13,
    marginTop: 4,
  },
});
