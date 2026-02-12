import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ReactNode } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  variant?: "default" | "title" | "subtitle" | "caption" | "link";
  children?: ReactNode;
};

export function ThemedText({
  style,
  variant = "default",
  children,
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColor();

  let textColor = colors.textPrimary;

  if (variant === "caption") {
    textColor = colors.textSecondary;
  }

  return (
    <Text
      style={[
        { color: textColor },
        variant === "default" && styles.default,
        variant === "title" && styles.title,
        variant === "subtitle" && styles.subtitle,
        variant === "caption" && styles.caption,
        variant === "link" && styles.link,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

// 5. Define your Typography System here
// This ensures all your fonts match across the app
const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
