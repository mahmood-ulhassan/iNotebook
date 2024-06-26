import React, { useContext } from "react";
import Notecontext from "../Context/Notecontext";
import EditNotes from "./EditNotes";

function Noteitems({note, updateNote}) {
  const { deleteNote } = useContext(Notecontext);

  return (
    <div>
      <div className="container">
        <div className="card mb-2" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.description}</p>
            <i onClick={() => updateNote(note)} className="fa-regular fa-pen-to-square custom-icon mx-3" data-toggle="modal" data-target="#editModal"></i>
            <i onClick={() => deleteNote(note)} className="fa-solid fa-trash custom-icon"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noteitems;
