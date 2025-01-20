import React from "react";
import { Box, Typography } from "@mui/material";

const Logo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        color: '#FFD700',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', backgroundColor: '#FFD700', color: '#000000', padding: '0 10px', borderRadius: '3px' }}>
        DEAL
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700', backgroundColor: '#000000', borderRadius: '3px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        OR
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700', border: '3px solid #FFD700', padding: '0 10px', borderRadius: '3px' }}>
        NO DEAL
      </Typography>
    </Box>
  );
};

export default Logo;
