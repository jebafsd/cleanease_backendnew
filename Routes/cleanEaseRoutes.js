const express = require("express");
const { getCleanServices, getCleanSubCategories } = require('../Contorllers/cleanEaseController');

const router = express.Router();

router.get('/', getCleanServices);

router.get('/:cleanServiceID', getCleanSubCategories);

module.exports = router;