/* M03 W06 CHALLENGE: TINY APP
 *
 *                         A NOTE TO INVIGILATORS!!!
 *
 * This application is not only intended for submission to LHL, but also as a
 * reference for future education. As a result, it has been heavily commented
 * and disused code paths have been deliberately left behind. Please bear this
 * in mind when scoring this project.
 *
 * If you want to fold all comments to a single line while marking, in VS Code
 * apply this key chord: `Ctrl+K, Ctrl+/`. To unfold all comments again:
 * `Ctrl+K, Ctrl+J`.
 *
 *
 * CHALLENGE
 *
 * This week we will start the next multi-day assignment, which will guide you
 * through creating a fully-functioning web-server and API. For this assignment,
 * we will create a URL shortening service similar to TinyURL, Bitly, or Goo.gl.
 *
 * In essence, a URL Shortener is a service that takes a regular URL and
 * transforms it into an encoded version, which redirects back to the original
 * URL. For example:
 *
 *    https://www.lighthouselabs.ca → http://goo.gl/6alQXu
 *
 * In order to create a service that shortens URLs we will need to apply the
 * concepts that we learned such as HTTP redirection and APIs. Additionally,
 * we will learn new concepts including the fundamentals of web servers, what
 * purpose middleware serves, event-driven programming, and template engines.
 *
 * We will use the specific technologies to illustrate these concepts:
 *
 *     * Web Server: Node.js
 *     * Middleware: Express
 *     * Template Engine: EJS
 *
 *
 * ON THE ORDER OF ENDPOINTS
 *
 * The order of route definitions matters! The GET `/urls/new` route needs to
 * be defined before the GET `/urls/:id` route. Routes defined earlier will
 * take precedence, so if we place this route after the `/urls/:id` definition,
 * any calls to `/urls/new` will be handled by app.get("/urls/:id", ...)
 * because Express will think that `new` is a route parameter. A good rule of
 * thumb to follow is that routes should be ordered from most specific to least
 * specific.
 *
 *
 * COMPLETED ENDPOINTS FOR THE FOLLOWING ROUTES
 *
 *     * GET  /
 *     * GET  /hello
 *     * GET  /urls.json
 *
 *     * GET  /urls
 *     * GET  /urls/new
 *     * GET  /urls/:id
 *     * GET  /u/:id
 *     * GET  /login
 *     * GET  /register
 *
 *     * POST /urls/:id/delete
 *     * POST /urls
 *     * POST /login
 *     * POST /logout
 *     * POST /register
 *
 */


// IMPORTS
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


// ASSIGNMENTS

// Create an Express application.
const app = express();

// Define a default port for the project.
const PORT = 8080;

// Add Morgan to the program.
app.use(morgan("dev"));

// Add EJS to the project as the template engine.
app.set("view engine", "ejs");

/* Add URL-Encoding Parser
 *
 * Add parser to read and parse URL-encoded data. Used mainly for HTTP requests
 * that make permanent changes like POST (also PUT and DELETE??). These requests
 * make permanent changes to persistent storage, and so they must specify such
 * changes. For some requests, they are passed in via the URL. Such data is
 * URL-encoded and must be decoded before it can be used.
 *
 * "When our browser submits a POST request, the data in the request body is
 * sent as a `Buffer`. While this data type is great for transmitting data, it's
 * not readable for us humans. To make this data readable, we will need to use
 * another piece of middleware which will translate, or parse the body. This
 * feature is part of Express."
 *
 * "The `body-parser` library will convert the request body from a `Buffer` into
 * string that we can read. It will then add the data to the `req` (request)
 * object under the key `body`. (If you find that `req.body` is `undefined`,
 * it may be that the `body-parser` middleware is not being run correctly.)
 *
 * So using [`/urls/new` form] as an example, the data in the input field will
 *  be available to us in the `req.body.longURL` variable, which we can store
 * in our `urlDatabase` object. (Later we'll store these URLs in a real
 * database, but for now we're focusing on the communication between server and
 * client.)"
 */
app.use(express.urlencoded({ extended: true }));


// Add `cookie-parser` middleware to the project so that it automatically parses
// cookies and makes their data available.
app.use(cookieParser());



// DATA SOURCES

// An object with a list of URLs. It simulates a data source like a database.
const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com",
  "5JzOvt": "https://www.yahoo.ca",
  "9wuFBu": "https://duckduckgo.com/",
  "nSwQM7": "https://www.startpage.com"
};


// An object with a list of Users. It simulates a database.
const users = {

  admin57: {
    id: "admin57",
    email: "admin57@example.com",
    password: "purple-monkey-dinosaur",
  },

  user119: {
    id: "user119",
    email: "user119@example.com",
    password: "dishwasher-funk",
  },

};



