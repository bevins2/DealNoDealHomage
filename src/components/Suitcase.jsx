import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import Button from "@mui/material/Button";

const moveToTopLeft = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100px, -100px); opacity: 0.8; }
`;

const CustomButton = styled(Button)(({ theme }) => ({
  '&.Mui-disabled': {
    opacity: 1,
    backgroundColor: "#000000",
    color: "white",
    border: "4px solid #C0C0C0",
  },
}));

const Suitcase = ({ index, isSelected, isOpened, suitcaseValue, handleSuitcaseClick, animateFirstCase, showOffer }) => {
  const buttonStyles = {
    width: 160, // Increase width
    height: 120, // Increase height
    fontSize: 24, // Larger font size
    fontWeight: 'bold', // Thicker and bolder font
    backgroundColor: isOpened ? "#000000" : (isSelected ? "#FFD700" : "#C0C0C0"), // Black for opened suitcases, silver for unopened
    color: isOpened ? "white" : (isSelected ? "white" : "black"), // White text for opened suitcases
    border: isOpened ? "4px solid #C0C0C0" : "none", // Thicker silver border for opened suitcases
    textTransform: "none",
    animation: isSelected && animateFirstCase ? `${moveToTopLeft} 1s forwards` : "none",
    opacity: isOpened ? 1 : undefined, // Ensure opened suitcases are fully opaque
    borderRadius: 6, // Rounder edges
  };

  if (isSelected && animateFirstCase) {
    return (
      <Box
        key={index}
        sx={{
          width: 160,
          height: 120,
        }}
      />
    );
  }

  return (
    <CustomButton
      key={index}
      variant="contained"
      onClick={() => handleSuitcaseClick(index)}
      disabled={(isOpened && !isSelected) || isSelected} // Disable if the suitcase is opened and not the first selected suitcase
      sx={buttonStyles}
      onAnimationEnd={() => {
        if (isSelected) animateFirstCase(false); // Reset animation state after it ends
      }}
    >
      {isOpened ? `$${suitcaseValue}` : index + 1}
    </CustomButton>
  );
};

export default Suitcase;
