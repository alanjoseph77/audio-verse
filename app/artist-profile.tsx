import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingView } from '../components/LoadingView';
import { Book, fetchBooks } from '../services/api';

const { width } = Dimensions.get('window');

export default function ArtistProfile() {
    const router = useRouter();
    const { artist } = useLocalSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const artistName = typeof artist === 'string' ? artist : 'Unknown Artist';

    useEffect(() => {
        const loadArtistBooks = async () => {
            setLoading(true);
            try {
                // Fetch books by this creator
                // Use quotes to handle spaces in names
                const query = `creator:("${artistName}")`;
                const data = await fetchBooks(query, 10);
                setBooks(data);
            } catch (error) {
                console.error("Failed to load artist books", error);
            } finally {
                setLoading(false);
            }
        };

        if (artistName) {
            loadArtistBooks();
        }
    }, [artistName]);

    const featuredBook = books.length > 0 ? books[0] : null;
    const popularList = books.length > 1 ? books.slice(1) : [];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </Pressable>
                    <Ionicons name="search-outline" size={24} color="#000" />
                </View>

                {loading ? (
                    <LoadingView message="Loading Artist Profile..." />
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ paddingHorizontal: 24, marginBottom: 10 }}>
                            <Text style={styles.pageTitle} numberOfLines={2}>
                                {artistName}
                            </Text>
                        </View>

                        {/* Featured Card */}
                        {featuredBook ? (
                            <Pressable
                                style={styles.featuredCard}
                                onPress={() => router.push({ pathname: '/book-detail', params: { id: featuredBook.id } })}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="leaf-outline" size={20} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '45deg' }] }} />
                                    <Ionicons name="leaf-outline" size={20} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '135deg' }] }} />
                                </View>

                                <View style={styles.coverWrapper}>
                                    <Image
                                        source={{ uri: featuredBook.coverImage }}
                                        style={styles.featuredCover}
                                        resizeMode="cover"
                                    />
                                </View>

                                <View style={styles.cardInfo}>
                                    <Text style={styles.featuredTitle} numberOfLines={2}>{featuredBook.title}</Text>
                                    <Text style={styles.featuredAuthor}>{featuredBook.creator}</Text>
                                </View>

                                {/* Card Controls */}
                                <View style={styles.cardControls}>
                                    <View style={styles.statsRow}>
                                        <View style={styles.statItem}>
                                            <Ionicons name="heart" size={16} color="#FF69B4" />
                                            <Text style={styles.statText}>{featuredBook.downloads || 0}</Text>
                                        </View>
                                        <View style={styles.playCircle}>
                                            <Ionicons name="play" size={24} color="#000" style={{ marginLeft: 2 }} />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardFooterDecor}>
                                    <Ionicons name="leaf-outline" size={20} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '-45deg' }] }} />
                                    <Ionicons name="leaf-outline" size={20} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '-135deg' }] }} />
                                </View>
                            </Pressable>
                        ) : (
                            <View style={{ padding: 24 }}><Text>No books found for this artist.</Text></View>
                        )}

                        {/* "Most Popular" (Other books by author) */}
                        {popularList.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>More by {artistName}</Text>

                                <View style={styles.listContainer}>
                                    {popularList.map((book) => (
                                        <Pressable
                                            key={book.id}
                                            style={styles.listItem}
                                            onPress={() => router.push({ pathname: '/book-detail', params: { id: book.id } })}
                                        >
                                            <View style={styles.listImageWrapper}>
                                                <Image source={{ uri: book.coverImage }} style={styles.listImage} />
                                            </View>
                                            <View style={styles.listInfo}>
                                                <Text style={styles.listTitle} numberOfLines={1}>{book.title}</Text>
                                                <Text style={styles.listSubtitle} numberOfLines={2}>
                                                    {book.description ? book.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : 'No description'}
                                                </Text>
                                            </View>
                                            <View style={styles.miniPlayBtn}>
                                                <Ionicons name="chevron-forward" size={18} color="#000" />
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 14,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
        marginBottom: 10,
    },
    featuredCard: {
        backgroundColor: '#222',
        marginHorizontal: 24,
        borderRadius: 30,
        padding: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardFooterDecor: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    coverWrapper: {
        width: '100%',
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#333',
    },
    featuredCover: {
        width: '100%',
        height: '100%',
    },
    cardInfo: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featuredAuthor: {
        color: '#bbb',
        fontSize: 16,
        fontWeight: '500',
    },
    cardControls: {
        width: '100%',
        marginTop: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '600',
    },
    playCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        paddingHorizontal: 24,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
        color: '#000',
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    listImageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 16,
        backgroundColor: '#eee',
    },
    listImage: {
        width: '100%',
        height: '100%',
    },
    listInfo: {
        flex: 1,
        marginRight: 10,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        color: '#000',
    },
    listSubtitle: {
        fontSize: 12,
        color: '#888',
        lineHeight: 16,
    },
    miniPlayBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
