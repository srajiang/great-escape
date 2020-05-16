'use strict';

var webdriver = require('selenium-webdriver'); 
var browserstack = require('browserstack-local');

var config_file = '../../conf/' + (process.env.CONFIG_FILE || 'single') + '.conf.js';
var config = require(config_file).config; // gets the correct config file 

var username = process.env.BROWSERSTACK_USERNAME || config.user; // sets user 
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY || config.key; // sets access key

var createBrowserStackSession = function (config, caps) {  // a function that takes the config and a var called caps
  return new webdriver.Builder().  // new instance of Webdriver Builder with the specified capabilities and the browsterstack server
    usingServer('http://' + config.server + '/wd/hub').
    withCapabilities(caps).
    build();
}

var myHooks = function () {
  var bs_local = null;

  this.Before(function (scenario, callback) {
    var world = this;
    var task_id = parseInt(process.env.TASK_ID || 0);
    var caps = config.capabilities[task_id];
    caps['browserstack.user'] = username;   // gets user and access key
    caps['browserstack.key'] = accessKey;   // gets user and access key 

    if (caps["browserstack.local"]) {
      // Code to start browserstack local before start of test and stop browserstack local after end of test
      bs_local = new browserstack.Local();
      bs_local.start({ 'key': accessKey }, function (error) {
        if (error) return console.log(error.red);

        world.driver = createBrowserStackSession(config, caps);
        callback();
      });
    }
    else {
      world.driver = createBrowserStackSession(config, caps);
      callback();
    }
  });

  this.After(function (scenario, callback) {
    this.driver.quit().then(function () {
      if (bs_local) {
        bs_local.stop(callback);
      }
      else callback();
    });
  });
};

module.exports = myHooks;
