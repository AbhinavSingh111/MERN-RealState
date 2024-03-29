import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure } from "../redux/user/userSlice";

const Profile = () => {
  const {currentUser,loading , error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc , setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed', (snapshot)=>{
      const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      setFilePerc(progress);
      console.log(progress);
    },
    (error)=>{
      setFileUploadError(true);
      console.log(error);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData,avatar: downloadURL});
      });
      console.log(formData);
    });
  }

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        setUpdateSuccess(false);
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);


    } catch (error) {
      setUpdateSuccess(false);
      dispatch(updateUserFailure(error.message));
    }

  }
  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt="profile logo" onClick={()=>fileRef.current.click()}/>
        <p className='text-sm self-center'>
          {fileUploadError?(<span className='text-red-700'>Error Image Upload</span>):
           filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
           ): filePerc===100 ? (
            <span className='text-green-700'>Image Uploaded Successfully!</span>
           ):(
            ""
           )
          }
        </p>
        <input className='border p-3 rounded-lg' type="text" placeholder='username' id='username' defaultValue={currentUser.username}  onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type="text" placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type="text" placeholder='password' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...' : 'Update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      {updateSuccess&&<p className="text-green-500 mt-5">{'User updated Successfully!'}</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default Profile