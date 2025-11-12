import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}