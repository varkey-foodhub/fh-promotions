// hooks/useThemeColor.ts
import { Colors } from "@/src/constants/Colors";
import { useColorScheme } from "react-native";

export function useThemeColor() {
  const theme = useColorScheme() ?? "light";

  // Returns the object of colors for the current mode
  return Colors[theme];
}
