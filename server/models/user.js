const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      uniquie: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    birthday: {
      type: String,
      default: "",
    },
    sex: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//before saving the user

//something was fishing here

// userSchema.pre("save", function (next) {
//   const user = this;
//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash(user.password, salt, function (err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   });
// });

userSchema.pre("save", async function save(next) {
  // if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.methods.comparePassword = async function (
  enteredPassword,
  callback
) {
  bcrypt.compare(enteredPassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
