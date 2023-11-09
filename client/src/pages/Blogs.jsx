import { Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Bookmark, Delete,  Edit, } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';





const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Blogs = ({blog}) => {
  const [imageCover, setImageCover] = useState(null);
  const [expanded, setExpanded] = useState(false);
  let userID = null
  let username = null
  const token = useSelector((state) => state.user.token)
  
  if(token){
    userID = jwtDecode(token).id
    username = jwtDecode(token).username
  }

  

   const deleteBlog = async ({id, token, blog}) => {
    try {
      if(username === blog.Author?.username){
        const response = await axios.delete(`http://localhost:3001/blogs/delete/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        toast.success('Blog Deleted');
        return response.data
      }else{
        toast("You are not the author")
      }
      
    } catch (error) {
      console.error(error)
    }
      
   }

   const saveBlog = async ({ blogID, token, userID }) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/blogs/savedBlogs/${blogID}/${userID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Blog Saved');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    // Dynamically import the image when the component mounts
    import(`../images/${blog.image}` /* @vite-ignore */)
      .then((image) => {
        setImageCover(image.default);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [blog.image]);


  return (
    <>
   
      <Card sx={{
      width: {xs: '400px', lg: '650px'},
      margin: '20px auto',

    }}>
      <CardHeader
        title={blog.title}
        subheader={`Author: ${blog.Author?.username}`}
      />
      <CardMedia
  component="img"
  height="20%"
  src={imageCover || '/no-image.jpg'}
  onError={(e) => {
    console.error("Image failed to load:", e.target.src);
  }}
/>
      <CardActions disableSpacing>
       {token ? (
        <IconButton 
        onClick={() => {
          deleteBlog({id: blog._id, token, blog: blog})
          }}
        aria-label="add to favorites">
          <Delete />
        </IconButton>
       ) : (
         <IconButton
          onClick={() => {toast("You need to be logged in to delete!")}}
         >
          <Delete />
         </IconButton>
       )}
       
       
        {token && username === blog.Author?.username ? (
          <Link   
          to={{
            pathname: `/edit/${blog._id}`,
            search: `?obj=${encodeURIComponent(JSON.stringify(blog))}`, // Add query parameters here
          }}
          >
        <IconButton aria-label="share">
        <Edit />
        </IconButton>
        </Link>
        ) : (
           <IconButton
           onClick={() => {toast("You need to be logged in to edit!")}}
           >
            <Edit />
           </IconButton>
        )}
        
        {token ? (
        
        <IconButton 
        aria-label="share"
        onClick={() => {
          saveBlog({blogID: blog._id, token: token, userID: userID})
        }}
        >
        <Bookmark />
        </IconButton>
       
        ) : (
           <IconButton
           onClick={() => {toast("You need to be logged in to edit!")}}
           >
            <Bookmark />
           </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <p dangerouslySetInnerHTML={{__html: blog.content}}/>
        </CardContent>
      </Collapse>
    </Card>
      
    </>
    
  )
}

export default Blogs
