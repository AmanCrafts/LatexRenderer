import { NativeModules, Platform } from 'react-native';

const { LatexViewManager } = NativeModules;

const isNativeAvailable = Platform.OS === 'android' && LatexViewManager != null;

const NativeLatexManager = {
  isAvailable: () => isNativeAvailable,
  
  renderLatex: async (latex, options = {}) => {
    if (!isNativeAvailable) {
      throw new Error('Native LaTeX module not available. Use development build.');
    }
    
    return await LatexViewManager.renderLatex(latex, {
      fontSize: options.fontSize || 18,
      color: options.color || '#000000',
      ...options,
    });
  },
  
  clearCache: async () => {
    if (!isNativeAvailable) {
      return false;
    }
    
    return await LatexViewManager.clearCache();
  },
  
  prerender: async (expressions) => {
    if (!isNativeAvailable) {
      return false;
    }
    
    return await LatexViewManager.prerender(expressions);
  },
  
  getInfo: () => ({
    platform: Platform.OS,
    nativeAvailable: isNativeAvailable,
    library: 'JLaTeXMath',
  }),
};

export default NativeLatexManager;
