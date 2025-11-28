import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";
import { useNavigation } from "@react-navigation/native";
import { WatchHistoryContext } from "../context/WatchHistoryContext";

export default function MovieRow({ title, data }) {
  const navigation = useNavigation();
  const { addToHistory } = useContext(WatchHistoryContext);

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.title}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {data.map((item, index) => (
          <MovieCard
            key={item.id || index}   // ⭐ FIX: action movies that have no ID
            poster={item.poster}
            onPress={async () => {
              await addToHistory({
                id: item.id || `action-${index}`,   // ⭐ FIX: unique fallback ID
                title: item.title,
                poster: item.poster,
                watchedAt: Date.now(),
              });

              navigation.navigate("Details", { movie: item });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    marginBottom: 28,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingLeft: 10,
  },
});
