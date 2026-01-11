import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TabControlProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string) => void;
}

export const TabControl = ({ tabs, activeTab, onTabPress }: TabControlProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.pillContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <Pressable
                            key={tab}
                            onPress={() => onTabPress(tab)}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab
                            ]}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginVertical: 20,
    },
    pillContainer: {
        flexDirection: 'row',
        backgroundColor: '#333', // Dark background for the pill container
        borderRadius: 30, // Fully rounded
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#aaa',
    },
    activeTabText: {
        color: '#000',
        fontWeight: '700',
    },
});
