import { Button, styled } from '@mui/material'
import axios from 'axios';
import React, {  useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill'
import {  useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
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

const Update = () => {
  const token = useSelector((state) => state.user.token)
  let username = null
   if(token){
      username = jwtDecode(token).username
   }

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serializedObj = queryParams.get('obj');
  const {id} = useParams()
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  
  let receivedObj = null;
  if(serializedObj){
    receivedObj = JSON.parse(decodeURIComponent(serializedObj));
  }



  const update = async ({id, token}) => {
    try {
      if(username === receivedObj.Author.username){
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);

        const response = await axios.put(
          `http://localhost:3001/blogs/edit/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(id)
        toast.success('Blog Updated');
        navigate('/');
        return response.data;
      }else{
        toast("You are not the Author")
      }
    } catch (error) {
      console.error(error)
    }
  };
 
  useEffect(() => {
    if (receivedObj) {
      setImage(receivedObj.image || ''); // Set default value to an empty string if imageUrl is not available
      setTitle(receivedObj.title || ''); // Set default value to an empty string if title is not available
      setContent(receivedObj.content || ''); // Set default value to an empty string if content is not available
    }
  }, [serializedObj]);

  return (
    <div className="main">
       <Button component="label" variant="contained" 
      startIcon={<CloudUpload />}>
      Upload file
      <VisuallyHiddenInput 
      type="file" 
      accept='.jpeg, .png, .jpg'
      onChange={(e) => setImage(e.target.files[0])}
      />
    </Button>
      <div className="labels">
        <label>Title:</label>
      </div>
      <input
        className="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <div className="labels">
        <label>Content:</label>
      </div>
      <ReactQuill theme="snow" value={content} onChange={(value) => setContent(value)} />
      <div className="labels">
        <Button
          sx={{
            backgroundColor: '#2374f7',
            color: 'white',
            ':hover': {
              backgroundColor: '#b3ccf5',
            },
          }}
          onClick={() => update({ id, token })}
        >
          POST
        </Button>
      </div>
    </div>
  );
};

export default Update;

