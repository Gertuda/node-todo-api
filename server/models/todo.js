const mongoose = require("mongoose");

const Todo = mongoose.model("Todo", {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  start: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  _creator: {
    require: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = { Todo };
