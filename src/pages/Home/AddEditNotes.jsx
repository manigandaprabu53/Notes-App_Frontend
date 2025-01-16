import React, { useState } from 'react'
import TagInputs from '../../components/Input/TagInputs'
import { MdClose } from 'react-icons/md';
import api from "../../Service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";

function AddEditNotes({noteData, type, onClose, getAllNotes, showToastMsg}) {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    // Add note

    const addNewNote = async ()=>{
        try {
            
            const response = await api.post(ApiRoutes.AddNote.path, {title: title, content: content, tags: tags}, {authenticate: ApiRoutes.AddNote.authenticate});

            if(response.status === 200){
                showToastMsg("Note Added Successfully");
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }

    const editNote = async () => {
        try {
            const noteId = noteData._id;
            const response = await api.put(`${ApiRoutes.EditNote.path}/${noteId}`, {title: title, content: content, tags: tags}, {authenticate: ApiRoutes.EditNote.authenticate});

            if(response.status === 200){
                showToastMsg("Note Updated Successfully");
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }

    const handleAddNote = ()=>{
        if(!title){
            setError("Please add title");
            return;
        }

        if(!content){
            setError("Please add content");
            return;
        }

        setError("");

        if(type === "edit"){
            editNote();
        }else{
            addNewNote();
        }
    }

  return (
    <div className='relative'>
        <button className='w-10 h-10 rounded-full flex items-center justify-center absolute top-3 right-3 hover:bg-slate-50' onClick={()=>{onClose()}}><MdClose className='text-xl text-slate-400 '/></button>
        <div className='flex flex-col gap-2'>
            <label className="input-label">TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='Go to gym at 5' value={title} onChange={({target})=>{setTitle(target.value)}}/>
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label className="input-label">Content</label>
            <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Content' rows={10} value={content} onChange={({target})=>{setContent(target.value)}}></textarea>
        </div>
        <div className='mt-3'>
            <label className="input-label">Tags</label>
            <TagInputs tags={tags} setTags={setTags}/>
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p-3' onClick={()=>{handleAddNote()}}>{type === "edit" ? "Update" : "Add"}</button>
    </div>
  )
}

export default AddEditNotes