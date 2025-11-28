import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";

export default function MovieCard({ poster, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: poster }} style={styles.poster} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
  poster: {
    width: 130,
    height: 190,
    borderRadius: 10,
    backgroundColor: "#222",
  },
});
