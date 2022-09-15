const express = require("express");
const app = express();
const morgan = require('morgan')
const PORT = 3000;
const fs = require("fs");
///////////////////middleware below to allow post////////
app.use(morgan('dev'))
app.use(express.json());

app.use ((req, res, next)=>{
    req.requestTime = new Date().toLocaleString();
    next()
})
const AUTHOR = "Tyler Morgan";

///////////////////////MAIN PAGE////////////////////////////
app.get("/", (req, res) => {
  const today = new Date();
  const date = today.toLocaleString();
  res.status(200).send(`MERN Solo Project Home: ${AUTHOR} - ${date}`);
});
app.post("/", (req, res) => {
  res.send("You can post to this endpoint....");
});

app.get("/about", (req, res) => {
  res.status(200).send("Tyler Morgan");
});

////////////////////ALL TOUR FUNCTIONS/////////////////////////////////
//parsing through the JSON objects from below directory
//making an array at the same time
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    console.log(req.requestTime)
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

const getTour = (req, res) => {
  console.log(req.params);
  //automatically converts to number from string
  const id = req.params.id * 1;
  //finds the id
  const tour = tours.find((obj) => obj.id === id);

  // if the id entered not there it 404s
  //   if (id > tours.length){
  //     return res.status(404).send('Id Not Found')
  //   }

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Id Not Found",
    });
  }
  //below returns the same as res.send(tour) but it makes a JSON object out of the return?
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
  // res.send(tour)
};

const createTour = (req, res) => {
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

const patchTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).send("Id Not Found");
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "updated tour here",
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).send("Id Not Found");
  }

  res.status(204).json({
    status: "success",
    requestedAt: req.requestTime,
    data: null,
  });
};
/////////////////////////ROUTES//////////////////////
// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);

// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", patchTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app
.route("/api/v1/tours")
.get(getAllTours)
.post(createTour);

app
.route("/api/v1/tours/:id")
.get(getTour)
.patch(patchTour)
.delete(deleteTour)

app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));
