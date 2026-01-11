import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2665&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay Gradient/Shadow effect - simplified with backgroundColor opacity for now */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.title}>
            HEAR AND{'\n'}EXPAND{'\n'}YOUR{'\n'}MIND
          </Text>
        </View>

        <View style={styles.spacer} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Subscription Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleItemActive}>
              <Text style={styles.toggleTextActive}>1 Week free</Text>
            </View>
            <View style={styles.toggleItemInactive}>
              <Text style={styles.toggleTextInactive}>Month</Text>
            </View>
          </View>

          {/* Start Button */}
          <Pressable
            style={styles.startButton}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.startButtonText}>Start Reading</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Slight dark overlay for text readability if needed
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.9,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
    textTransform: 'uppercase',
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    padding: 4,
    width: 200,
  },
  toggleItemActive: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 26,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleItemInactive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextInactive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
