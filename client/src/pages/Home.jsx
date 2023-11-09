import React, { useEffect, useState } from 'react'
import Blogs from './Blogs'
import { Fab, Stack } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Home = () => {
   const [blogs, setBlogs] =  useState([])

  

  const getPost = async() => {
      try{
         const response = await axios.get('http://localhost:3001/blogs')
         setBlogs(response.data)
      }catch(err){
         console.error(err)
      }
     
   }
 
   useEffect(() => {
      getPost()

   }, [blogs])   

  return (
  <>
 
         <div className='home'>
       <Stack flex={2}>
          {blogs.map((blog) => (
            <Blogs key={blog._id} blog={blog}/>
          ))}
          <Link to='/new'>
          <Fab 
           sx={{
            backgroundColor: '#2374f7',
            color: 'white',
            position: 'fixed',
            right: {xs: '45%',lg: '50px'},
            bottom: '30px',
            ":hover":{
               color: 'black'
            }
           }}
           aria-label="add">
           <Add />
          </Fab></Link>
          </Stack>
          </div>
       
  </>
   
  )
}

export default Home
