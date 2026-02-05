import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LatexWebView from './LatexWebView';
import { SAMPLE_LATEX_DATA, PERFORMANCE_TEST_DATA } from '../utils/SampleLatex';
import { PerformanceLogger, usePerformanceLogger } from '../utils/PerformanceLogger';

const WebLatexScreen = ({ onSwitchRenderer, onOpenPlayground }) => {
    const [showPerformanceTest, setShowPerformanceTest] = useState(false);
    const [stats, setStats] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const performanceLogger = usePerformanceLogger();
    const data = showPerformanceTest ? PERFORMANCE_TEST_DATA : SAMPLE_LATEX_DATA;

    useEffect(() => {
        setStats(performanceLogger.getStatistics('webview'));

        const unsubscribe = performanceLogger.subscribe((event) => {
            if (event.type === 'render' && event.rendererType === 'webview') {
                setStats(performanceLogger.getStatistics('webview'));
            }
        });

        return () => unsubscribe();
    }, []);

    const handleToggleData = useCallback(() => {
        PerformanceLogger.reset();
        setShowPerformanceTest(!showPerformanceTest);
    }, [showPerformanceTest]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        PerformanceLogger.reset();
        setStats(performanceLogger.getStatistics('webview'));
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    const renderItem = useCallback(({ item, index }) => (
        <View style={styles.listItem}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemIndex}>#{index + 1}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
            </View>

            <LatexWebView
                content={item.content}
                showDebugInfo={true}
                itemId={item.id}
                backgroundColor="#ffffff"
                fontSize={16}
            />

            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    ), []);

    const keyExtractor = useCallback((item) => item.id, []);
    const memoryEstimate = performanceLogger.estimateMemoryUsage('webview', data.length);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.rendererIndicator}>
                    <Text style={styles.rendererIcon}>W</Text>
                    <View>
                        <Text style={styles.rendererTitle}>Rendering via WebView</Text>
                        <Text style={styles.rendererSubtitle}>Using browser engine (KaTeX)</Text>
                    </View>
                </View>

                <View style={styles.warningBanner}>
                    <View style={styles.warningTextContainer}>
                        <Text style={styles.warningTitle}>Performance Warning</Text>
                        <Text style={styles.warningText}>
                            This approach uses a browser engine for each equation.
                            {'\n'}- High memory usage
                            {'\n'}- Scroll lag with many items
                            {'\n'}- Slow initial render
                        </Text>
                    </View>
                </View>

                {stats && (
                    <View style={styles.statsPanel}>
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Avg Render</Text>
                                <Text style={styles.statValue}>{stats.mean}ms</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Min/Max</Text>
                                <Text style={styles.statValue}>{stats.min}/{stats.max}ms</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Count</Text>
                                <Text style={styles.statValue}>{stats.count}</Text>
                            </View>
                        </View>

                        <View style={styles.memoryRow}>
                            <Text style={styles.memoryLabel}>
                                Est. Memory: {memoryEstimate.value} {memoryEstimate.unit}
                            </Text>
                            {memoryEstimate.warning && (
                                <Text style={styles.memoryWarning}>{memoryEstimate.warning}</Text>
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.toggleButton, showPerformanceTest && styles.toggleButtonActive]}
                        onPress={handleToggleData}
                    >
                        <Text style={[styles.toggleButtonText, showPerformanceTest && styles.toggleButtonTextActive]}>
                            {showPerformanceTest ? 'Stress Test' : 'Samples'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.playgroundButton} onPress={onOpenPlayground}>
                        <Text style={styles.playgroundButtonText}>Playground</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.switchButton} onPress={onSwitchRenderer}>
                        <Text style={styles.switchButtonText}>Native</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={3}
                windowSize={5}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => (
                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>Comparison Note</Text>
                        <Text style={styles.footerText}>
                            This WebView approach uses a browser engine to render each equation.
                            Compare with the Native renderer to see the performance difference.
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    rendererIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rendererIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 12,
        backgroundColor: '#d32f2f',
        color: '#fff',
        width: 40,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        borderRadius: 20,
    },
    rendererTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    rendererSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    warningBanner: {
        flexDirection: 'row',
        backgroundColor: '#fff3e0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ffcc80',
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e65100',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 12,
        color: '#bf360c',
        lineHeight: 18,
    },
    statsPanel: {
        backgroundColor: '#fafafa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'monospace',
    },
    memoryRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    memoryLabel: {
        fontSize: 12,
        color: '#666',
    },
    memoryWarning: {
        fontSize: 11,
        color: '#d32f2f',
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    toggleButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#e3f2fd',
    },
    toggleButtonText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    toggleButtonTextActive: {
        color: '#1976d2',
    },
    switchButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#4caf50',
        alignItems: 'center',
    },
    switchButtonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold',
    },
    playgroundButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#6200ee',
        alignItems: 'center',
    },
    playgroundButtonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    listItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemIndex: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    itemType: {
        fontSize: 10,
        color: '#888',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        textTransform: 'uppercase',
    },
    itemDescription: {
        fontSize: 11,
        color: '#888',
        marginTop: 8,
        fontStyle: 'italic',
    },
    separator: {
        height: 12,
    },
    footer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#90caf9',
    },
    footerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565c0',
        marginBottom: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#1976d2',
        lineHeight: 18,
    },
});

export default WebLatexScreen;
