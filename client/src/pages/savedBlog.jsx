import { Bookmark, Delete, Edit } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';


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


const SavedBlog = ({blog}) => {
    const [imageCover, setImageCover] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const token = useSelector((state) => state.user.token)
    let userID = null
    if(token){
        userID = jwtDecode(token).id 
    }
    const deleteBlog = async ({userID, token, blogID}) => {
        try {
            const response = await axios.delete(`http://localhost:3001/blogs/savedBlogs/${userID}/${blogID}`, { headers: { Authorization: `Bearer ${token}` }})
            toast.success('Blog Deleted');
            return response.data   
        } catch (error) {
          console.error(error)
        }
          
       }

       const handleExpandClick = () => {
        setExpanded(!expanded);
      };

       useEffect(() => {
        // Dynamically import the image when the component mounts
        import(`images/${blog.image}` /* @vite-ignore */)
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
          deleteBlog({userID: userID, token: token, blogID: blog._id})
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

export default SavedBlog
