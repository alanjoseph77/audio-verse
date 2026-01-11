import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingView } from '../../components/LoadingView';
import { Book, fetchBooks } from '../../services/api';

export default function Explore() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 600); // 600ms delays to avoid network spam
        return () => clearTimeout(timer);
    }, [query]);

    // Search effect
    useEffect(() => {
        const searchLibrary = async () => {
            if (debouncedQuery.length > 2) {
                setLoading(true);
                try {
                    // Constructed Advanced Query for Archive.org
                    // Searches title OR creator, filtered by librivox collection (audiobooks)
                    const searchQuery = `(title:(${debouncedQuery}) OR creator:(${debouncedQuery})) AND collection:(librivox_audiobooks)`;
                    const data = await fetchBooks(searchQuery);
                    setBooks(data);
                } catch (e) {
                    console.error("Search failed", e);
                } finally {
                    setLoading(false);
                }
            } else if (debouncedQuery.length === 0 && query.length === 0) {
                // Reload suggestions if query is cleared
                setLoading(true);
                const data = await fetchBooks('downloads:[10000 TO 1000000]', 20);
                setBooks(data);
                setLoading(false);
            }
        };

        // Only run search if it changed
        searchLibrary();
    }, [debouncedQuery]);

    const renderItem = ({ item }: { item: Book }) => (
        <Pressable
            style={styles.bookItem}
            onPress={() => router.push({ pathname: '/book-detail', params: { id: item.id } })}
        >
            <Image source={{ uri: item.coverImage }} style={styles.bookCover} resizeMode="cover" />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{item.creator}</Text>
                <View style={styles.statsRow}>
                    <Ionicons name="download-outline" size={12} color="#666" />
                    <Text style={styles.statsText}>{item.downloads || 0}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </Pressable>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search audiobooks..."
                            value={query}
                            onChangeText={setQuery}
                            placeholderTextColor="#999"
                            autoFocus
                        />
                        {query.length > 0 && (
                            <Pressable onPress={() => setQuery('')}>
                                <Ionicons name="close-circle" size={16} color="#999" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {loading ? (
                    <LoadingView message="Searching Library..." />
                ) : (
                    <FlatList
                        data={books}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                {query.length > 0 ? (
                                    <Text style={styles.emptyText}>No audiobooks found.</Text>
                                ) : (
                                    <Text style={styles.emptyText}>Start typing to search.</Text>
                                )}
                            </View>
                        }
                    />
                )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 10,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#000',
    },
    listContent: {
        padding: 16,
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    bookCover: {
        width: 60,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    bookInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#aaa',
    },
});
