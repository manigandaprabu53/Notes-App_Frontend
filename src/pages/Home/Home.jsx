import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom'
import api from '../../Service/ApiService'
import ApiRoutes from '../../utils/ApiRoutes'
import moment from "moment";
import Toast from '../../components/ToastMessages/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import imgsrc from "../../assets/no-note.svg"
import add_note from "../../assets/add-note.svg"

function Home() {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    message: "",
    type: null
  })

  const [isSearch, setIsSearch] = useState(false);

  const showToastMsg = (message, type) => {
    setShowToastMessage({
      isShown: true,
      message,
      type, 
    })
  }

  const handleCloseToast = ()=>{
    setShowToastMessage({
      isShown: false,
      message: ""
    })
  }

  const handleEdit = async (noteDetails) => {
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"});
  }

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();

  // To fetch user info initially
  const getUserInfo = async () => {
    try {
      const response = await api.get(ApiRoutes.GetUser.path, {authenticate: ApiRoutes.GetUser.authenticate});
      if(response.status === 200){
        setUserInfo(response.data.data);
        console.log("Fetched Data: "+JSON.stringify(response.data.data))
      }
    } catch (error) {
      if(error.response.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  
  // To fetch all notes

  const getAllNotes = async () => {
    try {
      const response = await api.get(ApiRoutes.GetAllNotes.path, {authenticate: ApiRoutes.GetAllNotes.authenticate});

      if(response.status === 200){
        console.log(response.data.notes);
        
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An Unexpected Error Occured. Please Try Again")
    }
  }

  // Delete Note

  const deleteNote = async (data)=>{
    try {
      const noteId = data._id;
      const response = await api.delete(`${ApiRoutes.DeleteNote.path}/${noteId}`, {authenticate: ApiRoutes.DeleteNote.authenticate});

      if(response.status === 200){
          showToastMsg("Note Deleted Successfully", "delete");
          getAllNotes();
      }
  } catch (error) {
      if(error.response && error.response.data && !error.response.data.message){
        console.log("An Unexpected Error Occured. Please Try Again");
      }
    }
  }

  // Search For Note

  const onSearchNote = async (query) => {
    try {
      
      const response = await api.get(ApiRoutes.SearchNotes.path, {params: {query}, authenticate: ApiRoutes.SearchNotes.authenticate});

      if(response.status === 200){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateIsPinned = async (noteData) => {
      try {
        const noteId = noteData._id;
        const response = await api.put(`${ApiRoutes.UpdateNotePinned.path}/${noteId}`, {"isPinned": !noteData.isPinned}, {authenticate: ApiRoutes.UpdateNotePinned.authenticate});

        if(response.status === 200){
            showToastMsg("Note Updated");
            getAllNotes();
        }
    } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message);
        }
    }
  }

  const handleClearSearch = () => {
    try {
      setIsSearch(false);
      getAllNotes();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto p-5">
        {allNotes.length > 0 ? <div className='grid grid-cols-3 gap-4 mt-8'>
          {
            allNotes.map((item, index)=>(
              <NoteCard 
                key={item._id} 
                title={item.title} 
                date={moment(item.createdOn).format("Do MMM YYYY")} 
                content={item.content} 
                tags={item.tags} 
                isPinned={item.isPinned} 
                onEdit={()=>{handleEdit(item)}} 
                onDelete={()=>{deleteNote(item)}} 
                onPinNote={()=>{updateIsPinned(item)}}
              />
            ))
          }
        </div> : <EmptyCard imgsrc={ isSearch ? imgsrc : add_note} message={isSearch ? "Oops! No Notes Found Matching Your Search" : `start creating your forst note! Click the "Add" button to jot down your thoughts, Ideas and reminders. and Let's get started.`}/>}
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{setOpenAddEditModal({isShown: true, type:"add", data: null})}}>
        <MdAdd className='text-[32px] text-white'/>
      </button>
      <Modal 
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>{}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)"
          }
        }}
        contentLabel=""
        className="w-[40%] m-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
      <AddEditNotes type={openAddEditModal.type} noteData={openAddEditModal.data} onClose={()=>{
        setOpenAddEditModal({isShown: false, type: "add", data: null})}}
        getAllNotes={getAllNotes}
        showToastMsg={showToastMsg}
      />
      </Modal>

      <Toast
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home