// BOOT SERVER
// The server program launches, listens for incoming requests at the given port
// (8080), and logs a greeting to the console.
app.listen(PORT, () => {
  console.log(`Tiny App is listening on port ${PORT}!`);
});



// REQUEST/RESPONSE PIPELINE

// TEST ROUTES

// A default route to serve as "Hello World" to those who visit `.../`.
app.get("/", (req, res) => {
  res.send("Hello!");
});


// A test route that returns HTML in the response body to requests for
// `.../hello`.
app.get("/hello", (req, res) => {

  // `Hello World` wrapped in HTML tags.
  res.send("<html><body>Hello <b>World</b></body></html>\n");

});


// A GET request to `/urls.json` will trigger this endpoint. It will query and
// return the contents of the URL database to the client as a JSON object. Not
// user-friendly at all.
app.get("/urls.json", (req, res) => {

  // This endpoint will return the data from `urlDatabase` as a JSON file.
  // Note that the response method being used `.json()`.
  res.json(urlDatabase);

});



// MAIN ROUTE HANDLERS

// GET ENDPOINTS

/* GET `/urls/:id`. Corresponds to `.../urls/[short-URL]` [urls_show.ejs]
 *
 * Route handler for GET `/urls:id`, where `:id` stands for the short URL.
 * The `:id` value is dynamic; it will be a short 6-digit alphanumeric value
 * that looks like this: `f20Z4k`. `:id` is a route parameter.
 *
 * ROUTE PARAMETERS
 *
 * If you start the server and go to `http://localhost:8080/urls/[Short-URL]`,
 * then `Short-URL` is the value of `:id` Route Parameter. It gets passed in
 * via the URL and is added to the request body. When the request arrives at
 * the backend, Express.js loads this value into the `req.params.id` property.
 * From there, you can load it into the view, where it can be used.
 *
 *
 * TRIGGERING `/urls/:id`
 *
 * In this particular program, `:id` comes from either the URL database,
 * or is generated by POST `/urls` when the user adds a new long URL to the
 * program or updates an existing one. New URLs are created at `.../urls/new`
 * and existing ones can be updated at `.../urls`.
 *
 * Re-directs from POST `/urls`; Shows the user their newly created short URL.
 */
app.get("/urls/:id", (req, res) => {

  console.log(req.params.id);

  // Extract the `:id` value from the request object. You can find it in the
  // `request.params.id` property.
  const templateVariables = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: req.cookies["user_id"]
  };

  // If you start the server, go its webpage and go to `.../urls/[Short-Id]`
  // and pass in an existing short ID, the line below will print out the
  // `templateVariable` object's elements, like this:
  //
  //     { id: 'b2xVn2', longURL: 'http://www.lighthouselabs.ca' }
  //
  // console.log(templateVariables);

  // Invoke the template engine, ask for the view called `urls_show.ejs` and
  // pass in the `templateVariables` object. Embed values from it in the view.
  res.render("urls_show.ejs", templateVariables);

});


// GET `/urls/new`. Corresponds to `.../urls/new` [urls_new.ejs]
//
// This endpoint returns a web page where you can add new URLs to the database.
// If the user enter a new URL and hits `Submit`, it will trigger the POST
// `/urls` endpoint.
app.get("/urls/new", (req, res) => {

  const templateVariables = {
    user: req.cookies["user_id"]
  };


  // Note that if you DON'T have any information to pass into the view, you
  // can just specify the view name, as shown here.
  res.render("urls_new", templateVariables);

});


// GET `/urls`. Corresponds to `.../urls` [urls_index.ejs]
//
// This endpoint returns a web page which displays a formatted, user-friendly
// list of all the URLs in the database. Both short & long URLs are displayed.
app.get("/urls", (req, res) => {

  // Get the current cookie.
  const currentUser = req.cookies["user_id"];

  // If you are sending data to a view, even a single variable, the convention
  // is to wrap it in an object called `templateVars`.
  const templateVariables = {
    urls: urlDatabase,
    // Pass the currentUser into the template below.
    user: currentUser
  };


  // Returns the `urls_index.ejs` template. Embeds values from `urlDatabase`
  // and `Users` in it.
  res.render("urls_index.ejs", templateVariables);

});


