module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: []  // leer lassen, kein "expo-router/babel"
  };
};
