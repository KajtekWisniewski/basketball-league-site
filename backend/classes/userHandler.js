const User = require('../models/userSchema');
const { generateToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

class UserHandler {
  async authUser(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // res.json({
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   isAdmin: user.isAdmin,
      //   team: user.team,
      //   pictureLink: user.pictureLink
      //   //token: generateToken(user._id)
      // });
      return user;
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  }

  async registerUser(req, res) {
    const { name, email, password, team, pictureLink } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(404);
      throw new Error('user already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      team,
      pictureLink
    });

    return user;

    // if (user) {
    //   res.status(201).json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    //     team: user.team,
    //     pictureLink: user.pictureLink,
    //     token: generateToken(user._id)
    //   });
    // }
  }

  async updateUser(req, res) {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.pictureLink = req.body.pictureLink || user.pictureLink;
      user.team = req.body.team || user.team;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return updatedUser;
    } else {
      res.status(404);
      throw new Error('User Not Found');
    }
  }

  async protectMiddleware(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];

        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
}

module.exports = UserHandler;
