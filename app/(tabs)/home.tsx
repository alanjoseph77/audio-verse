import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingView } from '../../components/LoadingView';
import { Book, fetchBooks } from '../../services/api';

const { width } = Dimensions.get('window');

// Data definition
interface CardData {
    id: number;
    bookId: string; // Real book ID for navigation
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: ImageSourcePropType;
    type: 'pink-mood' | 'classic' | 'split' | 'active';
    artist?: string;
    artistName?: string;
    moodText?: string;
    timer?: string;
    bottomText?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BookCard = ({ card, index }: { card: CardData; index: number }) => {
    const isBlue = card.type === 'active';
    const scale = useSharedValue(1);
    const router = useRouter();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        router.push({ pathname: '/book-detail', params: { id: card.bookId } });
    };

    const enteringAnimation = FadeInDown.delay(index * 150)
        .springify()
        .damping(12)
        .mass(1)
        .stiffness(100);

    return (
        <Animated.View
            entering={enteringAnimation}
            style={[
                styles.cardWrapper,
                {
                    marginTop: index === 0 ? 0 : -65,
                    zIndex: index,
                }
            ]}
        >
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.cardContainer,
                    animatedStyle,
                    {
                        backgroundColor: isBlue ? '#6b90a3' : '#fff',
                    }
                ]}
            >
                <View style={styles.cardInner}>

                    <View style={styles.imageWrapper}>
                        <Image
                            source={card.image}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />

                        {card.type === 'active' && (
                            <View style={styles.roryOverlay}>
                                <Text style={styles.roryText}>TOP</Text>
                            </View>
                        )}

                        {card.type === 'pink-mood' && (
                            <>
                                <View style={styles.heartIcon}>
                                    <Ionicons name="heart" size={12} color="#FF69B4" />
                                </View>
                                <View style={styles.moodBadge}>
                                    <Text style={styles.moodText}>{card.moodText || 'MOOD'}</Text>
                                </View>
                            </>
                        )}

                        {card.type === 'classic' && card.artist && (
                            <View style={styles.artistOverlay}>
                                <Text style={styles.artistLabel}>{card.artist}</Text>
                                <Text style={styles.artistNameSmall}>{card.artistName}</Text>
                            </View>
                        )}

                        {card.type === 'split' && (
                            <View style={styles.redStrip}>
                                <Text style={styles.verticalScript}>MUST READ</Text>
                            </View>
                        )}

                        {card.type === 'active' && card.timer && (
                            <View style={styles.timerBadge}>
                                <Ionicons name="time-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
                                <Text style={styles.timerText}>{card.timer}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.textContainer}>
                        <View>
                            <Text style={[styles.titleLine, isBlue && styles.textWhite]} numberOfLines={1}>
                                {card.titleLine1}
                            </Text>
                            <Text style={[styles.titleLine, styles.titleBold, isBlue && styles.textWhite]} numberOfLines={1}>
                                {card.titleLine2}
                            </Text>
                        </View>

                        <Text style={[styles.subtitle, isBlue && styles.textLightBlue]} numberOfLines={2}>
                            {card.subtitle}
                        </Text>

                        {card.bottomText && (
                            <Text style={[styles.bottomLabel, isBlue && styles.textWhite]}>
                                {card.bottomText}
                            </Text>
                        )}
                    </View>

                </View>
            </AnimatedPressable>
        </Animated.View>
    );
};

