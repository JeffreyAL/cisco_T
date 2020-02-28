const express = require("express");
const app = express();
const uuid = require("uuid");
const members = require("./Members");
const exphbs = require("express-handlebars");

// print action taken
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  next();
};

// Init middleware
app.use(logger);

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create person
app.post("/api/members", (req, res) => {
  const newPerson = {
    uid: uuid.v4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    dod: req.body.dod
  };

  if (
    !newPerson.firstName ||
    !newPerson.lastName ||
    !newPerson.dob ||
    !newPerson.dod
  ) {
    return res.status(404).json({
      verb: req.method,
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      message: "error: missing fields"
    });
  }

  members.push(newPerson);
  res.json(newPerson);
});

// update person
app.put("/api/members/:id", (req, res) => {
  const found = members.filter(member => member.uid == req.params.id);

  if (found.lastIndexOf !== 0) {
    const updatePerson = req.body;

    members.forEach(member => {
      if (member.uid === req.params.id) {
        member.firstName = updatePerson.firstName
          ? updatePerson.firstName
          : member.firstName;
        member.lastName = updatePerson.lastName
          ? updatePerson.lastName
          : member.lastName;
        member.dob = updatePerson.dob ? updatePerson.dob : member.dob;
        member.dod = updatePerson.dod ? updatePerson.dod : member.dod;

        res.json({ member });
      } else {
        return res.status(404).json({
          verb: req.method,
          url: `${req.protocol}://${req.get("host")}${req.url}`,
          message: `error: no update on id: ${req.params.id}`
        });
      }
    });
  }
});

// Get person with id
app.get("/api/members/:id", (req, res) => {
  const found = members.filter(member => member.uid == req.params.id);

  if (found.length !== 0) {
    res.json(members.filter(member => member.uid == req.params.id));
  } else {
    res.status(404).json({
      verb: req.method,
      url: `${req.protocol}://${req.get("host")}${req.url}`,
      message: `error: given id not found ${req.params.id}`
    });
  }
});

// Delete person
app.delete("/api/members/:id", (req, res) => {
  const found = members.filter(member => member.uid == req.params.id);

  if (found.length !== 0) {
    members.filter(member => member.uid == req.params.id);
  } else {
    res.status(404).json({
      verb: req.method,
      url: `${req.protocol}://${req.get("host")}${req.url}`,
      message: `error: No person with id of ${req.params.id}`
    });
  }
});

// Get all url to person
app.get("/api/members", (req, res) => {
  const url = [];
  members.forEach(member => {
    const newUrl = {
      url: `${req.protocol}://${req.get("host")}${req.url}${member.uid}`
    };
    url.push(newUrl);
  });

  res.json(url);
});

app.get("/", (req, res) => {
  res.send("Hello CISCO !! My name is Jeffrey Alhassan");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
