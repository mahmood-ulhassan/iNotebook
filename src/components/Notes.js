import React, { useContext, useState, useEffect, useRef } from "react";
import Noteitems from "./Noteitems";
import Notecontext from "../Context/Notecontext";
import Addnotes from "./Addnotes";

function Notes({ showAlert }) {
  const { state, updateState, resetkeychange } = useContext(Notecontext);
  const nodeid=null;
  const modalRef = useRef(null); // Creating a ref for the modal
  const [editNote, setEditNote] = useState({
    id:"",
    title: "",
    description: "",
    tag: "",
  });


  const handleInputChange = (e) => {
    setEditNote({
      ...editNote,
      [e.target.name]: e.target.value,
    });
  };
  // Open Modal
  const openModal = () => {
    if (modalRef.current) {
      const modalElement = modalRef.current;
      modalElement.classList.add("show");
      modalElement.style.display = "block";
    }
  };

  // Close Modal
  const closeModal = () => {
    if (modalRef.current) {
      const modalElement = modalRef.current;
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!editNote.title || !editNote.description || !editNote.tag) {
      // Ensure all fields are filled before adding the note
      showAlert("Please fill in all the fields","warning")
      return;
    }

    // Create a new note object
    const editednote = {
      title: editNote.title,
      description: editNote.description,
      tag: editNote.tag,
      // Add other properties like id, date, etc., if needed
    };

    // Add the new note to the state array
    // const updatedState = [...state, note];
    // updateState(updatedState);
    //AddNotesToDatabase(note);
   
    closeModal();
    const note = {
      title: editNote.title,
      description: editNote.description,
      tag: editNote.tag,
      // Add other properties like id, date, etc., if needed
    };
    // const updatedState = state.filter((item) => item._id !== editNote._id);
    //     updateState(updatedState);
    console.log(editNote._id);
    const updatedState = state.map((existingNote) => {
    //  console.log(existingNote._id)
      if (existingNote._id === editNote._id) {
        // If the ID matches, update the note
        const index = state.findIndex((note) => note.id === editNote.id);
        if (index !== -1) {
          // Create a new state array with the updated note
          const updatedState = [...state];
          updatedState[index] = note;
      
          // Set the updated state
          updateState(updatedState);
          resetkeychange();
        }
        fetch(`http://localhost:5000/api/note/updatenotes/${editNote._id}`, {
          method: "PUT",
          headers: {
            "authtoken": sessionStorage.getItem("authToken"),
            "Content-Type": "application/json",
          }, 
          body: JSON.stringify(note)
        })
      .then((response) => response.json())
      .then((data) => {
        showAlert("Note updated from Database","success")

      })
      .catch((error) => {
        showAlert("Error updating notes from database","danger")

      });
  
      }
     // console.log(state)
      //return existingNote; // Return the note unchanged if the ID doesn't match
    });
  
    // Update the state with the updated note
   // updateState(updatedState);

  };

  const updateNote = (note) => {
   
    setEditNote({
      _id:note._id,
      title: note.title,
      description: note.description,
      tag: note.tag
    });
    
    openModal(); // Open the modal when the edit icon is clicked
  };
  return (
    <div>
      <Addnotes showAlert={showAlert} />
      <div className="container">
        <>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            ref={modalRef}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Modal title
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => closeModal()}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddNote}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editNote.title}
                        name="title"
                        id="title"
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
                        id="description"
                        value={editNote.description}
                        onChange={handleInputChange}
                        placeholder="Please enter description of note"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Tag</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tag"
                        name="tag"
                        value={editNote.tag}
                        onChange={handleInputChange}
                        aria-describedby="emailHelp"
                        placeholder="Please enter tag for your Note"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => closeModal()}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      <div className="container my-3 ">
        <h1>Your Notes</h1>
        <div className="row my-3">
          {state.map((note) => (
            <Noteitems key={note._id} note={note} updateNote={updateNote} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notes;
