const UserCheckList = require('../Models/UserCheckList');

exports.addCheckList = async(req,res)=> {
    const { text } = req.body;
    const newCheckList = new UserCheckList({
        text,
        user:req.user
    })

    try{
        await newCheckList.save();
        res.status(200).send("New Checklist Added Successfully")
    } catch (err){
        res.status(400).send("Error while adding cehck list")
    }
}

exports.getCheckList = async(req,res) => {
    try{
        const CheckListdata = await UserCheckList.find({ user: req.user });
        res.status(200).json({ CheckListdata });
    } catch (err){
        res.status(400).send("Error while get user Checklist")
    }
}

exports.editCheckList = async(req,res) => {
    const { _id } = req.params;
    const { text, completed } = req.body;

    try{
        const ToUpdateCheckList = await UserCheckList.findOne({_id});
        if(!ToUpdateCheckList){
            return res.status(400).send("No CheckList in this id")
        }
        ToUpdateCheckList.text = text || ToUpdateCheckList.text;
        ToUpdateCheckList.completed = completed || ToUpdateCheckList.completed

        await ToUpdateCheckList.save();
        res.status(200).send("Updated CehckList Successfully")

    } catch (err){
        res.status(400).send("Error while editing the CheckList")
    }
}

exports.deleteCheckList = async(req,res)=> {
    const {_id} = req.params;
    try{
        await UserCheckList.deleteOne({ _id });
        res.status(200).send("Successfully Deleted user checklist");
    } catch(err){
        res.status(400).send("Error while editing the CheckList")
    }
}