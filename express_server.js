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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



// BOOT SERVER
// The server program launches, listens for incoming requests at the given port
// (8080), and logs a greeting to the console.
app.listen(PORT, () => {
  console.log(`Tiny App is listening on port ${PORT}!`);
});



// REQUEST/RESPONSE PIPELINE

// TEST ROUTES

// A default route to serve as "Hello World" to those who visit `/`.
app.get("/", (req, res) => {
  res.send("Hello!");
});


// A test route that returns HTML in the response body to requests for `/hello`.
app.get("/hello", (req, res) => {

  // `Hello World` wrapped in HTML tags.
  res.send("<html><body>Hello <b>World</b></body></html>\n");

});



// MAIN ROUTE HANDLERS

// A GET request to `/urls.json` will trigger with path. It returns the contents
// of the URL database to the client as a JSON object. Not user-friendly at all.
app.get("/urls.json", (req, res) => {

  // This endpoint will return the data from `urlDatabase` as a JSON file.
  // Note that the response method being used `.json()`.
  res.json(urlDatabase);

});


// Route handler for GET `/urls`. This endpoint returns a web page which
// displays a formatted, user-friendly list of all the URLs in the database.
// Both short & long URLs are displayed.
app.get("/urls", (req, res) => {

  // If you are sending data to a view, even a single variable, the convention
  // is to wrap it in an object called `templateVars`.
  const templateVariables = { urls: urlDatabase };

  // Returns the `urls_index.ejs` template. Embeds values from`urlDatabase`
  // in it.
  res.render("urls_index.ejs", templateVariables);

});


// Route handler for GET `/urls/new`. This route returns a web page where you
// can add new URLs to the database. When the user hits submit, the POST `/urls`
// endpoint will be triggered.

/* ON THE ORDER OF ENDPOINTS
 *
 * The order of route definitions matters! The GET `/urls/new` route needs to
 * be defined before the GET `/urls/:id` route. Routes defined earlier will
 * take precedence, so if we place this route after the `/urls/:id` definition,
 * any calls to `/urls/new` will be handled by app.get("/urls/:id", ...)
 * because Express will think that `new` is a route parameter. A good rule of
 * thumb to follow is that routes should be ordered from most specific to least
 * specific.
 */
app.get("/urls/new", (req, res) => {

  // Note that if you DON'T have any information to pass into the view, you
  // can just specify the view name, as shown here.
  res.render("urls_new");

});


// Route Handler that handles POST `/urls`. When the user enters a new URL into
// `urls_new.ejs` and presses `Submit`, this endpoint is triggered. It stores
// the URL in the database and re-directs it to GET `/urls/:id`, where the user
// can see both long and short versions of the URL they just entered.
app.post("/urls", (req, res) => {

  console.log(req.body); // Log the POST request body to the console.

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


// Route handler for GET `/urls:id`. Re-directs from POST `/urls`; Shows the
// user their newly created short URL.

/* ROUTE PARAMETERS
 *
 * If you start the server and go to `http://localhost:8080/urls/[Short-Id]`,
 * then `Short-Id` is the value of `:id` Route Parameter. It gets passed in
 * via the URL and is added to the request body. When the request arrives at
 * the backend, Express.js loads this value into the `req.params.id` property.
 * From there, you can load it into the view, where it can be used.
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


// A GET request to `/u/:id` will trigger this path. After the user has created
// a new link and added it to the database, they will be re-directed to
// `/urls/:id`, showing them them both the long and short URL. If the user
// were to click on the short URL, it should trigger this endpoint. It will
// re-direct them to the actual website (the long URL).
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