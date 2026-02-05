import { Platform } from 'react-native';

let LatexNativeModule = null;

if (Platform.OS === 'android') {
    try {
        const ExpoModulesCore = require('expo-modules-core');
        LatexNativeModule = ExpoModulesCore.requireNativeModule('LatexNative');
    } catch (e) {
        LatexNativeModule = null;
    }
}

export const isNativeAvailable = () => {
    if (!LatexNativeModule) return false;
    try {
        return typeof LatexNativeModule.isAvailable === 'function' ? LatexNativeModule.isAvailable() : !!LatexNativeModule;
    } catch {
        return false;
    }
};

export const renderLatexToBase64 = async (latex, fontSize = 40, textColor = '#000000', backgroundColor = '#ffffff') => {
    if (!LatexNativeModule) {
        return { success: false, error: 'Native module not available', base64: '', width: 0, height: 0 };
    }
    try {
        const result = await LatexNativeModule.renderToBase64Async(latex, fontSize, textColor, backgroundColor);
        return result;
    } catch (e) {
        return { success: false, error: e.message, base64: '', width: 0, height: 0 };
    }
};

export const renderLatexSync = (latex, fontSize = 40, textColor = '#000000', backgroundColor = '#ffffff') => {
    if (!LatexNativeModule) {
        return { success: false, error: 'Native module not available', base64: '', width: 0, height: 0 };
    }
    try {
        return LatexNativeModule.renderToBase64(latex, fontSize, textColor, backgroundColor);
    } catch (e) {
        return { success: false, error: e.message, base64: '', width: 0, height: 0 };
    }
};

export default {
    isNativeAvailable,
    renderLatexToBase64,
    renderLatexSync,
};
