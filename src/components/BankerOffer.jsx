import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';

const BankerOffer = ({ offer, handleDeal, handleNoDeal }) => {
  const [showPhoneButton, setShowPhoneButton] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const audioRef = useRef(null);

  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.src = soundFile;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const delay = Math.random() * 5000 + 5000; // Random delay between 5-10 seconds
    const timer = setTimeout(() => {
      setShowPhoneButton(true);
      playSound('/sounds/banker.mp3'); // Play offer sound when the button shows up
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handlePhoneClick = () => {
    setShowOffer(true);
    playSound('/sounds/thinking-music.mp3'); // Play thinking music after clicking the phone button
  };

  return (
    <Dialog
      open={true}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          border: "2px solid #FFD700",
          backgroundColor: "#000000",
          width: '400px', // Fixed width for the dialog
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#000000",
            color: "#FFD700",
            padding: 2,
            borderRadius: 2,
          }}
        >
          {!showPhoneButton ? (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFD700",
                color: "#000000",
                padding: 2,
                borderRadius: 2,
                visibility: 'hidden', // Hide the button until the timer ends
              }}
            >
              <PhoneIcon sx={{ fontSize: 40 }} />
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handlePhoneClick}
              sx={{
                backgroundColor: "#FFD700",
                color: "#000000",
                padding: 2,
                borderRadius: 2,
              }}
            >
              <PhoneIcon sx={{ fontSize: 40 }} />
            </Button>
          )}
          {showOffer && (
            <>
              <Typography variant="h6">Banker's Offer:</Typography>
              <Typography variant="h4">${offer}</Typography>
            </>
          )}
        </Box>
      </DialogContent>
      {showOffer && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 1,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FFD700 30%, #FFEA00 90%)',
              color: '#000000',
            }}
          >
            <Button
              variant="contained"
              onClick={handleDeal}
              sx={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'red',
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              DEAL
            </Button>
          </Box>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 1,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FFD700 30%, #FFEA00 90%)',
              color: '#000000',
            }}
          >
            <Button
              variant="contained"
              onClick={handleNoDeal}
              sx={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              NO DEAL
            </Button>
          </Box>
        </DialogActions>
      )}
      <audio ref={audioRef} />
    </Dialog>
  );
};

export default BankerOffer;
