const user = require('../models/user');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user ID' });
    }
  };


// Delete user by ID
exports.deleteUserById = async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ error: 'User not found' });
      res.json({message:'User deleted Succesfully'});
    } catch (error) {
      res.status(400).json({ error: 'Invalid user ID' });
    }
  };

  //user Sign up
  exports.signUp = async (req, res)=>{
    try{
      const {name, email, password, age} = req.body
  
      //check if already exhist
      const exhistingUser =  await User.findOne({email});
      if(exhistingUser) return res.status(400).json({error:'Email already registered'});
  
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      //create and save user
      const newUser =  new User({
        name, 
        email,
        password: hashPassword,
        age,
      });
  
      const savedUser = await newUser.save();
      
      //Remove password from response 
      const userToReturn = savedUser.toObject();
      delete userToReturn.password;
  
      res.status(200).json(userToReturn);
    } catch (error){
      res.status(500).json({error:error.message});
    }
  }

  //User Sign In
  exports.signIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid email or password' });

      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

      // 3. Remove password before returning
      const userToReturn = user.toObject();
      delete userToReturn.password;

      res.status(200).json({...userToReturn, msg:'You are loggen in succesfully'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


