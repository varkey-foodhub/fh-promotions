import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {};

const HomePage = (props: Props) => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Text>HomePage</Text>
      <TouchableOpacity
        onPress={() => {
          router.navigate("/(manager)");
        }}
      >
        <Text>Manage Restaurant</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.navigate("/(menu)");
        }}
      >
        <Text>View Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({});