// GET `/u/:id`. Corresponds to `.../urls/[short-URL]` [Opens long URL]
//
// After the user has created a new link and added it to the database, they
// will be re-directed to `/urls/:id`, showing them them both the long and
// short URL. If the user were to click on the short URL, it should trigger
// this endpoint. It will re-direct them to the actual website (the long URL).
app.get("/u/:id", (req, res) => {

  // Check if the short URL exists in `urlDatabase`; if it doesn't, send a
  // 404 error.
  if (req.params.id in urlDatabase !== true) {
    res.status(404).send();
  }

  // Extract the short URL and pass it in to the URL database to find the
  // long URL.
  const fullURL = urlDatabase[req.params.id];

  // Re-direct the user to the long web page. If successful, the re-direct
  // should have an HTTP status code of `302 Found`.
  res.redirect(fullURL);

});


// GET `/register`. Corresponds to `.../register` [urls_register.ejs]
//
// This is the new user registration web page.
app.get("/register", (req, res) => {


  const templateVariables = {
    user: req.cookies["user_id"]
  };

  res.render("urls_register.ejs", templateVariables);

});


// GET `/login`. Corresponds to `.../login`. [urls_login.ejs]
//
// This is the user login page.
app.get("/login", (req, res) => {


  const templateVariables = {
    user: req.cookies["user_id"]
  };

  res.render("urls_login.ejs", templateVariables);

});



// POST ENDPOINTS

// POST `/urls/:id/delete`. When the user click on the `Delete` button on the
// `.../urls` web page (urls_index.ejs), it will trigger this endpoint. It
// will take the incoming `:id` value and delete the record associated with it
// from the URL database. It will then re-direct to `.../urls`.
app.post("/urls/:id/delete", (req, res) => {

  // Find the id (short URL) of the long URL that is to be deleted.
  const urlToDelete = req.params.id;

  // Delete this record from the URL database.
  delete urlDatabase[urlToDelete];

  // Check if deletion is happening properly.
  // console.log(urlDatabase);

  // After deletion, re-direct the client to the index page.
  res.redirect("/urls");

});


// POST `/urls/:id`. It will be called from `.../urls` (urls_index.ejs). This
// endpoint gets triggered when the user tries to update an existing record by
//  passing in a new long URL.
app.post("/urls/:id", (req, res) => {

  // Store the returned short URL in `id`.
  const shortURL = req.params.id;

  // The new replacement URL should be coming in via the `Update` form's `name`
  // attribute.
  const fullNewURL = req.body.longURL;

  // Update the database with the
  urlDatabase[shortURL] = fullNewURL;

  // Log database to check that the URL has been updated.
  // console.log(urlDatabase);

  // After updating the database, re-direct the web page to `urls_show.ejs`,
  // so that the user can see the updated list of URLs.
  res.redirect("/urls");

});


// POST `/urls`. This endpoint is triggered when the user enters a new URL into
// `urls_new.ejs` and presses `Submit`. It stores the URL in the database and
// re-directs the client to GET `/urls/:id`, where the user can see both long
// and short versions of the URL they just entered.
app.post("/urls", (req, res) => {

  // console.log(req.body); // Log the POST request body to the console.

  // Call `generateRandomString()` to create a short 6-character alphanumeric
  // string to serve as the short URL.
  const newKey = generateRandomString();

  // Extract the long URL value entered into the form from the request body.
  const fullURL = req.body.longURL;

  // Check if the correct values have been added to the project.
  // console.log(id, fullURL);

  // Add the new key and value to the `urlDatabase` project.
  urlDatabase[newKey] = fullURL;

  // Log it to console to check the values.
  // console.log(urlDatabase);

  // Return a response with code 200 to let the client know that everything
  // went well...
  res.status(200);

  // ...and re-direct them to page where they can see values they entered.
  res.redirect(`/urls/${newKey}`);

});


// POST `/login`. This endpoint is triggered whenever the user enters their
// credentials in the `.../login` page and hits "Submit". It extracts the
// credentials from the form, authenticates the user, creates a cookie, and
// stores user's ID within the cookie. Then, this endpoint returns a response
// with the cookie.
//
// The cookie now lives in the client. Whenever the client makes a request, the
// cookie is forwarded to the server, allowing it to recognize the client as a
// legitimately authenticated user. The client will continue send the cookie
// with every request until the browser's cache is cleared.
app.post("/login", (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // AUTHENTICATING THE ATTEMPTED LOGIN

  // Validate the `email` and `password` fields: Check if either is empty...
  // if they are reject the login attempt.
  if ((userEmail === "") || (userPassword === "")) {

    res.status(400).send("Email and/or password fields cannot be empty.");

  }


  // If both fields have been filled, now its time to check if the entered
  // email address already exists within the `users` object. If it does NOT
  // exist, reject the login attempt...
  if (!findUserByEmail(userEmail)) {

    // We are deliberately not explaining the reason for the failure as a
    // security measure.
    res.status(403).send("Login Attempt Failed!");


    // ...if the email address does exist in the `users` object, then check if
    // the password entered matches the one on file.
  } else {

    // If the user is found in the "database", extract the `user` object.
    const currentUser = findUserByEmail(userEmail);

    // Check whether the two passwords match...
    if (userPassword === users[currentUser].password) {

      // ...and if they do, load the current user's ID into the templateVars
      // [NOTE: It's still not clear to me whether we should pass the full
      // `user` object or just the user's ID to the template. I'm going with
      // the ID because of a mentor's suggestion.].
      const templateVariables = {
        user: users[currentUser].id,
      };

      res.cookie("user_id", templateVariables);
      res.redirect("/urls");

      // ... if the passwords DON'T match, reject the login attempt.
    } else {

      res.status(403).send("Login Attempt Failed!");

    }

  }

});


