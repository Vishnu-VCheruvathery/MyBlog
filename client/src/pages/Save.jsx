import { Box, Stack, Typography } from '@mui/material'
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
  }, [userID, token, savedBlogs]); // Update the dependencies

  return (
    <div className="home">
    {
      savedBlogs.length > 0
       ? (
        <Stack flex={2}>
          {savedBlogs.map((blog) => (
            <SavedBlog key={blog._id} blog={blog} />
          ))}
        </Stack>
      
     
    
      ) : (
        <Box sx={{width: {xs: '45%', md: '30%'},
        height: '250px', 
        backgroundColor: 'white', 
        border: '1px solid gray',
        margin: '100px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0.5em',
        opacity: '0.7'
        }}>
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
