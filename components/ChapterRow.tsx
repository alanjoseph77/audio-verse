import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface Chapter {
    id: string;
    title: string;
    subtitle: string;
    isLocked?: boolean;
    image: any;
}

export const ChapterRow = ({ chapter, index }: { chapter: Chapter; index: number }) => {
    return (
        <View style={styles.container}>
            {/* Image Thumbnail */}
            <View style={styles.thumbnailWrapper}>
                <Image source={chapter.image} style={styles.thumbnail} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{chapter.title}</Text>
                <Text style={styles.subtitle}>{chapter.subtitle}</Text>
            </View>

            {/* Action Icon */}
            <Pressable style={styles.actionButton}>
                {chapter.isLocked ? (
                    <View style={styles.lockContainer}>
                        <Ionicons name="lock-closed-outline" size={18} color="#000" />
                    </View>
                ) : (
                    <View style={styles.playContainer}>
                        <Ionicons name="play" size={18} color="#000" style={{ marginLeft: 2 }} />
                    </View>
                )}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    thumbnailWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 16,
        backgroundColor: '#f0f0f0',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    actionButton: {
        padding: 8,
    },
    playContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    lockContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5', // Slightly darker for locked
        alignItems: 'center',
        justifyContent: 'center',
    }
});
