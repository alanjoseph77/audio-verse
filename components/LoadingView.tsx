import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

export const LoadingView = ({ message = "Loading..." }: { message?: string }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        // Delay of 1s in CSS is part of the animation start, but withRepeat loops immediately.
        // We can mimic delay inside duration or just start. 
        // The CSS says "animation: ... 1s infinite alternate". The 1s is delay? Or duration? 
        // "3s ease-in-out 1s infinite alternate" -> Duration 3s, Delay 1s.
        // In Reanimated loop, delay happens on every iteration? No, usually start delay.
        // We'll just start the animation.
        progress.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true // reverse (alternate)
        );
    }, []);

    const barStyle = useAnimatedStyle(() => {
        const rotation = interpolate(progress.value, [0, 1], [-15, 15]);
        return {
            transform: [{ rotate: `${rotation}deg` }]
        };
    });

    const ballStyle = useAnimatedStyle(() => {
        // bar width 200. ball width 50.
        // from: left: calc(100% - 40px) -> 200 - 40 = 160
        // to: left: calc(0% - 20px) -> -20
        const translateX = interpolate(progress.value, [0, 1], [160, -20]);

        // rotate 360 -> 0
        const rotate = interpolate(progress.value, [0, 1], [360, 0]);

        return {
            left: translateX,
            transform: [{ rotate: `${rotate}deg` }]
        };
    });

    return (
        <View style={styles.container}>
            <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[styles.bar, barStyle]}>
                    <Animated.View style={[styles.ball, ballStyle]}>
                        <View style={styles.eye} />
                    </Animated.View>
                </Animated.View>
            </View>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    bar: {
        width: 200,
        height: 12.5,
        backgroundColor: '#FFDAAF',
        borderRadius: 30,
        justifyContent: 'center', // to help position ball vertically if needed, but absolute is better
        // The ball is absolute, relative to bar.
        // CSS: ball bottom 50px.
    },
    ball: {
        position: 'absolute',
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eye: {
        position: 'absolute',
        top: 25,
        right: 5,
        width: 5,
        height: 5,
        backgroundColor: '#000',
        borderRadius: 2.5,
    },
    text: {
        marginTop: 60,
        color: '#6b90a3',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 0.5,
    },
});
