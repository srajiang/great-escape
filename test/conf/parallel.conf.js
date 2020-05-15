exports.config = {
  user: "sarahjiang1",
  key: "s5yXSauqiUo8xAD2zz2F",
  server: "hub-cloud.browserstack.com",
  commonCapabilities: {
    name: "parallel_test",
    build: "cucumber-js-browserstack",
  },
  capabilities: [
    {
      browserName: "chrome",
    },
    {
      browserName: "firefox",
    },
    {
      browserName: "safari",
      browserVersion: "12",
    },
    {
      browserName: "internet explorer",
      browserVersion: "11",
    },
    {
      browserName: "edge",
    },
  ],
};

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps) {
  for (var i in exports.config.commonCapabilities)
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
