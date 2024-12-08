// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect('mongodb+srv://AbdulRahman:7fFtLES7HUQc5qlM@study.nuk3n.mongodb.net/?retryWrites=true&w=majority&appName=study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});


const Task = mongoose.model('Task', taskSchema);


// Route to get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ timestamp: -1 }); // Fetch tasks sorted by latest
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Route to create a new task
app.post('/api/tasks', async (req, res) => {
  const { text, isChecked } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Task text is required' }); // Return error for missing text
  }

  try {
    const newTask = new Task({ text, isChecked });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error saving task:', error); // Log the actual error
    res.status(500).json({ message: 'Internal server error', error });
  }
});


// Route to update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, isChecked } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { text, isChecked },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Route to delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// Create a schema for storing points
const pointsSchema = new mongoose.Schema({
  points: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Points = mongoose.model('Points', pointsSchema);

// Route to save points
app.post('/api/savePoints', async (req, res) => {
  const { points } = req.body;
  try {
    const newPointEntry = new Points({ points });
    await newPointEntry.save();
    res.status(200).json({ message: 'Points saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving points', error });
  }
});

// Route to get the latest points
app.get('/api/getPoints', async (req, res) => {
  try {
    const points = await Points.find().sort({ timestamp: -1 }).limit(1); // Get the most recent points
    res.status(200).json({ points: points[0] ? points[0].points : 0 }); // Return the points, or 0 if no points found
  } catch (error) {
    res.status(500).json({ message: 'Error fetching points', error });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://https://study-backend-k311.onrender.com:${PORT}`);
});
