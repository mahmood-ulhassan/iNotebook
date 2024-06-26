const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser.js");
const { body, validationResult } = require("express-validator");

const Notes = require("../models/Notes.js");


// Define routes
// ROUTE : 1 FETCH ALL NOTES
router.get("/fetchallnotes", fetchuser, async (req, res) => {

  const notes = await Notes.find({ user: req.user.userid });
  res.send(notes);
});


// ROUTE : 2 ADD NEW NOTES
router.post(
  "/addnotes",
  fetchuser,
  [
    // Validate title
    body("title", "Title can not be empty").notEmpty(),
    // Validate password
    body("description", "Description cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorarray = errors.array();
      return res.status(400).json({ errors: errorarray[0].msg });
    }
    try {
      // If no validation errors, process the request
      const { title, description, tag } = req.body;
    

      const notes = new Notes({
        user: req.user.userid,
        title,
        description,
        tag, // Save the hashed password in the database
      });

      await notes.save(); // Wait for the save operation to complete
      res.send(notes); // Send response after save operation completes
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE : 3 UPDATE ALL NOTES
router.put(
  "/updatenotes/:id",
  fetchuser,
  [
    // Validate title
    body("title", "Title can not be empty").notEmpty(),
    // Validate password
    body("description", "Description cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorarray = errors.array();
      return res.status(400).json({ errors: errorarray[0].msg });
    }
    try {
          // Destructure note details from request body
          const { title, description, tag } = req.body;
          const { id } = req.params; // Extract note ID from URL parameters
    
          // Find the note by ID and update its details
          let note = await Notes.findById(id);
          if (!note) {
            return res.status(404).json({ errors: "Note not found" });
          }
    
          // Check if the user has permission to edit this note
          if (note.user.toString() !== req.user.userid) {
            return res.status(401).json({ errors: "Not authorized to edit this note" });
          }
    
          // Update note details
          note.title = title;
          note.description = description;
          note.tag = tag;
    
          // Save the updated note
          note = await note.save();
    
          // Send the updated note as response
          res.json(note);
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 4: Delete a note
router.delete(
  "/deletenote/:id",
  fetchuser,
  async (req, res) => {
    try {
      const { id } = req.params; // Extract note ID from URL parameters
      const userId = req.user.userid; // Extract user ID from authentication token

      // Find the note by ID and user ID
      const note = await Notes.findOne({ _id: id, user: userId });
      if (!note) {
        return res.status(404).json({ errors: "Note not found" });
      }

      // Delete the note
      await note.deleteOne();

      // Send a success response
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);


// Export the router
module.exports = router;
