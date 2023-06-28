// IMPORTS
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");



// ASSIGNMENTS
const app = express();

// default port 8080
const PORT = 8080;

// Add EJS to the project as the template engine.
app.set("view engine", "ejs");

/* Add parser to read and parse URL-encoded data. Used mainly for HTTP requests
 * that make permanent changes like POST, PUT and DELETE (???).
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



// REQUEST/RESPONSE PIPELINE

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

// Route handler for GET `/urls`.
app.get("/urls", (req, res) => {

  // If you are sending data to a view, even a single variable, the convention
  // is to wrap it in an object called `templateVars`.
  const templateVariables = { urls: urlDatabase };

  // Return the `urls_index.ejs` template. Embed values from`urlDatabase` in it.
  res.render("urls_index.ejs", templateVariables);

});


// Route handler for GET `/urls/new`. This route returns a page where you can
// add new URLs to the database.

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
  // can just specify the view name, as shown here:
  res.render("urls_new");

});


// Route handler for GET `/urls:id`.

/* ROUTE PARAMETERS
 *
 * If you start the server and go to `http://localhost:8080/urls/LHLabs`,
 * then `LHLabs` is the value of `:id` Route Parameter. It gets passed in
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

  // If you start the server, go its webpage and go to `.../urls/value1` and
  // pass in `b2xVn2`, the line below will print out the `templateVariable`
  // object's elements, like this:
  //
  //     { id: 'b2xVn2', longURL: 'http://www.lighthouselabs.ca' }
  //
  // console.log(templateVariables);

  // Invoke the template engine, ask for the view called `urls_show.ejs` and
  // pass in the `templateVariables` object. Embed values from it in the view.
  res.render("urls_show.ejs", templateVariables);

});


// A request to `/urls.json` will trigger with path.
app.get("/urls.json", (req, res) => {

  // This endpoint will return the data from `urlDatabase` as a JSON file.
  // Note that the response method is `.json()`.
  res.json(urlDatabase);

});


// POST REQUESTS
// Route Handler that handles `/urls`. Captures new URLs from `urls_new.ejs`.
app.post("/urls", (req, res) => {

  console.log(req.body); // Log the POST request body to the console.
  res.send("Ok"); // Respond with 'Ok' (we will replace this).

});


// The server program launches, listens for incoming requests at the given port
// (8080), and logs a greeting to the console.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});