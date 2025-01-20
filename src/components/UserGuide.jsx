import React from "react";
import { Box, Typography } from "@mui/material";

const UserGuide = ({ totalOpenedThisTurn }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        padding: 2,
        borderTop: "2px solid #FFD700",
        textAlign: "center",
        backgroundColor: "#000000",
        color: "#FFD700",
      }}
    >
      <Typography variant="h6">Pick {totalOpenedThisTurn} more suitcase{totalOpenedThisTurn > 1 ? 's' : ''}</Typography>
    </Box>
  );
};

export default UserGuide;
