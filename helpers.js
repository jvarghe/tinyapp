// HELPER FUNCTIONS

// This function generates a short 6-character alphanumeric string to serve as
// short IDs for newly created URLs.
const generateRandomString = function() {

  let stringLength = 6;
  let randomString = "";
  const characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Iterate `stringLength` number of times...
  for (let i = 0; i < stringLength; i++) {

    // ...and push a random character from `characterSet` into `randomString`.
    randomString += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length));

  }

  return randomString;

};


// This function searches the `users` object by email to check if the email
// being added already exists.
const findUserByEmail = function(email, usersDB) {

  let userExists = null;

  // Iterate over the users in the `users` object.
  for (let user in usersDB) {

    // If a user email is found in the `users` database...
    if (usersDB[user].email === email) {

      // ...the user exists in the database; load the user's ID into
      // `userExists`.
      userExists = usersDB[user].id;

    }
  }

  // ...or if nothing is found, return `null`.
  return userExists;
};


// This function queries `urlDatabase` to find all URLs which belong a user.
// The function will create and add the URLs to an object and return it. The
// user's `id` must be provided as an argument.
const urlsForUser = function(id, urlDB) {

  // Create an object to store the logged in user's URLs.
  let loggedInUsersURLs = {};

  // Iterate over the `urlDatabase`.
  for (const shortURL in urlDB) {

    // If the passed in user ID matches an user ID in the database...
    if (id === (urlDB[shortURL].userID)) {

      // ...add the key and value to `loggedInUsersURLs`.
      loggedInUsersURLs[shortURL] = urlDB[shortURL];

    }

  }

  return loggedInUsersURLs;
};


// This function takes in a `user` object, and `req` and `res` objects from
// the calling function. It will try to authenticate the user, but if it fails,
// it will return `false`.
const authenticateUser = function(currentUser, req, res, urlDB) {

  let userAuthenticated = false;

  // Check 1: If the current user is NOT logged in, show them an error message.
  if (!currentUser) {

    res.status(401).send("Log in to access this URL!");

  }


  // Check 2: See if the currently logged in user has authorization to access
  // this URL.
  const usersURLs = urlsForUser(currentUser, urlDB);
  const shortURL = req.params.id;

  if (!usersURLs[shortURL]) {

    res.status(401).send("Sorry, you are NOT the owner of this URL!");

    // If both checks pass, the user must be logged in and have access to this
    // URL.
  } else {

    userAuthenticated = true;
    return userAuthenticated;

  }

};



// EXPORTS
module.exports = {
  generateRandomString,
  findUserByEmail,
  urlsForUser,
  authenticateUser
};