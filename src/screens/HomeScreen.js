import React, { useContext } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import { trending, netflixOriginals, actionMovies } from "../data/movies";
import { WatchHistoryContext } from "../context/WatchHistoryContext";

export default function HomeScreen({ navigation }) {
  const { addToHistory } = useContext(WatchHistoryContext);

  // ✅ Add movie to history and navigate to details
  const handleMoviePress = (movie) => {
    addToHistory({
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      watchedAt: Date.now(),
    });

    navigation.navigate("Details", { movie });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0D0D0D" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Banner />
        <MovieRow
          title="🔥 Trending Now"
          data={trending}
          onMoviePress={handleMoviePress}
        />
        <MovieRow
          title="🎬 Netflix Originals"
          data={netflixOriginals}
          onMoviePress={handleMoviePress}
        />
        <MovieRow
          title="⚡ Action Movies"
          data={actionMovies}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  scrollContent: { paddingBottom: 100 },
});
