class PerformanceLoggerClass {
  constructor() {
    this.renderTimes = {
      webview: [],
      native: [],
    };
    this.cacheStats = {
      hits: 0,
      misses: 0,
    };
    this.listeners = [];
    this.maxEntries = 1000;
    this.sessionStart = Date.now();
    this.totalRenders = {
      webview: 0,
      native: 0,
    };
  }

  startTimer() {
    return Date.now();
  }

  endTimer(startTime, rendererType, latexId = '') {
    const endTime = Date.now();
    const elapsed = endTime - startTime;

    if (this.renderTimes[rendererType].length >= this.maxEntries) {
      this.renderTimes[rendererType].shift();
    }
    
    this.renderTimes[rendererType].push({
      time: elapsed,
      timestamp: endTime,
      latexId,
    });

    this.totalRenders[rendererType]++;

    this.notifyListeners({
      type: 'render',
      rendererType,
      elapsed,
      latexId,
    });

    return elapsed;
  }

  logCacheEvent(isHit) {
    if (isHit) {
      this.cacheStats.hits++;
    } else {
      this.cacheStats.misses++;
    }

    this.notifyListeners({
      type: 'cache',
      isHit,
      stats: { ...this.cacheStats },
    });
  }

  getStatistics(rendererType) {
    const times = this.renderTimes[rendererType].map(entry => entry.time);
    
    if (times.length === 0) {
      return {
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
        p95: 0,
        count: 0,
      };
    }

    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((acc, t) => acc + t, 0);
    const mean = sum / times.length;
    
    const medianIndex = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[medianIndex - 1] + sorted[medianIndex]) / 2
      : sorted[medianIndex];
    
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[Math.min(p95Index, sorted.length - 1)];

    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: p95,
      count: times.length,
      totalRenders: this.totalRenders[rendererType],
    };
  }

  getCacheStatistics() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 
      ? Math.round((this.cacheStats.hits / total) * 100) 
      : 0;

    return {
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      total,
      hitRate,
    };
  }

  estimateMemoryUsage(rendererType, itemCount) {
    const baseMemory = rendererType === 'webview' ? 2.5 : 0.1;
    const estimatedMB = baseMemory * itemCount;
    
    return {
      value: Math.round(estimatedMB * 10) / 10,
      unit: 'MB',
      warning: rendererType === 'webview' && itemCount > 20
        ? 'High memory usage - WebView instances consume significant memory.'
        : null,
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
      }
    });
  }

  reset() {
    this.renderTimes = {
      webview: [],
      native: [],
    };
    this.cacheStats = {
      hits: 0,
      misses: 0,
    };
    this.totalRenders = {
      webview: 0,
      native: 0,
    };
    this.sessionStart = Date.now();
    this.notifyListeners({ type: 'reset' });
  }

  getComparisonReport() {
    const webviewStats = this.getStatistics('webview');
    const nativeStats = this.getStatistics('native');
    const cacheStats = this.getCacheStatistics();

    const speedImprovement = webviewStats.mean > 0 && nativeStats.mean > 0
      ? Math.round((webviewStats.mean / nativeStats.mean) * 10) / 10
      : null;

    return {
      webview: webviewStats,
      native: nativeStats,
      cache: cacheStats,
      speedImprovement,
      sessionDuration: Math.round((Date.now() - this.sessionStart) / 1000),
    };
  }
}

export const PerformanceLogger = new PerformanceLoggerClass();

export const usePerformanceLogger = () => {
  return {
    startTimer: () => PerformanceLogger.startTimer(),
    endTimer: (startTime, rendererType, latexId) => 
      PerformanceLogger.endTimer(startTime, rendererType, latexId),
    logCacheEvent: (isHit) => PerformanceLogger.logCacheEvent(isHit),
    getStatistics: (rendererType) => PerformanceLogger.getStatistics(rendererType),
    getCacheStatistics: () => PerformanceLogger.getCacheStatistics(),
    estimateMemoryUsage: (rendererType, count) => 
      PerformanceLogger.estimateMemoryUsage(rendererType, count),
    getComparisonReport: () => PerformanceLogger.getComparisonReport(),
    subscribe: (listener) => PerformanceLogger.subscribe(listener),
    reset: () => PerformanceLogger.reset(),
  };
};

export default PerformanceLogger;
