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
    background: isOpened 
      ? "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)" 
      : isSelected 
        ? "linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)"
        : "linear-gradient(145deg, #E8E8E8 0%, #C0C0C0 25%, #A8A8A8 50%, #C0C0C0 75%, #E8E8E8 100%)", // Metallic silver gradient
    color: isOpened ? "#C0C0C0" : "#000", // Silver text for opened, black for others
    border: isOpened 
      ? "3px solid #404040" 
      : isSelected 
        ? "3px solid #B8860B" 
        : "3px solid #999999", // Darker borders for realism
    borderTop: isOpened 
      ? "3px solid #606060" 
      : isSelected 
        ? "3px solid #DAA520" 
        : "3px solid #D3D3D3", // Lighter top border for 3D effect
    borderLeft: isOpened 
      ? "3px solid #505050" 
      : isSelected 
        ? "3px solid #B8860B" 
        : "3px solid #B8B8B8", // Medium left border
    boxShadow: isOpened 
      ? "inset 2px 2px 4px rgba(0,0,0,0.6), inset -2px -2px 4px rgba(255,255,255,0.1), 2px 4px 8px rgba(0,0,0,0.4)"
      : isSelected 
        ? "inset 2px 2px 4px rgba(255,255,255,0.6), inset -2px -2px 4px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.3)"
        : "inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.3)", // 3D metallic shadow effects
    textTransform: "none",
    animation: isSelected && animateFirstCase ? `${moveToTopLeft} 1s forwards` : "none",
    opacity: isOpened ? 1 : undefined, // Ensure opened suitcases are fully opaque
    borderRadius: 8, // Slightly more rounded for suitcase look
    position: 'relative',
    textShadow: isOpened 
      ? "1px 1px 2px rgba(0,0,0,0.8)" 
      : "1px 1px 2px rgba(0,0,0,0.3)", // Text shadow for better readability
    transition: 'all 0.2s ease-in-out', // Smooth transitions
    '&:hover': !isOpened && !isSelected ? {
      transform: 'translateY(-2px)',
      boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.9), inset -2px -2px 4px rgba(0,0,0,0.4), 2px 6px 12px rgba(0,0,0,0.4)"
    } : {}
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
      <Box
        sx={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: isOpened 
            ? '1px solid #404040' 
            : isSelected 
              ? '1px solid #B8860B'
              : '1px solid #999999',
          borderRadius: '4px',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      {isOpened ? `$${suitcaseValue}` : index + 1}
    </CustomButton>
  );
};

export default Suitcase;
