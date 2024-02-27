const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
