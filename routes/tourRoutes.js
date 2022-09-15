const express = require("express");
const tourController = require('./../controllers/tourController')

const router = express.Router();

router.param('id', tourController.checkID)



router
.route("/")
.get(tourController.getAllTours)
///you can chain together middleware functions so that it checks one then goes to another
.post(tourController.checkBody, tourController.createTour);

router
.route("/:id")
.get(tourController.getTour)
.patch(tourController.patchTour)
.delete(tourController.deleteTour);

module.exports = router;
