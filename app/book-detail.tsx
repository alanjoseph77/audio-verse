import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChapterRow } from '../components/ChapterRow';
import { LoadingView } from '../components/LoadingView';
import { MiniPlayer } from '../components/MiniPlayer';
import { TabControl } from '../components/TabControl';
import { Track, useAudio } from '../context/AudioContext';
import { AudioTrack, BookDetail as BookDetailType, fetchBookDetails } from '../services/api';

const { width } = Dimensions.get('window');

const TABS = ['About Book', 'Chapters', 'Reviews'];

export default function BookDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Chapters');

    // Updated destructuring to include playQueue
    const { playTrack, playQueue } = useAudio();

    const [book, setBook] = useState<BookDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const loadBook = async () => {
            if (id) {
                setLoading(true);
                const data = await fetchBookDetails(id as string);
                setBook(data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        loadBook();
    }, [id]);

    const handlePlayChapter = async (trackInfo: AudioTrack, index: number) => {
        if (!book) return;

        // Construct the full queue from book tracks
        const queue: Track[] = book.tracks.map(t => ({
            id: t.title,
            title: t.title,
            artist: book.creator,
            image: { uri: book.coverImage }, // Track interface expects 'any' (source) or {uri}
            uri: t.uri,
        }));

        await playQueue(queue, index);
    };

    const handleShare = async () => {
        if (!book) return;
        try {
            await Share.share({
                message: `Check out this audiobook: ${book.title} by ${book.creator}`,
                url: `https://archive.org/details/${book.id}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderContent = () => {
        if (!book) return null;

        if (activeTab === 'About Book') {
            return (
                <View style={styles.tabContent}>
                    {/* Author Section */}
                    <Text style={styles.sectionTitle}>{book.creator}</Text>
                    <Text style={styles.description}>
                        {book.description ? book.description.replace(/<[^>]*>?/gm, '') : 'No description available.'}
                    </Text>
                </View>
            );
        } else if (activeTab === 'Chapters') {
            return (
                <View style={styles.tabContent}>
                    <View style={styles.rowHeader}>
                        <Text style={styles.subTitle}>Chapters</Text>
                        <Text style={styles.miniCount}>({book.tracks.length})</Text>
                    </View>

                    {book.tracks.map((track, index) => (
                        <Pressable key={index} onPress={() => handlePlayChapter(track, index)}>
                            <ChapterRow
                                chapter={{
                                    id: track.trackNumber.toString(),
                                    title: track.title,
                                    subtitle: `Track ${track.trackNumber}`,
                                    image: { uri: book.coverImage }, // Pass URI object
                                    isLocked: false
                                }}
                                index={index}
                            />
                        </Pressable>
                    ))}
                    <View style={{ height: 100 }} />
                </View>
            );
        }
        return <View style={styles.tabContent}><Text>Reviews not available</Text></View>;
    };

    if (loading) {
        return <LoadingView message="Loading Book Details..." />;
    }

    if (!book) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Book not found</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#6b90a3' }}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header Navigation */}
                <View style={styles.navHeader}>
                    <Pressable onPress={() => router.back()} hitSlop={20} style={{ padding: 8 }}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </Pressable>
                    <View style={styles.rightNav}>
                        <Pressable onPress={() => setIsLiked(!isLiked)} style={{ marginRight: 20 }}>
                            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? "#FF69B4" : "#000"} />
                        </Pressable>
                        <Pressable onPress={handleShare}>
                            <Ionicons name="share-outline" size={26} color="#000" />
                        </Pressable>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <View style={styles.heroContainer}>
                        <View style={styles.heroCardWrapper}>
                            <View style={[styles.bgCard, { transform: [{ rotate: '-6deg' }], backgroundColor: '#e0f7fa', zIndex: 0 }]} />
                            <View style={[styles.bgCard, { transform: [{ rotate: '6deg' }], backgroundColor: '#fff3e0', zIndex: 1 }]} />

                            <View style={styles.mainHeroCard}>
                                <Image
                                    source={{ uri: book.coverImage }}
                                    style={styles.heroImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        <View style={styles.heroTextContainer}>
                            <Text style={styles.heroTitle} numberOfLines={2}>{book.title}</Text>

                            <View style={styles.heroStats}>
                                <Ionicons name="heart" size={16} color="#FF69B4" />
                                <Text style={styles.statText}>{book.downloads || 0}</Text>
                                <Ionicons name="mic-outline" size={16} color="#FFD700" style={{ marginLeft: 12 }} />
                                <Text style={styles.statText}>{book.creator}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Tab Navigation */}
                    <TabControl
                        tabs={TABS}
                        activeTab={activeTab}
                        onTabPress={setActiveTab}
                    />

                    {/* Content */}
                    {renderContent()}

                    {/* Spacer for bottom player */}
                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom Player */}
                <MiniPlayer />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    rightNav: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    heroContainer: {
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: '#6b90a3',
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    heroCardWrapper: {
        width: 180,
        height: 260,
        position: 'relative',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgCard: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        opacity: 0.8,
    },
    mainHeroCard: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 10,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroTextContainer: {
        width: '100%',
        paddingHorizontal: 32,
    },
    heroTitle: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    statText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    tabContent: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 24,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    miniCount: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
});
