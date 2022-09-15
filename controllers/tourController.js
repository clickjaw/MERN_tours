const fs = require("fs");

////////////////////ALL TOUR FUNCTIONS/////////////////////////////////
//parsing through the JSON objects from below directory
//making an array at the same time

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/////you need the 4 value in a param call 
exports.checkID = (req, res, next, val)=>{
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).send("Id Not Found");
  }
  console.log(`Tour ID is : ${val}`)
  next()
}

exports.checkBody = (req, res, next)=>{
  if (!req.body.name || !req.body.price){
    return res.status(400).json({
      status: "fail",
      message: "missing name or price"
    })
  }
  next();
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      //you don't need key and value if it's the same name
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  //automatically converts to number from string
  const id = req.params.id * 1;
  //finds the id
  const tour = tours.find((obj) => obj.id === id);

  // if the id entered not there it 404s
  //   if (id > tours.length){
  //     return res.status(404).send('Id Not Found')
  //   }

  
  //below returns the same as res.send(tour) but it makes a JSON object out of the return?
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
  // res.send(tour)
};

exports.createTour = (req, res) => {
  //   console.log(req.body);
  //creating a newID for the new tour object
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  //pushing it to the array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.patchTour = (req, res) => {
  c

  res.status(200).json({
    status: "success",
    data: {
      tour: "updated tour here",
    },
  });
};

exports.deleteTour = (req, res) => {
  

  res.status(204).json({
    status: "success",
    requestedAt: req.requestTime,
    data: null,
  });
};
