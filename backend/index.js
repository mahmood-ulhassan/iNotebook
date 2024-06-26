const connectToMongodb = require('./db')
connectToMongodb();
const express = require('express')
const app = express()
const port = 5000
const cors =require('cors')

app.use(express.json());
app.use(cors());
// Import the auth route
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
// const notesRoutes=require('./routes/notes')

// Use the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/note', noteRoutes);
// app.use('/api/notes', notesRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})