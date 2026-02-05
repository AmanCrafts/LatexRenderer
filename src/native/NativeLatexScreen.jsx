import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NativeLatexView, { clearLatexCache, getCacheSize, getIsNativeMode } from './NativeLatexView';
import { SAMPLE_LATEX_DATA, PERFORMANCE_TEST_DATA } from '../utils/SampleLatex';
import { PerformanceLogger } from '../utils/PerformanceLogger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_NATIVE_MODE = getIsNativeMode();

const NativeLatexScreen = ({ onSwitchRenderer, onOpenPlayground }) => {
    const [showPerformance, setShowPerformance] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [stats, setStats] = useState({ count: 0, mean: 0, cacheHits: 0, cacheMisses: 0 });

    const flatListRef = useRef(null);

    const data = showPerformance ? PERFORMANCE_TEST_DATA : SAMPLE_LATEX_DATA;

    useEffect(() => {
        const updateStats = () => {
            const nativeStats = PerformanceLogger.getStatistics('native');
            const cacheStats = PerformanceLogger.getCacheStatistics();
            setStats({
                count: nativeStats.count || 0,
                mean: nativeStats.mean || 0,
                cacheHits: cacheStats.hits || 0,
                cacheMisses: cacheStats.misses || 0,
            });
        };

        const unsubscribe = PerformanceLogger.subscribe(updateStats);
        updateStats();

        return () => unsubscribe();
    }, []);

    const handleClearCache = useCallback(() => {
        clearLatexCache();
        PerformanceLogger.reset();
    }, []);

    const scrollToTop = useCallback(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const renderItem = useCallback(({ item, index }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>#{index + 1} - {item.type}</Text>
            <View style={styles.latexWrapper}>
                <NativeLatexView
                    content={item.content}
                    fontSize={18}
                    backgroundColor="#fff"
                    showDebugInfo={showDebug}
                    itemId={item.id}
                />
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    ), [showDebug]);

    const keyExtractor = useCallback((item) => item.id, []);

    const ListHeader = useCallback(() => (
        <View style={styles.headerContainer}>
            {IS_NATIVE_MODE ? (
                <View style={[styles.warningBanner, styles.successBanner]}>
                    <Text style={styles.warningTitle}>Native Rendering Active</Text>
                    <Text style={styles.warningText}>
                        Using JLaTeXMath for true native LaTeX rendering with maximum performance.
                    </Text>
                </View>
            ) : (
                <View style={styles.warningBanner}>
                    <Text style={styles.warningTitle}>WebView Fallback Mode</Text>
                    <Text style={styles.warningText}>
                        Using KaTeX WebView fallback. For true native performance with JLaTeXMath,
                        run a development build with: npx expo run:android
                    </Text>
                </View>
            )}

            <View style={styles.controlsRow}>
                <TouchableOpacity
                    style={[styles.toggleButton, showPerformance && styles.activeButton]}
                    onPress={() => setShowPerformance(!showPerformance)}
                >
                    <Text style={[styles.buttonText, showPerformance && styles.activeText]}>
                        {showPerformance ? 'Sample Data' : 'Stress Test (50)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleButton, showDebug && styles.activeButton]}
                    onPress={() => setShowDebug(!showDebug)}
                >
                    <Text style={[styles.buttonText, showDebug && styles.activeText]}>
                        {showDebug ? 'Hide Debug' : 'Show Debug'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
                    <Text style={styles.actionText}>Clear Cache</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={scrollToTop}>
                    <Text style={styles.actionText}>Scroll Top</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsPanel}>
                <Text style={styles.statsTitle}>Performance Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.count}</Text>
                        <Text style={styles.statLabel}>Renders</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.mean.toFixed(1)}ms</Text>
                        <Text style={styles.statLabel}>Avg Time</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>
                            {stats.cacheHits + stats.cacheMisses > 0
                                ? Math.round((stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100)
                                : 0}%
                        </Text>
                        <Text style={styles.statLabel}>Cache Hit</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{getCacheSize()}</Text>
                        <Text style={styles.statLabel}>Cached</Text>
                    </View>
                </View>
            </View>
        </View>
    ), [showPerformance, showDebug, stats, handleClearCache, scrollToTop]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Native Renderer</Text>
                <View style={styles.titleButtons}>
                    <TouchableOpacity style={styles.playgroundBtn} onPress={onOpenPlayground}>
                        <Text style={styles.playgroundBtnText}>Playground</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.switchButton} onPress={onSwitchRenderer}>
                        <Text style={styles.switchText}>WebView</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContent}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
    },
    titleBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#4caf50',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    titleButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    playgroundBtn: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    playgroundBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    switchButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    switchText: {
        color: '#fff',
        fontSize: 14,
    },
    headerContainer: {
        padding: 16,
    },
    warningBanner: {
        backgroundColor: '#fff3e0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },
    successBanner: {
        backgroundColor: '#e8f5e9',
        borderLeftColor: '#4caf50',
    },
    warningTitle: {
        fontWeight: 'bold',
        color: '#e65100',
        marginBottom: 4,
    },
    warningText: {
        color: '#bf360c',
        fontSize: 13,
        lineHeight: 18,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    toggleButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    activeButton: {
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
    },
    buttonText: {
        color: '#4caf50',
        fontWeight: '600',
    },
    activeText: {
        color: '#fff',
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionText: {
        color: '#666',
    },
    statsPanel: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
    },
    statsTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    listContent: {
        paddingBottom: 24,
    },
    itemContainer: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        padding: 12,
        paddingBottom: 8,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    latexWrapper: {
        minHeight: 60,
    },
    itemDescription: {
        fontSize: 12,
        color: '#888',
        padding: 12,
        paddingTop: 8,
        fontStyle: 'italic',
    },
});

export default NativeLatexScreen;
