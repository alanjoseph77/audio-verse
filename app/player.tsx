import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudio } from '../context/AudioContext';

const { width } = Dimensions.get('window');

const formatTime = (millis: number) => {
    if (!millis) return '00:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
};

export default function Player() {
    const router = useRouter();
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        duration,
        position,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious
    } = useAudio();

    // Fallback if accessed directly without track
    const track = currentTrack || {
        id: 'demo',
        title: "Select a Chapter",
        artist: "Audiobook App",
        image: require('../assets/images/selflessness.png'),
        uri: ''
    };

    const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-down" size={32} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Now Playing</Text>
                    <Pressable>
                        <Ionicons name="heart" size={24} color="#FF69B4" />
                    </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* Top Section: Art & Info */}
                    <View style={styles.topSection}>
                        {/* Album Art with Corner Decorations */}
                        <View style={styles.albumContainer}>
                            <Image
                                source={track.image}
                                style={styles.albumArt}
                                resizeMode="cover"
                            />
                            {/* Decorative corners */}
                            <Ionicons name="leaf-outline" size={24} color="#fff" style={[styles.cornerIcon, styles.topLeft]} />
                            <Ionicons name="leaf-outline" size={24} color="#fff" style={[styles.cornerIcon, styles.topRight]} />
                            <Ionicons name="leaf-outline" size={24} color="#fff" style={[styles.cornerIcon, styles.bottomLeft]} />
                            <Ionicons name="leaf-outline" size={24} color="#fff" style={[styles.cornerIcon, styles.bottomRight]} />
                        </View>

                        {/* Title Area */}
                        <View style={styles.titleArea}>
                            <Text style={styles.songTitle} numberOfLines={2}>{track.title}</Text>
                            <Text style={styles.author}>{track.artist}</Text>
                        </View>
                    </View>

                    {/* Bottom Section: Progress & Controls */}
                    <View style={styles.bottomSection}>
                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                                <View style={[styles.knob, { left: `${progressPercent}%` }]} />
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeText}>{formatTime(position)}</Text>
                                <Text style={styles.timeText}>-{formatTime(duration - position)}</Text>
                            </View>
                        </View>

                        {/* Controls */}
                        <View style={styles.controls}>
                            <Pressable>
                                <Ionicons name="repeat" size={24} color="#fff" />
                            </Pressable>

                            <Pressable onPress={playPrevious} disabled={!hasPrevious}>
                                <Ionicons name="play-skip-back" size={32} color="#fff" style={{ opacity: hasPrevious ? 1 : 0.4 }} />
                            </Pressable>

                            <Pressable style={styles.playButton} onPress={togglePlayPause}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" style={{ marginLeft: isPlaying ? 0 : 4 }} />
                            </Pressable>

                            <Pressable onPress={playNext} disabled={!hasNext}>
                                <Ionicons name="play-skip-forward" size={32} color="#fff" style={{ opacity: hasNext ? 1 : 0.4 }} />
                            </Pressable>

                            <Pressable>
                                <Ionicons name="shuffle" size={24} color="#fff" />
                            </Pressable>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
    },
    bottomSection: {
        width: '100%',
        paddingBottom: 20,
    },
    albumContainer: {
        width: width * 0.75,
        height: width * 0.75,
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 30,
        backgroundColor: '#000',
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    albumArt: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    cornerIcon: {
        position: 'absolute',
        opacity: 0.8,
    },
    topLeft: { top: 16, left: 16, transform: [{ rotate: '45deg' }] },
    topRight: { top: 16, right: 16, transform: [{ rotate: '135deg' }] },
    bottomLeft: { bottom: 16, left: 16, transform: [{ rotate: '-45deg' }] },
    bottomRight: { bottom: 16, right: 16, transform: [{ rotate: '-135deg' }] },

    titleArea: {
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    author: {
        fontSize: 18,
        color: '#ccc',
        fontWeight: '500',
    },
    progressContainer: {
        width: '100%',
        marginBottom: 30,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        marginBottom: 10,
        position: 'relative',
    },
    progressBarFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#6b90a3',
        borderRadius: 3,
    },
    knob: {
        position: 'absolute',
        top: -5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    playButton: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#6b90a3',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#6b90a3",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    }
});
