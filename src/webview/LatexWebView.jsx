import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { generateMixedContentHtml } from './KatexHtmlTemplate';
import { PerformanceLogger } from '../utils/PerformanceLogger';

const LatexWebView = ({
    content = '',
    backgroundColor = '#ffffff',
    fontSize = 18,
    onRenderComplete = null,
    onError = null,
    showDebugInfo = false,
    itemId = '',
}) => {
    const [height, setHeight] = useState(100);
    const [loading, setLoading] = useState(true);
    const [renderTime, setRenderTime] = useState(null);
    const [error, setError] = useState(null);

    const startTimeRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        startTimeRef.current = PerformanceLogger.startTimer();
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const html = useMemo(() => {
        return generateMixedContentHtml({
            content,
            backgroundColor,
            fontSize,
        });
    }, [content, backgroundColor, fontSize]);

    const handleMessage = useCallback((event) => {
        if (!isMountedRef.current) return;

        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'height' && data.height > 0) {
                setHeight(data.height + 10);
            }

            if (data.type === 'rendered') {
                setLoading(false);

                if (data.success) {
                    const elapsed = PerformanceLogger.endTimer(
                        startTimeRef.current,
                        'webview',
                        itemId
                    );
                    setRenderTime(elapsed);

                    if (onRenderComplete) {
                        onRenderComplete({ success: true, renderTime: elapsed });
                    }
                } else {
                    setError(data.error);
                    if (onError) {
                        onError(data.error);
                    }
                }
            }
        } catch (parseError) {
            console.warn('LatexWebView: Failed to parse message', parseError);
        }
    }, [itemId, onRenderComplete, onError]);

    const handleError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        setLoading(false);
        setError(nativeEvent.description || 'WebView loading error');

        if (onError) {
            onError(nativeEvent.description);
        }
    }, [onError]);

    return (
        <View style={[styles.container, { minHeight: height }]}>
            <WebView
                style={[styles.webview, { height }]}
                source={{ html }}
                originWhitelist={['*']}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleMessage}
                onError={handleError}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                cacheEnabled={true}
                cacheMode="LOAD_CACHE_ELSE_NETWORK"
                renderToHardwareTextureAndroid={true}
                androidLayerType="hardware"
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#2196F3" />
                </View>
            )}

            {showDebugInfo && !loading && (
                <View style={styles.debugOverlay}>
                    <Text style={styles.debugText}>
                        {renderTime !== null ? `${renderTime}ms` : '...'}
                    </Text>
                    {error && (
                        <Text style={styles.debugError}>Error</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    webview: {
        backgroundColor: 'transparent',
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugOverlay: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    debugText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'monospace',
    },
    debugError: {
        color: '#ff6b6b',
        fontSize: 10,
        marginLeft: 4,
    },
});

export default React.memo(LatexWebView);
