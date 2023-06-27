// IMPORTS
const express = require("express");



// ASSIGNMENTS
const app = express();

// default port 8080
const PORT = 8080;

// Add EJS to the project as the template engine.
app.set("view engine", "ejs");



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

  // Return the `urls_index.ejs` template. Embed `urlDatabase` in it.
  res.render("urls_index.ejs", templateVariables);

});


// A request to `/urls.json` will trigger with path.
app.get("/urls.json", (req, res) => {

  // This endpoint will return the data from `urlDatabase` as a JSON file.
  // Note that the response method is `.json()`.
  res.json(urlDatabase);

});


// The server program launches, listens for incoming requests at the given port
// (8080), and logs a greeting to the console.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});