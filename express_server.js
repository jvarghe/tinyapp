// IMPORTS
const express = require("express");



// ASSIGNMENTS
const app = express();

// default port 8080
const PORT = 8080;

// Added a list of URLs to the project.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



// REQUEST/RESPONSE PIPELINE
// A default route to test "Hello World!"
app.get("/", (req, res) => {
  res.send("Hello!");
});


// A request to `/urls.json` will trigger with path.
app.get("/urls.json", (req, res) => {

  // This endpoint will return the data from `urlDatabase` as a JSON file.
  res.json(urlDatabase);
});


// The server program launches, listens for incoming requests at the given port
// (8080), and logs a greeting to the console.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});