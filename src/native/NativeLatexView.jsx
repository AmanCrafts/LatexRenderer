import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { PerformanceLogger } from '../utils/PerformanceLogger';
import { parseLatexContent } from '../utils/SampleLatex';
import { isNativeAvailable, renderLatexToBase64 } from '../../modules/latex-native';

const latexCache = new Map();
const imageCache = new Map();
const MAX_CACHE_SIZE = 100;

const IS_NATIVE = Platform.OS === 'android' && isNativeAvailable();

export const getIsNativeMode = () => IS_NATIVE;

const generateKatexHtml = (latex, displayMode, fontSize) => {
    const escaped = latex.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ');
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>*{margin:0;padding:0}html,body{background:transparent;font-size:${fontSize}px;overflow:hidden}
#m{display:${displayMode ? 'block' : 'inline'};text-align:${displayMode ? 'center' : 'left'}}.katex{font-size:1em}</style>
</head><body><div id="m"></div><script>
try{katex.render('${escaped}',document.getElementById('m'),{displayMode:${displayMode},throwOnError:false});
window.ReactNativeWebView.postMessage(JSON.stringify({h:document.body.scrollHeight}));}catch(e){}</script></body></html>`;
};

const KatexFallback = React.memo(({ latex, displayMode, fontSize }) => {
    const [height, setHeight] = useState(displayMode ? 40 : 22);
    const onMsg = useCallback((e) => {
        try { const d = JSON.parse(e.nativeEvent.data); if (d.h > 0) setHeight(d.h + 2); } catch { }
    }, []);
    return (
        <WebView
            style={{ height, width: displayMode ? '100%' : 'auto', minWidth: 30, backgroundColor: 'transparent' }}
            source={{ html: generateKatexHtml(latex, displayMode, fontSize) }}
            scrollEnabled={false}
            onMessage={onMsg}
            originWhitelist={['*']}
            javaScriptEnabled
        />
    );
});

const NativeLatexImage = React.memo(({ latex, displayMode, fontSize }) => {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cacheKey = `img:${latex}:${fontSize}`;
        if (imageCache.has(cacheKey)) {
            setImageData(imageCache.get(cacheKey));
            setLoading(false);
            return;
        }

        renderLatexToBase64(latex, fontSize * 2, '#000000', '#ffffff').then((result) => {
            if (result.success) {
                const data = { uri: result.base64, width: result.width, height: result.height };
                imageCache.set(cacheKey, data);
                setImageData(data);
            }
            setLoading(false);
        });
    }, [latex, fontSize]);

    if (loading) return <ActivityIndicator size="small" color="#4caf50" />;
    if (!imageData) return <KatexFallback latex={latex} displayMode={displayMode} fontSize={fontSize} />;

    const scale = fontSize / 20;
    return (
        <Image
            source={{ uri: imageData.uri }}
            style={{ width: imageData.width * scale / 2, height: imageData.height * scale / 2 }}
            resizeMode="contain"
        />
    );
});

const MathRenderer = React.memo(({ latex, displayMode, fontSize }) => {
    if (IS_NATIVE) {
        return <NativeLatexImage latex={latex} displayMode={displayMode} fontSize={fontSize} />;
    }
    return <KatexFallback latex={latex} displayMode={displayMode} fontSize={fontSize} />;
});

const NativeLatexView = ({
    content = '',
    fontSize = 18,
    backgroundColor = '#ffffff',
    showDebugInfo = false,
    onRenderComplete = null,
    onError = null,
    itemId = '',
}) => {
    const [parsedSegments, setParsedSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [renderTime, setRenderTime] = useState(null);
    const [error, setError] = useState(null);
    const [cacheHit, setCacheHit] = useState(false);

    const startTimeRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        startTimeRef.current = PerformanceLogger.startTimer();
        setLoading(true);
        setError(null);

        const cacheKey = `native:${content}`;
        setCacheHit(latexCache.has(cacheKey));

        queueMicrotask(() => {
            if (!isMountedRef.current) return;

            try {
                const segments = parseLatexContent(content);

                if (latexCache.has(cacheKey)) {
                    PerformanceLogger.logCacheEvent(true);
                } else {
                    PerformanceLogger.logCacheEvent(false);
                    if (latexCache.size >= MAX_CACHE_SIZE) {
                        const firstKey = latexCache.keys().next().value;
                        latexCache.delete(firstKey);
                    }
                    latexCache.set(cacheKey, segments);
                }

                if (isMountedRef.current) {
                    setParsedSegments(segments);

                    const elapsed = PerformanceLogger.endTimer(
                        startTimeRef.current,
                        'native',
                        itemId
                    );
                    setRenderTime(elapsed);
                    setLoading(false);

                    if (onRenderComplete) {
                        onRenderComplete({ success: true, renderTime: elapsed });
                    }
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setError(err.message);
                    setLoading(false);

                    if (onError) {
                        onError(err.message);
                    }
                }
            }
        });
    }, [content, itemId]);

    const renderContent = useCallback(() => {
        if (loading) {
            return <ActivityIndicator size="small" color="#4caf50" />;
        }

        return (
            <View style={styles.contentContainer}>
                {parsedSegments.map((segment, index) => {
                    if (segment.type === 'text') {
                        return (
                            <Text key={index} style={[styles.text, { fontSize }]}>
                                {segment.content}
                            </Text>
                        );
                    } else if (segment.type === 'block-math') {
                        return (
                            <View key={index} style={styles.blockMathContainer}>
                                <MathRenderer
                                    latex={segment.content}
                                    displayMode={true}
                                    fontSize={fontSize}
                                />
                            </View>
                        );
                    } else {
                        return (
                            <View key={index} style={styles.inlineMathContainer}>
                                <MathRenderer
                                    latex={segment.content}
                                    displayMode={false}
                                    fontSize={fontSize}
                                />
                            </View>
                        );
                    }
                })}
            </View>
        );
    }, [loading, parsedSegments, fontSize]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {renderContent()}

            {showDebugInfo && !loading && (
                <View style={styles.debugOverlay}>
                    <Text style={styles.debugText}>
                        {renderTime !== null ? `${renderTime}ms` : '...'}
                    </Text>
                    {cacheHit && (
                        <Text style={styles.debugCache}>Cached</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 8,
        minHeight: 40,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    text: {
        color: '#333',
        lineHeight: 24,
    },
    blockMathContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 4,
    },
    inlineMathContainer: {
        marginHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    debugOverlay: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
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
    debugCache: {
        color: '#fff',
        fontSize: 9,
        marginLeft: 4,
    },
});

export default React.memo(NativeLatexView);

export const clearLatexCache = () => {
    latexCache.clear();
};

export const getCacheSize = () => {
    return latexCache.size;
};

export const preloadLatex = (expressions) => {
    expressions.forEach(expr => {
        const cacheKey = `native:${expr}`;
        if (!latexCache.has(cacheKey)) {
            latexCache.set(cacheKey, parseLatexContent(expr));
        }
    });
};

export const isUsingNativeRenderer = () => IS_NATIVE;
