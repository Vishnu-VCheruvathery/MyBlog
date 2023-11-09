import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Button} from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';



const Navbar = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  React.useEffect(() => {
    // This effect will run whenever the token changes
    // You can use it to trigger a re-render of the Navbar
  }, [token]);

  return (
    <AppBar position="static" sx={{ gap: 50, width: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center', // Vertically center the content
        }}
      >
        <div>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: { xs: 15, lg: 0 },
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontSize: 35,
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MYBLOG
            </Typography>
          </Box>
        </div>

        <div>
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon
                sx={{
                  fontSize: 35,
                }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem>
                <Link className="nav" to="/saved">
                  Saved
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="nav" to="/forms">
                  Login/Register
                </Link>
              </MenuItem>
              {token ? (
                <MenuItem>
                  <div onClick={() => dispatch(logout())} className="nav">
                    Logout
                  </div>
                </MenuItem>
              ) : null}
            </Menu>
          </Box>
        </div>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end', // Push buttons to the right
          }}
        >
          <Button onClick={handleCloseNavMenu}>
            <Link className="nav" to="/saved">
              Saved
            </Link>
          </Button>
          <Button onClick={handleCloseNavMenu}>
            <Link className="nav" to="/forms">
              Login/Register
            </Link>
          </Button>
          {token ? (
            <Button>
              <div onClick={() => dispatch(logout())} className="nav">
                Logout
              </div>
            </Button>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


