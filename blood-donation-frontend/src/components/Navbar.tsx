import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Bloodtype, ExitToApp } from '@mui/icons-material';
import { tokenstore } from '../auth/tokenstore';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
  userInfo?: string;
}

export default function Navbar({ title, userInfo }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenstore.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#d32f2f' }}>
      <Toolbar>
        <Bloodtype sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title} {userInfo && `- ${userInfo}`}
        </Typography>
        <Button 
          color="inherit" 
          onClick={handleLogout}
          startIcon={<ExitToApp />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}