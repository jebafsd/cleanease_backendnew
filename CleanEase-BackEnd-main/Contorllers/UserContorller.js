const User = require("../Models/User");

exports.getProfile = async (req, res) => {
    try {
      const user = await User.findOne({_id:req.user}).select('-password');
      res.status(200).json({user});
    } catch (err) {
      res.status(400).send('Not able to get user data');
    }
  };

exports.updateProfile = async (req,res) => {
    const { firstname, lastname, email } = req.body;
    try{
        const user= await User.findOne({_id:req.user})
        user.firstname = firstname || user.firstname
        user.lastname = lastname || user.lastname
        user.email = email || user.email

        await user.save();
        res.status(200).send("user profile updated succesfully")

    } catch (err){
        res.status(400).send("Error while updating User data")
    }
}