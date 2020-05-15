"use strict";
var assert = require("cucumber-assert");
var webdriver = require("selenium-webdriver");

module.exports = function () {

  this.When(/^I load the Croissant Escape page$/, function (next) {
    this.driver.get("https://srajiang.github.io/great-escape/dist/");
    next();
  });

  this.Then(/^I should see title "([^"]*)"$/, function (titleMatch, next) {
    this.driver.getTitle().then(function (title) {
      assert.equal(
        title,
        titleMatch,
        next,
        "Expected title to be " + titleMatch
      );
    });
  });
};
