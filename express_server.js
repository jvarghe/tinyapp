/* M03 W06 CHALLENGE: TINY APP
 *
 * A NOTE TO INVIGILATORS!!!
 *
 * This application is not only intended for submission to LHL, but also as a
 * reference for future education. As a result, it has been heavily commented
 * and disused code paths have been deliberately left behind. Please bear this
 * in mind when scoring this project.
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
 * ROUTES
 *
 *     * GET  /
 *     * GET  /urls
 *     * GET  /urls/new
 *     * POST /urls
 *     * GET  /urls/:id
 *     * GET  /u/:id
 *     * POST /urls/:id/delete
 *     * POST /login
 */

// IMPORTS
const express = require("express");



// ASSIGNMENTS

// Create an Express application.
const app = express();

// Define a default port for the project.
const PORT = 8080;

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


// Added an object with a list of URLs to the project. It simulates a data
// source like a database.
const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com",
  "5JzOvt": "https://www.yahoo.ca",
  "9wuFBu": "https://duckduckgo.com/",
  "nSwQM7": "https://www.startpage.com"
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
 * and existing ones can be updated on that page, or on `.../urls`.
 *
 * Re-directs from POST `/urls`; Shows the user their newly created short URL.
 */
app.get("/urls/:id", (req, res) => {

  // Extract the `:id` value from the request object. You can find it in the
  // `request.params.id` property.
  const templateVariables = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
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

  // Note that if you DON'T have any information to pass into the view, you
  // can just specify the view name, as shown here.
  res.render("urls_new");

});

// GET `/urls`. Corresponds to `.../urls` [urls_index.ejs]
//
// This endpoint returns a web page which displays a formatted, user-friendly
// list of all the URLs in the database. Both short & long URLs are displayed.
app.get("/urls", (req, res) => {

  // If you are sending data to a view, even a single variable, the convention
  // is to wrap it in an object called `templateVars`.
  const templateVariables = { urls: urlDatabase };

  // Returns the `urls_index.ejs` template. Embeds values from`urlDatabase`
  // in it.
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


// POST `/urls/:id`. It can be called from either `.../urls/new` (urls_show.ejs),
// or `.../urls` (urls_index.ejs). In either case, this endpoint gets triggered
// when the user tries to update an existing record by passing in a long URL.
app.post("/urls/:id", (req, res) => {

  // Store the returned short URL in `id`.
  const shortURL = req.params.id;

  // The new replacement URL should be coming in via the `Update` form's `name`
  // attribute.
  const fullNewURL = req.body.longURL;

  // console.log(fullNewURL);

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


// POST `/login`. This endpoint is triggered whenever the user enters a user
// name in the navigation bar and hits "Submit". It extracts the username from
// the field, creates a cookie, and stores this value within the cookie. It
// returns a response with the cookie, which now lives in the client. Whenever
// the client makes a request, the cookie is included with it, allowing the
// server to recognize client. The client will continue send the cookie with
// every request until the browser's cache is cleared.
app.post("/login", (req, res) => {

  // Extract the username from the request's body.
  const username = req.body.username;

  // Logs out only the user name entered by user. Aren't cookies supposed to
  // be in key-value pairs ("username"="vanillaice")?
  // console.log(username);

  // Create a cookie, name it "usernameCookie", and store the `username` value
  // entered by the user in the cookie.
  res.cookie("usernameCookie", username);

  // Redirect the client to the `/urls` page after successful login.
  res.redirect("/urls");

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