
import React, { useContext, useState, useEffect } from "react";
import Notecontext from "../Context/Notecontext";

function Addnotes({ showAlert }) {
    const { state, updateState, resetkeychange } = useContext(Notecontext);
    const { resetStates } = useContext(Notecontext);
    const [newNote, setNewNote] = useState({
        title: "",
        description: "",
        tag: ""
      });
    
      const handleInputChange = (e) => {
        setNewNote({
          ...newNote,
          [e.target.name]: e.target.value
        });
      };
    
      const handleAddNote = (e) => {
        e.preventDefault();
        if (!newNote.title || !newNote.description || !newNote.tag) {
          // Ensure all fields are filled before adding the note
          showAlert("Please fill all the fields","warning")
          return;
        }
    
        // Create a new note object
        const note = {
          title: newNote.title,
          description: newNote.description,
          tag: newNote.tag,
          // Add other properties like id, date, etc., if needed
        };
    
        // Add the new note to the state array
        const updatedState = [...state, note];
        updateState(updatedState);
        AddNotesToDatabase(note);
        resetkeychange();
    
        // Reset the input fields
        setNewNote({
          title: "",
          description: "",
          tag: ""
        });
      };
    
      const AddNotesToDatabase = (note) => {
        
        fetch("http://localhost:5000/api/note/addnotes", {
          method: 'POST',
          headers: {
            "authtoken": sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note)
        })
          .then((response) => response.json())
          .then((data) => {
            showAlert("Note added successfully","success")
          })
          .catch((error) => {
            showAlert("Error adding new note","danger")
          });
      };
  return (
    <div>
      <div className="container my-3">
        <form onSubmit={handleAddNote}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Title</label>
            <input
              type="text"
              className="form-control"
              value={newNote.title}
              name="title"
              onChange={handleInputChange}
              placeholder="Please enter title for note"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={newNote.description}
              onChange={handleInputChange}
              placeholder="Please enter description of note"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Tag</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              name="tag"
              value={newNote.tag}
              onChange={handleInputChange}
              aria-describedby="emailHelp"
              placeholder="Please enter tag for your Note"
            />
          </div>

          <button type="submit" className="btn addnotebutton btn-primary">
            Make New Notes
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addnotes
