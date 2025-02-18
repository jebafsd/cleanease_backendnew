const express = require("express");
const {addCheckList, getCheckList, editCheckList, deleteCheckList} = require("../Contorllers/UserCehckListContorller");
const auth = require("../MiddleWare/auth");

const router = express.Router();

router.post('/create', auth, addCheckList);

router.get('/get',auth, getCheckList);

router.put('/update/:_id', auth, editCheckList);

router.delete('/delete/:_id', auth, deleteCheckList);

module.exports = router;
