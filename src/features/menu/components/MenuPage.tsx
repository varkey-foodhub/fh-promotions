import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMenu } from "../menu.queries";

const MenuHomePage = () => {
  const { data, isLoading, error } = useMenu();
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Something went wrong</Text>;
  return (
    <SafeAreaView>
      <View>
        <Text>MenuHomePage</Text>
      </View>
      <View>
        {data?.map((item: any) => (
          <Text key={item.id}>
            {item.name} - ₹{item.price}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default MenuHomePage;

const styles = StyleSheet.create({});
