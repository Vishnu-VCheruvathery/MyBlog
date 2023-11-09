import React, {useState}from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './New.css'
import { Button, styled } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CloudUpload } from '@mui/icons-material';
import jwtDecode from 'jwt-decode';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const New = ({token}) => {
  const navigate = useNavigate()
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] =  useState()
  let userID = null;

   if(token){
     userID = jwtDecode(token).id
   }

  const Post = async () => {
    try {
      if (!token) {
        toast("You need to be logged in order to post");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("Author", userID);
  
      const response = await axios.post('http://localhost:3001/blogs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data for file uploads
        },
      });
  
      toast.success("Successfully Posted");
      navigate("/");
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='main' >
      <Button 
      component="label" 
      variant="contained" 
      startIcon={<CloudUpload />
      }
      >
      Upload file
      <VisuallyHiddenInput 
      type="file"   
      accept='.jpeg, .png, .jpg'
      onChange={(e) => setImage(e.target.files[0])}
      />
    </Button>
    <div className='labels'>
    <label>Title:</label>
    </div>
    <input 
    className='title'
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    ></input>
    <div className='labels'>
    <label >Content:</label>
    </div>
    <ReactQuill theme="snow" value={content} onChange={(value) => setContent(value)} />
     <div className='labels'>
       <Button sx={{
            backgroundColor: '#2374f7',
            color: 'white',
            ":hover": {
              backgroundColor: '#b3ccf5',
            }
            }}
            onClick={Post}
            >POST</Button>
     </div>
    </div>
  )
}

export default New

