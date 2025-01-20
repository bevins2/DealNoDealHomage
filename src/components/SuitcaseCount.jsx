import React from "react";
import { Box, Typography } from "@mui/material";

const SuitcaseCount = ({ totalOpenedThisTurn }) => {
  return (
    <Box
      sx={{
        marginTop: 2,
        marginBottom: 2, // Add bottom margin
        padding: 1, // Reduce padding
        border: "2px solid #FFD700",
        borderRadius: 2,
        textAlign: "center",
        backgroundColor: "#000000",
        color: "#FFD700",
        width: '150px', // Reduce width
      }}
    >
      <Typography variant="h6" sx={{ fontSize: '16px' }}>Suitcases to Open:</Typography>
      <Typography variant="h4" sx={{ fontSize: '24px' }}>{totalOpenedThisTurn}</Typography>
    </Box>
  );
};

export default SuitcaseCount;
