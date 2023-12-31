// IMPORTS
const { assert } = require("chai");
const { findUserByEmail } = require("../helpers.js");


// MOCHA & CHAI TESTS
const testUsers = {

  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },

  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

};


describe("getUserByEmail", function() {

  it("Test should return a user with valid email", function() {

    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);

  });


  it("Test should return `null` for an invalid email", function() {

    const user = findUserByEmail("Non-Existent-Email@example.com", testUsers);
    const expectedUserID = null;
    assert.strictEqual(user, expectedUserID);

  });

});