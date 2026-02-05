import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LatexWebView from '../webview/LatexWebView';
import { QUICK_FORMULAS } from '../utils/SampleLatex';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LatexPlayground = ({ onBack }) => {
    const [latexInput, setLatexInput] = useState('E = mc^2');
    const [displayMode, setDisplayMode] = useState('inline');
    const [fontSize, setFontSize] = useState(20);
    const [showQuickFormulas, setShowQuickFormulas] = useState(true);
    const inputRef = useRef(null);

    const getFormattedLatex = useCallback(() => {
        if (displayMode === 'block') {
            return `$$\n${latexInput}\n$$`;
        }
        return `$${latexInput}$`;
    }, [latexInput, displayMode]);

    const insertFormula = useCallback((formula) => {
        setLatexInput(prev => {
            if (prev.trim()) {
                return `${prev} ${formula}`;
            }
            return formula;
        });
    }, []);

    const clearInput = useCallback(() => {
        setLatexInput('');
        inputRef.current?.focus();
    }, []);

    const handleFontSizeChange = useCallback((delta) => {
        setFontSize(prev => Math.max(12, Math.min(40, prev + delta)));
    }, []);

    const exampleFormulas = [
        { label: 'Quadratic', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
        { label: 'Integral', latex: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}' },
        { label: 'Matrix', latex: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}' },
        { label: 'Sum', latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
        { label: 'Derivative', latex: '\\frac{d}{dx}\\left(x^n\\right) = nx^{n-1}' },
        { label: 'Trig', latex: '\\sin^2\\theta + \\cos^2\\theta = 1' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>LaTeX Playground</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inputSection}>
                        <View style={styles.inputHeader}>
                            <Text style={styles.sectionTitle}>Enter LaTeX</Text>
                            <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            value={latexInput}
                            onChangeText={setLatexInput}
                            placeholder="Type your LaTeX formula here..."
                            placeholderTextColor="#999"
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View style={styles.modeRow}>
                            <Text style={styles.modeLabel}>Display Mode:</Text>
                            <View style={styles.modeButtons}>
                                <TouchableOpacity
                                    style={[styles.modeButton, displayMode === 'inline' && styles.modeButtonActive]}
                                    onPress={() => setDisplayMode('inline')}
                                >
                                    <Text style={[styles.modeButtonText, displayMode === 'inline' && styles.modeButtonTextActive]}>
                                        Inline ($...$)
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modeButton, displayMode === 'block' && styles.modeButtonActive]}
                                    onPress={() => setDisplayMode('block')}
                                >
                                    <Text style={[styles.modeButtonText, displayMode === 'block' && styles.modeButtonTextActive]}>
                                        Block ($$...$$)
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.fontSizeRow}>
                            <Text style={styles.modeLabel}>Font Size: {fontSize}px</Text>
                            <View style={styles.fontSizeButtons}>
                                <TouchableOpacity
                                    style={styles.fontSizeButton}
                                    onPress={() => handleFontSizeChange(-2)}
                                >
                                    <Text style={styles.fontSizeButtonText}>A-</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.fontSizeButton}
                                    onPress={() => handleFontSizeChange(2)}
                                >
                                    <Text style={styles.fontSizeButtonText}>A+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.previewSection}>
                        <Text style={styles.sectionTitle}>Preview</Text>
                        <View style={styles.previewContainer}>
                            {latexInput.trim() ? (
                                <LatexWebView
                                    content={getFormattedLatex()}
                                    fontSize={fontSize}
                                    backgroundColor="#ffffff"
                                    showDebugInfo={false}
                                />
                            ) : (
                                <Text style={styles.placeholderText}>
                                    Your formula will appear here...
                                </Text>
                            )}
                        </View>
                        <View style={styles.rawLatexContainer}>
                            <Text style={styles.rawLatexLabel}>Raw LaTeX:</Text>
                            <Text style={styles.rawLatexText}>{getFormattedLatex()}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.toggleQuickFormulas}
                        onPress={() => setShowQuickFormulas(!showQuickFormulas)}
                    >
                        <Text style={styles.toggleQuickFormulasText}>
                            {showQuickFormulas ? '▼ Quick Insert' : '▶ Quick Insert'}
                        </Text>
                    </TouchableOpacity>

                    {showQuickFormulas && (
                        <View style={styles.quickFormulasSection}>
                            <Text style={styles.quickFormulasLabel}>Symbols & Operators</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.quickFormulasScroll}
                            >
                                {QUICK_FORMULAS.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.quickFormulaButton}
                                        onPress={() => insertFormula(item.latex)}
                                    >
                                        <Text style={styles.quickFormulaText}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.examplesSection}>
                        <Text style={styles.sectionTitle}>Example Formulas</Text>
                        <Text style={styles.examplesSubtitle}>Tap to load into editor</Text>
                        <View style={styles.examplesGrid}>
                            {exampleFormulas.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.exampleButton}
                                    onPress={() => setLatexInput(item.latex)}
                                >
                                    <Text style={styles.exampleLabel}>{item.label}</Text>
                                    <View style={styles.examplePreview}>
                                        <LatexWebView
                                            content={`$${item.latex}$`}
                                            fontSize={14}
                                            backgroundColor="#f8f9fa"
                                            showDebugInfo={false}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.tipsSection}>
                        <Text style={styles.sectionTitle}>LaTeX Tips</Text>
                        <View style={styles.tipsList}>
                            <Text style={styles.tipItem}>• Use <Text style={styles.tipCode}>\frac{'{a}'}{'{b}'}</Text> for fractions</Text>
                            <Text style={styles.tipItem}>• Use <Text style={styles.tipCode}>^{'{n}'}</Text> for superscripts, <Text style={styles.tipCode}>_{'{n}'}</Text> for subscripts</Text>
                            <Text style={styles.tipItem}>• Use <Text style={styles.tipCode}>\sqrt{'{x}'}</Text> for square roots</Text>
                            <Text style={styles.tipItem}>• Use <Text style={styles.tipCode}>\int</Text>, <Text style={styles.tipCode}>\sum</Text>, <Text style={styles.tipCode}>\prod</Text> for calculus</Text>
                            <Text style={styles.tipItem}>• Greek letters: <Text style={styles.tipCode}>\alpha</Text>, <Text style={styles.tipCode}>\beta</Text>, <Text style={styles.tipCode}>\gamma</Text>, etc.</Text>
                            <Text style={styles.tipItem}>• Use <Text style={styles.tipCode}>\\</Text> for new lines in block mode</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#6200ee',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 16,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 60,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    inputSection: {
        backgroundColor: '#fff',
        margin: 12,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#ff5252',
        borderRadius: 6,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: '#fafafa',
        color: '#333',
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        flexWrap: 'wrap',
    },
    modeLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 12,
    },
    modeButtons: {
        flexDirection: 'row',
        flex: 1,
    },
    modeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    modeButtonActive: {
        backgroundColor: '#6200ee',
    },
    modeButtonText: {
        fontSize: 13,
        color: '#666',
    },
    modeButtonTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    fontSizeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    fontSizeButtons: {
        flexDirection: 'row',
    },
    fontSizeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginLeft: 8,
    },
    fontSizeButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    previewSection: {
        backgroundColor: '#fff',
        margin: 12,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    previewContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 16,
        marginTop: 12,
        minHeight: 80,
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    rawLatexContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    rawLatexLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    rawLatexText: {
        fontSize: 13,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        color: '#333',
    },
    toggleQuickFormulas: {
        marginHorizontal: 12,
        paddingVertical: 12,
    },
    toggleQuickFormulasText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6200ee',
    },
    quickFormulasSection: {
        marginHorizontal: 12,
        marginBottom: 12,
    },
    quickFormulasLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    quickFormulasScroll: {
        paddingRight: 12,
    },
    quickFormulaButton: {
        backgroundColor: '#e8e0ff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
    },
    quickFormulaText: {
        fontSize: 13,
        color: '#6200ee',
        fontWeight: '500',
    },
    examplesSection: {
        backgroundColor: '#fff',
        margin: 12,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    examplesSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    examplesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    exampleButton: {
        width: (SCREEN_WIDTH - 60) / 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        margin: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    exampleLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    examplePreview: {
        height: 50,
        justifyContent: 'center',
    },
    tipsSection: {
        backgroundColor: '#e3f2fd',
        margin: 12,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
    },
    tipsList: {
        marginTop: 8,
    },
    tipItem: {
        fontSize: 13,
        color: '#333',
        marginBottom: 6,
        lineHeight: 20,
    },
    tipCode: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        backgroundColor: '#bbdefb',
        paddingHorizontal: 4,
        borderRadius: 3,
        color: '#1565c0',
    },
});

export default LatexPlayground;
