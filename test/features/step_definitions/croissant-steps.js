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

  this.Then(/^I should see user instructions "([^"]*)"$/, function (instructMatch, next) {
      let instruct = this.driver.findElement({ id: "player-instruct"});
      assert.equal(
        instruct,
        instructMatch,
        next,
        "Expected content to be" + instructMatch
      );
  });  

  this.Then(/^Volume off icon should not be displayed$/, function() {
    let volumeIcon = this.driver.findElement({ id: "volume-icon-off"});
    let display = window.getComputedStyle(volumeIcon).display;
    assert.equal(
      display,
      'none',
      next,
      'Expected display to be none'
    )
  });

};
