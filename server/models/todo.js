const mongoose = require("mongoose");

const Todo = mongoose.model("Todo", {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  start: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  _creator: {
    require: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = { Todo };