// POST `/logout`. This endpoint can be triggered from anywhere, because the
// form that posts to it lives in `_header.ejs`. This is the Log Out form, which
// exists only for logged in users. When the user hits `Logout`, it will send
// the `user_id` cookie to this endpoint. The endpoint will delete this
// cookie, logging out this user, and redirecting to `.../urls`.
app.post("/logout", (req, res) => {

  // NOTE: To avoid hard-coding the cookie name, get the cookie's name from the
  // cookie and pass that in as a variable.

  // Collect all incoming cookies.
  const incomingCookies = req.cookies;

  // Convert the keys into an array...
  const cookieArray = Object.keys(incomingCookies);

  // ...and extract the first (and only) cookie name.
  const cookieName = cookieArray[0];


  // Clear this cookie and log out the user.
  res.clearCookie(cookieName);

  // Re-direct to the home page.
  res.redirect("/urls");

});


// POST `/register`. This endpoint will be triggered from `.../register`, when
// the user fills out the form and presses `Submit`. The client will collect
// and forward user data to this endpoint. It will create a user object,
// populate it form data and push it into the `users` object. Then, it will
// create a new cookie to track the new user. Finally, it will re-direct to
// `.../urls`.
app.post("/register", (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // TRYING TO ADD A NEW USER TO THE `USERS` OBJECT
  // Validate the `email` and `password` fields: Check if either is empty...
  if ((userEmail === "") || (userPassword === "")) {
    res.status(400).send("Email and/or password fields cannot be empty.");

    // ... then check if the newly-entered email already exists within the
    // `users` object. If it does, reject the creation attempt...
  } else if (findUserByEmail(userEmail)) {

    res.status(400).send("Email already exists!");

    // ...but if it does not, add the new user to the `users` object.
  } else {

    /* CREATING A NEW USER
    *
    * Once the user's credentials have been validated and found to be a new user,
    * a new user object should be created. However, because it's going to be
    * stored in the `users` object, it will need a key. If you look at the
    * `users` object, its `key` value of each user object and the `id` values
    * within each user object are the same. Therefore, we need to generate a new
    * name and use it in two places.
    */

    // Create a random string for the key's name.
    const keyName = generateRandomString();

    // Create a new user object and populate it with data from the registration
    // form.
    const newUserObject = {
      // Set the `id` equal to `keyName`.
      id: keyName,
      email: userEmail,
      password: userPassword
    };

    // Load it into the `users` object.
    users[keyName] = newUserObject;

    // Check if new user was properly created.
    // console.log(users[keyName]);

    // Create a new cookie called `user_id`. NOTE: The instructions for this
    // section come from Week 7 > User Registration > Registering New Users >
    // Section `Passing the `user` Object to the `_header``. ACCORDING TO A
    // MENTOR, THIS IS HIGHLY MISLEADING! You are NOT passing the `user` object
    // to any view, only the `user_id` value (Example: admin57) from the cookie.
    res.cookie("user_id", keyName);
    res.redirect("/urls");
  }

});



// HELPER FUNCTIONS
// This function generates a short 6-character alphanumeric string to serve as
// short IDs for newly created URLs.
const generateRandomString = function() {

  let stringLength = 6;
  let randomString = "";
  const characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < stringLength; i++) {
    randomString += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length));
  }

  return randomString;

};


// This function searches the `users` object by email to check if the email
// being added already exists.
const findUserByEmail = function(email) {

  let userExists = null;

  // Iterate over the users in the `users` object.
  for (let user in users) {

    // If a user email is found in the `users` database, return it...
    if (users[user].email === email) {

      userExists = users[user].id;

    }
  }

  // ...or if nothing is found, return `null`.
  return userExists;
};