export default function Home() {
    const router = useRouter();
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            try {
                const [
                    romance,
                    classic,
                    comedy,
                    popular,
                    scifi,
                    adventure,
                    children,
                    poetry
                ] = await Promise.all([
                    fetchBooks('title:(Pride and Prejudice) AND creator:(Austen)', 1),
                    fetchBooks('title:(Adventures of Sherlock Holmes)', 1),
                    fetchBooks('title:(Alice\'s Adventures in Wonderland)', 1),
                    fetchBooks('title:(The Great Gatsby)', 1),
                    fetchBooks('title:(Frankenstein) AND creator:(Shelley)', 1),
                    fetchBooks('title:(Treasure Island)', 1),
                    fetchBooks('title:(Anne of Green Gables)', 1),
                    fetchBooks('title:(The Raven)', 1),
                ]);

                const newCards: CardData[] = [];

                const addCard = (book: Book | undefined, type: CardData['type'], id: number, bottomLabel?: string, overrideSubtitle?: string) => {
                    if (!book) return;

                    let cleanTitle = book.title.replace(/\(.*\)/, '').replace(/LibriVox.*/i, '').trim();

                    const words = cleanTitle.split(' ');
                    const safeWords = words.length > 6 ? words.slice(0, 6) : words;

                    let line1 = safeWords.slice(0, Math.ceil(safeWords.length / 2)).join(' ');
                    let line2 = safeWords.slice(Math.ceil(safeWords.length / 2)).join(' ');

                    if (cleanTitle.includes("Pride and Prejudice")) { line1 = "Pride and"; line2 = "Prejudice"; }
                    if (cleanTitle.includes("Sherlock Holmes")) { line1 = "Sherlock"; line2 = "Holmes"; }
                    if (cleanTitle.includes("Alice")) { line1 = "Alice in"; line2 = "Wonderland"; }
                    if (cleanTitle.includes("Great Gatsby")) { line1 = "The Great"; line2 = "Gatsby"; }

                    newCards.push({
                        id,
                        bookId: book.id,
                        titleLine1: line1,
                        titleLine2: line2,
                        subtitle: overrideSubtitle || book.creator.split(',')[0],
                        image: { uri: book.coverImage },
                        type,
                        artist: type === 'classic' ? 'ICON' : undefined,
                        artistName: type === 'classic' ? 'Classic Literature' : undefined,
                        bottomText: bottomLabel || (type === 'active' ? 'Best Seller' : undefined),
                        timer: type === 'active' ? 'Free' : undefined,
                        moodText: type === 'pink-mood' ? 'ROMANCE' : undefined
                    });
                };

                addCard(romance[0], 'pink-mood', 1, undefined, "Jane Austen");
                addCard(classic[0], 'classic', 2, undefined, "Sir Arthur Conan Doyle");
                addCard(comedy[0], 'split', 3, undefined, "Lewis Carroll");
                addCard(popular[0], 'active', 4, 'Trending #1', "F. Scott Fitzgerald");

                addCard(scifi[0], 'pink-mood', 5, undefined, "Mary Shelley");
                addCard(adventure[0], 'classic', 6, undefined, "Robert Louis Stevenson");
                addCard(children[0], 'split', 7, undefined, "L.M. Montgomery");
                addCard(poetry[0], 'active', 8, 'Poetry', "Edgar Allan Poe");

                setCards(newCards);
            } catch (e) {
                console.error("Failed to load home cards", e);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.push('/profile')} style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' }}
                            style={styles.avatar}
                        />
                        <View style={styles.avatarBadge} />
                    </Pressable>
                    <Text style={styles.headerTitle}>All Genre</Text>
                    <Pressable
                        style={styles.iconContainer}
                        onPress={() => router.push('/explore')}
                    >
                        <Ionicons name="search-outline" size={26} color="#000" />
                    </Pressable>
                </View>

                {loading ? (
                    <LoadingView message="Curating Library..." />
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {cards.map((card, index) => (
                            <BookCard key={card.id} card={card} index={index} />
                        ))}
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
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#eee',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    iconContainer: {
        width: 36,
        alignItems: 'flex-end',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    cardWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    cardContainer: {
        height: 220,
        borderRadius: 48,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    cardInner: {
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    imageWrapper: {
        width: 140,
        height: '100%',
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
        height: '100%',
        paddingLeft: 20,
        paddingVertical: 20,
        justifyContent: 'center',
    },
    titleLine: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
        lineHeight: 32,
        letterSpacing: -0.8,
    },
    titleBold: {
        fontWeight: '900',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    bottomLabel: {
        marginTop: 'auto',
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        opacity: 0.95,
    },
    textWhite: {
        color: '#fff',
    },
    textLightBlue: {
        color: '#dbebf0',
    },
    roryOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginTop: 20,
    },
    roryText: {
        fontSize: 40,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 2,
    },
    heartIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#fff',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moodBadge: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        alignItems: 'center',
    },
    moodText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 4,
    },
    artistOverlay: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    artistLabel: {
        fontSize: 26,
        fontWeight: '900',
        color: '#000',
    },
    artistNameSmall: {
        fontSize: 8,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 1,
    },
    redStrip: {
        position: 'absolute',
        right: 20,
        top: 0,
        bottom: 0,
        width: 32,
        backgroundColor: '#b91c1c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalScript: {
        color: '#fff',
        transform: [{ rotate: '90deg' }],
        width: 150,
        textAlign: 'center',
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    timerBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: '#1f1f1f',
        borderRadius: 20,
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    timerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    }
});
