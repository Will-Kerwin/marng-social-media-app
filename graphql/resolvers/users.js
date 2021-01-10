const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

// generates and returns token adding all required data 
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

// Defines all mutations and queries with user data
module.exports = {
  Mutation: {
    async login(_, { username, password }) {

      // validates input then tries to find user
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      // throws error if invalid data
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // throws error if no user
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      // if a user is found we authenticate password
      const match = await bcrypt.compare(password, user.password);

      // throws error if unauthenticated password
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      // if all authentication checks are completed then generates user token
      const token = generateToken(user);

      // returns user detiails, the user's id and token to wherever the mutation came from 
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // Make sure user doesn't already exits
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // Hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
