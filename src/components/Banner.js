import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { trending } from "../data/movies";

const { width } = Dimensions.get("window");

export default function Banner() {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Extract trending poster images
  const bannerImages = trending.map((item) => item.poster);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % bannerImages.length;

        scrollRef.current?.scrollTo({
          x: next * width,
          animated: true,
        });

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ width: "100%", height: 330 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {bannerImages.map((uri, i) => (
          <View key={`banner-${i}`} style={{ width }}>
            <ImageBackground source={{ uri }} style={styles.banner}>
              <View style={styles.overlay} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Trending Now</Text>
                <Text style={styles.subtitle}>Watch the Latest Hits</Text>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 330,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  textContainer: {
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 5,
  },
});
