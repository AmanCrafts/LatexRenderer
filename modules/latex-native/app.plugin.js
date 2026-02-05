const { withProjectBuildGradle, withSettingsGradle } = require('@expo/config-plugins');

const withLatexNative = (config) => {
    config = withSettingsGradle(config, (config) => {
        if (!config.modResults.contents.includes(':latex-native')) {
            config.modResults.contents += `
include ':latex-native'
project(':latex-native').projectDir = new File(rootProject.projectDir, '../modules/latex-native/android')
`;
        }
        return config;
    });

    config = withProjectBuildGradle(config, (config) => {
        if (!config.modResults.contents.includes('jitpack.io')) {
            config.modResults.contents = config.modResults.contents.replace(
                /allprojects\s*\{[\s\S]*?repositories\s*\{/,
                (match) => `${match}
        maven { url 'https://jitpack.io' }`
            );
        }
        return config;
    });

    return config;
};

module.exports = withLatexNative;
