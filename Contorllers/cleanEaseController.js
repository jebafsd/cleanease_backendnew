const CleanServices = require("../Models/CleanServices");
const CleanSubCategories = require("../Models/CleanSubCategories");

exports.getCleanServices = async (req, res) => {
  try {
    const data = await CleanServices.find();
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error getting main clean data");
  }
};

exports.getCleanSubCategories = async (req, res) => {
  const { cleanServiceID } = req.params;

  try {
    const data = await CleanSubCategories.find({cleanServiceID})
    const main = await CleanServices.findOne({_id:cleanServiceID})
    if(main){
      const heading = main.serviceName;
      res.status(200).json({ data, heading });
    } else{
      res.status(200).json({ data });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error getting sub clean data");
  }
};
