import { StyleSheet, Text, type TextProps } from "react-native";

// 1. Import your hook
import { useThemeColor } from "@/src/hooks/useThemeColors";

// 2. Define custom props
export type ThemedTextProps = TextProps & {
  variant?: "default" | "title" | "subtitle" | "caption" | "link";
};

export function ThemedText({
  style,
  variant = "default",
  ...rest
}: ThemedTextProps) {
  // 3. Get the current theme colors automatically
  const colors = useThemeColor();

  // 4. Determine the text color based on the variant
  // (Links are usually blue/tinted; Captions are usually gray)
  let textColor = colors.textPrimary;

  if (variant === "link") {
    textColor = colors.primary;
  } else if (variant === "caption") {
    textColor = colors.textSecondary;
  }

  return (
    <Text
      style={[
        // Base styles (color + typography)
        { color: textColor },
        variant === "default" && styles.default,
        variant === "title" && styles.title,
        variant === "subtitle" && styles.subtitle,
        variant === "caption" && styles.caption,
        variant === "link" && styles.link,
        // Allow overriding via the standard style prop
        style,
      ]}
      {...rest}
    />
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
