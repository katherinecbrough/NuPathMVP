module.exports = ({ config }) => {
  const isDev = process.env.EAS_BUILD_PROFILE === "development" || __DEV__;

  return {
    ...config,
    name: isDev ? "NuPath (Dev)" : "NuPath",
    ios: {
      ...config.ios,
      bundleIdentifier: isDev
        ? "com.anonymous.SafePlace.dev"
        : "com.anonymous.SafePlace",
    },
    android: {
      ...config.android,
      package: isDev
        ? "com.anonymous.SafePlace.dev"
        : "com.anonymous.SafePlace",
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: "b17a75ce-2c57-4a30-944e-23723925c6b4",
      },
    },
  };
};
