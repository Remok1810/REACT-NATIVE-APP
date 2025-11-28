import React, { useContext, useCallback, useState } from "react";
import { FlatList, View, Text, Image, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WatchHistoryContext } from "../context/WatchHistoryContext";

export default function HistoryScreen() {
  const { history, refreshHistory } = useContext(WatchHistoryContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshHistory();
    setRefreshing(false);
  }, [refreshHistory]);

  const renderItem = ({ item }) => (
    <View style={styles.movieItem}>
      <Image source={{ uri: item.poster }} style={styles.poster} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        {/* Netflix-style red timing */}
        <Text style={styles.timeText}>
          Watched on: {new Date(item.watchedAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>
          You haven't watched any movies yet.
        </Text>
      ) : (
        <FlatList
          data={history} // SHOW ALL HISTORY
          keyExtractor={(item, index) => `${item.id}-${item.watchedAt}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },

  listContainer: { padding: 15 },

  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 12,
  },

  poster: { width: 100, height: 150, borderRadius: 8, marginRight: 20 },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  timeText: {
    color: "#E50914", // Netflix red
    fontSize: 16,
    marginTop: 5,
  },

  emptyText: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
    marginTop: 50,
  },
});
