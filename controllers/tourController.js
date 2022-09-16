const Tour = require('./../models/tourModel')

////////////////////ALL TOUR FUNCTIONS/////////////////////////////////
//parsing through the JSON objects from below directory
//making an array at the same time
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/////you need the 4 value in a param call 
////////////////////////////////////////////////GET ALL TOURS///////////////////////////
exports.getAllTours = async(req, res) => {
  // console.log(req.requestTime);
try {
  console.log(req.query)

  //this creates the query obj AND excludes other information not pertaining to the query
  // BUILDS THE QUERY
  //1)FILTERING
  const queryObj = {...req.query}
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach(obj => delete queryObj[obj])

  // console.log(req.query, queryObj)

  //2) ADVANCED FILTERING

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  //console.log(JSON.parse(queryStr))
  //{difficulty: 'easy', duration: {$gte:5}}
  //gte, gt , lte, lt

  let query = Tour.find(JSON.parse(queryStr))

  //3) SORTING
  if (req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    // console.log(sortBy)
    query = query.sort(sortBy)
  }else{
    //creates a default sorted by with ascending createdAt
    query = query.sort('-createdAt')
  }
  
  //4) FIELD LIMITING
  if (req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields)
  } else{
    //selects everything but __v
    query = query.select('-__v')
  }

  //5) PAGINATION
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   //skips the number of objects before the page selected
   const skip = (page - 1) * limit;

  if (req.query.page){
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error ("This Page Does Not Exist")
  }

   query = query.skip(skip).limit(limit);

  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
  //EXECUTES THE QUERY
  const tours = await query;

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
