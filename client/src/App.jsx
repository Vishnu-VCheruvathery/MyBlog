import { Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import './App.css';
import Navbar from './components/Navbar';
import Save from './pages/Save';
import Form from './pages/Form';
import Home from './pages/Home';
import New from './pages/New';
import Update from './pages/Update';
import { useEffect, useState } from 'react';
import { getToken } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";







function App() {
  const [loading, setLoading] = useState(false)
   const token = useSelector((state) => state.user.token)
   const dispatch = useDispatch()
   
   useEffect(() => {
    if (!token) {
      console.log(token)
      dispatch(getToken())
    }
   }, [token, dispatch])

   useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
   }, [])


  return (
    <div className="App">

      {
        loading ? 
        <div className='spinner'>
        <ClipLoader color='gray' loading={loading} size={150} />
        </div>
        :
        <>
        <Navbar/>
          <Toaster 
           position={window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'}
          toastOptions={{duration: 5000}} />
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/saved' element={<Save />} />
            <Route path='/forms' element={<Form />} />
            <Route path='/new' element={<New token={token}/>} />
            <Route path='/edit/:id' element={<Update />} />
          </Routes>
        </>
      }

        
    </div>
  );
}

export default App;
