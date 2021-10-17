const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // required: 필수여부.
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  married: {
    type: Boolean,
    required: true,
  },
  comment: String,    // 이 경우 required는 false. (필수값 x)
  createdAt: {
    type: Date,
    default: Date.now,  // 현재시간
  },
});

module.exports = mongoose.model('User', userSchema);