import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import SavedBlog from './savedBlog';

const Save = () => {
  const [savedBlogs, setSaved] = useState([]);
  const token = useSelector((state) => state.user.token);
  let userID = null
  if(token){
    userID = jwtDecode(token).id
  }

  const getSavedBlogs = async ({ userID, token }) => {
    try {
      const response = await axios.get(`http://localhost:3001/blogs/savedBlogs/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      setSaved(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSavedBlogs({ userID, token }); // Use the correct userID
  }, [userID, token]); // Update the dependencies

  return (
    <div className="home">
    {
      savedBlogs
       ? (
       
        <Stack flex={2}>
          {savedBlogs.map((blog) => (
            <SavedBlog key={blog._id} blog={blog} />
          ))}
        </Stack>
    
      ) : (
          <Box>
           <Typography variant='h6'>
           You have no Saved Blogs!!
           </Typography> 
          </Box>
      )
    }
    </div>
  );
};

export default Save
