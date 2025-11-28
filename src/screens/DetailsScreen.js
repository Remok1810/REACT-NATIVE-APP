import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function DetailsScreen({ route }) {
  const { movie } = route.params;

  const rating = movie.rating || 4;
  const stars = Array.from({ length: 5 }, (_, i) => (i < rating ? "★" : "☆")).join(" ");

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />

      <Text style={styles.title}>{movie.title || "Movie Title"}</Text>

      <Text style={styles.stars}>{stars}</Text>

      <Text style={styles.desc}>
        {movie.description || "This is a sample description for the movie. (Static Netflix UI)"}
      </Text>

      <TouchableOpacity style={styles.watchButton}>
        <Text style={styles.watchButtonText}>▶ Watch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  poster: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stars: {
    color: "#FFD700",
    fontSize: 20,
    marginBottom: 15,
  },
  desc: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  watchButton: {
    backgroundColor: "#E50914",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
