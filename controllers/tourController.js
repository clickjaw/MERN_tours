const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next()

}

////////////////////ALL TOUR FUNCTIONS/////////////////////////////////
//parsing through the JSON objects from below directory
//making an array at the same time
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


exports.getAllTours = async(req, res) => {
  // console.log(req.requestTime);
try {
  console.log(req.query)
  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

  //EXECUTES THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

  const tours = await features.query;

  //SEND RESPONSE

  res.status(200).json({
    status: "success",
    // requestedAt: req.requestTime,
    results: tours.length,
    data: {
      //you don't need key and value if it's the same name
      tours,
    },
  });
} catch (error) {
  res.status(400).json({
    status: "failure", 
    message: error
  })
  
}
  
};
/////////////////////////////////////////////GET TOUR//////////////////////////////////
exports.getTour = async(req, res) => {

  // console.log(req.params);
  //automatically converts to number from string
  // const id = req.params.id * 1;
  //finds the id
  // const tour = tours.find((obj) => obj.id === id);
  // if the id entered not there it 404s
  //   if (id > tours.length){
  //     return res.status(404).send('Id Not Found')
  //   }

  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        //you don't need key and value if it's the same name
        tour
      }
    });

  } catch (error) {
    res.status(400).json({
      status: "failure", 
      message: error
    })
  }
  
  //below returns the same as res.send(tour) but it makes a JSON object out of the return?
  res.status(200).json({
    status: "success"
    // data: {
    //   tour,
    // },
  });
  // res.send(tour)
};
///////////////////////////////////////////////////NEW TOUR/////////////////////////
exports.createTour = async(req, res) => {

  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime
      // data: {
      //   tour: newTour,
      // },
    });

  } catch (error) {
    res.status(400).json({
      status:"failure",
      message: error
    })
  }
  
  
};
/////////////////////////////////////////////UPDATE TOUR//////////////////////////////
exports.patchTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new : true,
      runValidators: true
    })
    
    res.status(200).json({
      status: "success",
      data: {
        tour
      },
    });
  } catch (error) {
    res.status(400).json({
      status:"failure",
      message: "Invalid Data Sent"
    })
    
  }

  
};
/////////////////////////////////////////////DELETE TOURS///////////////////////////////////
exports.deleteTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      status:"failure",
      message: "Invalid Data Sent"
    })
  }

  
};
