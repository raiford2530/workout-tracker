const express = require('express');
const db = require('./models');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.WORKOUTDB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongoose successfully connected.");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/exercise", (req, res) => {
    res.sendFile(__dirname + "/public/exercise.html");
})

app.get("/stats", (req, res) => {
    res.sendFile(__dirname + "/public/stats.html");
})


app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: '$exercises.duration'}
        }
    }]).then(workouts => {
        res.json(workouts);
    })
    .catch(err => {
        res.json(err);
    });
})

app.post("/api/workouts", ({body}, res) => {
    var workout = new db.Workout(body);
    db.Workout.create(workout)
    .then(newWorkout => {
        res.json(newWorkout);
    })
    .catch(err => {
        res.json(err);
    });


})

app.put("/api/workouts/:id", (req, res) => {
    var newExercise = [req.body];
    db.Workout.updateOne({_id: req.params.id}, {$push: {exercises: newExercise}}, {new: true})
    .then(workout => {
        res.json(workout);
    })
    .catch(err => {
        res.json(err);
    })
})

app.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: '$exercises.duration'}
        }
    }]).then(workouts => {
        res.json(workouts);
    })
    .catch(err => {
        res.json(err);
    })
})

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})
