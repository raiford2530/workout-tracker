const express = require('express');
const db = require('./models');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/", (req, res) => {
    res.sendFile('index.html');
})



app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: '$exercises.duration'}
        }
    }]).then(workouts => {

        console.log(workouts);
        res.json(workouts);
    });
})

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})
