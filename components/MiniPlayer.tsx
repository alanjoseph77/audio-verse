import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAudio } from '../context/AudioContext';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
    const router = useRouter();
    const { currentTrack, isPlaying, togglePlayPause } = useAudio();

    // If no track is loaded, don't show the player
    if (!currentTrack) return null;

    return (
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.container}>
            <Pressable style={styles.contentClickable} onPress={() => router.push('/player')}>
                <View style={styles.innerContainer}>
                    {/* Album Art */}
                    <View style={styles.albumArtWrapper}>
                        <Image
                            source={currentTrack.image}
                            style={styles.albumArt}
                        />
                    </View>

                    {/* Track Info */}
                    <View style={styles.trackInfo}>
                        <Pressable onPress={(e) => { e.stopPropagation(); router.push({ pathname: '/artist-profile', params: { artist: currentTrack.artist } }); }}>
                            <Text style={styles.trackTitle}>{currentTrack.artist}</Text>
                        </Pressable>
                        <Text style={styles.trackSubtitle} numberOfLines={2}>
                            {currentTrack.title}
                        </Text>
                        <View style={styles.metaRow}>
                            <Ionicons name="heart" size={12} color="#FF69B4" />
                            <Text style={styles.metaText}>235</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        <Ionicons name="lock-closed-outline" size={16} color="#aaa" style={{ marginRight: 12 }} />
                        <Pressable style={styles.playButton} onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}>
                            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#000" style={{ marginLeft: isPlaying ? 0 : 2 }} />
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30, // Floating above bottom edge
        left: 20,
        right: 20,
        backgroundColor: '#222',
        borderRadius: 32,
        padding: 6, // Padding around the inner content
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    contentClickable: {
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    albumArtWrapper: {
        width: 80,
        height: 80,
        borderRadius: 26,
        overflow: 'hidden',
        marginRight: 16,
        position: 'relative',
        top: -6,
    },
    albumArt: {
        width: '100%',
        height: '100%',
    },
    trackInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    trackTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 2,
    },
    trackSubtitle: {
        color: '#ccc',
        fontSize: 10,
        lineHeight: 14,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#ccc',
        fontSize: 10,
        marginLeft: 4,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
