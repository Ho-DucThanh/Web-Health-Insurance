const express = require("express");
const path = require("path");
const hbs = require("hbs");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { LogInModel, UserModel } = require("./src/mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const templatePath = path.join(__dirname, "/templates");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await LogInModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    console.log(`Passwords match: ${passwordsMatch}`);
    console.log(user);

    if (passwordsMatch) {
      res.status(200).render("home", {
        naming: email,
      });
    } else {
      res.send("Invalid login details");
    }
  } catch (err) {
    console.error(err);
    res.send("Error login details");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password.trim() !== confirmPassword.trim()) {
    return res.send("Passwords do not match");
  }

  try {
    const checking = await LogInModel.findOne({ email });
    if (checking) {
      res.send("User already exists");
    } else {
      const data = { email, password: password.trim() };
      await LogInModel.create(data);
      res.status(201).redirect("/"); // Redirect to login page
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await UserModel.create(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
