const express = require("express");
const tourController = require('./../controllers/tourController')

const router = express.Router();

// define param middleware below
// router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)

router
.route("/")
.get(tourController.getAllTours)
///you can chain together middleware functions so that it checks one then goes to another
.post(tourController.createTour);

router
.route("/:id")
.get(tourController.getTour)
.patch(tourController.patchTour)
.delete(tourController.deleteTour);

module.exports = router;
