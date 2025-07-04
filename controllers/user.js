const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    const savedUser = await newUser.save();
    res.status(200).json({code:200,data:savedUser,msg:'User created successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({code:200,data:user,msg:'User fetched successfully'});
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
  
      res.status(200).json({code:200,data:userToReturn,msg:'User created successfully'});
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

      res.status(200).json({code:200,data:userToReturn,msg:'You are loggen in succesfully'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Search user by name
exports.searchUserByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name query parameter is required' });

    const users = await User.find({
      name: { $regex: name, $options: 'i' }  // 'i' = case-insensitive
    });
    if (users.length === 0) return res.status(404).json({ error: 'No users found' });

    res.json({code:200,data:users,msg:'Users fetched successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Pagination for user list  
exports.getUsersList =  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) === -1 ? -1 : 1;
    const search = req.query.search?.toString().trim() || '';
    const skip = (page - 1) * limit;
    const filter = search
      ? { name: { $regex: search, $options: 'i' } } // case-insensitive search
      : {};

    const users = await User.find(filter)
      .sort({ name: sort })
      .skip(skip)
      .limit(Number(limit))

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      code: 200,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        pageSize: limit,
      },
      msg: 'Users fetched successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

