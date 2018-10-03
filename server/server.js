const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const cors = require('cors')

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())

app.post("/todos", authenticate, (req, res) => {
  let todo = new Todo({
    title: req.body.title,
    duration: req.body.duration,
    start: req.body.start,
    _creator: req.user._id
  });

  todo.save().then(
    doc => {
      res.status(200).send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/json", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send(todos.map(item => _.pick(item, ["title", "duration", "start"])));
    },
    e => {
      res.status(404).send(e);
    }
  );
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.post("/users/registration", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  User.findByUserdata(body.email, body.password).then(user => {
    return user
      .generateAuthToken()
      .then(token => {
        res.header("x-auth", token).send(user);
      })
      .catch(e => {
        res.status(400).send();
      });
  });
});

app.delete("/users/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
