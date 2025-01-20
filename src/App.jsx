import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Grid, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel } from "@mui/material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import Suitcase from "./components/Suitcase";
import BankerOffer from "./components/BankerOffer";
import SuitcaseCount from "./components/SuitcaseCount";
import Logo from "./components/Logo";

const moveToBottom = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(400px); opacity: 0.8; }
`;

const CustomButton = styled(Button)(({ theme }) => ({
  '&.Mui-disabled': {
    opacity: 1,
    backgroundColor: "#000000",
    color: "white",
    border: "4px solid #C0C0C0",
  },
}));

// Original game ratios for values
const BASE_VALUES = [
  1000000, 750000, 500000, 400000, 300000, 200000, 100000, 75000,
  50000, 25000, 10000, 5000, 1000, 750, 500, 400, 300, 200, 100,
  75, 50, 25, 10, 5, 1, 0.01,
];

const scaleValues = (topPrize) => {
  const ratio = topPrize / BASE_VALUES[0];
  return BASE_VALUES.map((value) => parseFloat((value * ratio)));
};

const generateBigMoneyValues = (topPrize) => {
  const topValues = [];
  const bottomValues = [];
  const topHalfValue = topPrize / 2;
  const bottomHalfValue = topPrize * 0.4;

  // Generate top 13 values
  for (let i = 0; i < 13; i++) {
    const value = Math.round((topHalfValue + (topPrize - topHalfValue) * (i / 12)) / 5) * 5;
    topValues.push(value);
  }

  // Generate bottom 13 values
  for (let i = 0; i < 13; i++) {
    const value = Math.round((bottomHalfValue * (i / 12)) / 5) * 5;
    bottomValues.push(value);
  }
  bottomValues[0] = 0.01; // Ensure the lowest value is 1 cent

  return [...bottomValues, ...topValues];
};

const calculateBankerOffer = (remainingValues, turn) => {
  const expectedValue = remainingValues.reduce((acc, val) => acc + val, 0) / remainingValues.length;
  let adjustmentFactor;

  if (turn < 3) {
    adjustmentFactor = 0.3 + (0.2 * (turn / 3)); // Early game: 30% to 50%
  } else if (turn < 6) {
    adjustmentFactor = 0.5 + (0.2 * ((turn - 3) / 3)); // Middle game: 50% to 70%
  } else {
    adjustmentFactor = 0.7 + (0.2 * ((turn - 6) / 3)); // Late game: 70% to 90%
  }

  let offer = expectedValue * adjustmentFactor;
  const randomFactor = 1 + (Math.random() * 0.12 - 0.02); // Random factor between -2% and +10%
  offer *= randomFactor;

  // Ensure the offer does not exceed the highest value on the board
  const maxValue = Math.max(...remainingValues);
  offer = Math.min(offer, maxValue);

  // Round the offer to the nearest million, hundred thousand, ten thousand, thousand, hundred, tenth, or hundredth
  if (offer >= 1000000) {
    offer = Math.round(offer / 100000) * 100000;
  } else if (offer >= 100000) {
    offer = Math.round(offer / 10000) * 10000;
  } else if (offer >= 10000) {
    offer = Math.round(offer / 1000) * 1000;
  } else if (offer >= 1000) {
    offer = Math.round(offer / 100) * 100;
  } else if (offer >= 100) {
    offer = Math.round(offer / 10) * 10;
  } else if (offer >= 10) {
    offer = Math.round(offer)
  } else if (offer >= 1) {
    offer = Math.round(offer);
  } 

  return offer;
};

const DealOrNoDeal = () => {
  const [suitcaseValues, setSuitcaseValues] = useState([]);
  const [selectedSuitcase, setSelectedSuitcase] = useState(null);
  const [openedSuitcases, setOpenedSuitcases] = useState([]);
  const [animateFirstCase, setAnimateFirstCase] = useState(false);
  const [topPrize, setTopPrize] = useState(0);
  const [openPrompt, setOpenPrompt] = useState(true);
  const [useBigMoney, setUseBigMoney] = useState(false);
  const [turn, setTurn] = useState(0);
  const [offer, setOffer] = useState(1000);
  const [showOffer, setShowOffer] = useState(false);
  const [totalOpenedThisTurn, setTotalOpenedThisTurn] = useState(6);

  const suitcaseCounts = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1];

  const audioRef = useRef(null);

  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.src = soundFile;
      audioRef.current.play();
    }
  };

  const initializeGame = (topValue) => {
    setTopPrize(topValue);
    let scaledValues;
    if (useBigMoney) {
      scaledValues = generateBigMoneyValues(topValue);
    } else {
      scaledValues = scaleValues(topValue);
    }
    setSuitcaseValues(scaledValues.sort(() => Math.random() - 0.5));
    setOpenPrompt(false);
    setTotalOpenedThisTurn(suitcaseCounts[0]);
  };

  const handleSuitcaseClick = (index) => {
    if (showOffer) return; // Prevent opening suitcases when a deal is being offered

    if (selectedSuitcase === null) {
      setSelectedSuitcase(index);
      setAnimateFirstCase(true); // Trigger animation for the first case
    } else if (!openedSuitcases.includes(index) && index !== selectedSuitcase) {
      setOpenedSuitcases([...openedSuitcases, index]);
      setTotalOpenedThisTurn(totalOpenedThisTurn - 1);

      const sortedValues = [...suitcaseValues].sort((a, b) => a - b);
      const value = suitcaseValues[index];
      const valueIndex = sortedValues.indexOf(value);

      if (valueIndex < 13) {
        playSound('/sounds/goodsuitcase1.mp3'); // Play good suitcase sound
      } else if (valueIndex < 18) {
        playSound('/sounds/badsuitcase1.mp3'); // Play bad suitcase sound 1
      } else if (valueIndex < 23) {
        playSound('/sounds/badsuitcase2.mp3'); // Play bad suitcase sound 2
      } else {
        playSound('/sounds/badsuitcase3.mp3'); // Play bad suitcase sound 3
      }

      if (totalOpenedThisTurn - 1 === 0) {
        setShowOffer(true);
      }
    }
  };

  const handleOpenSelectedSuitcase = () => {
    if (openedSuitcases.length + 1 === suitcaseValues.length || showOffer) {
      setOpenedSuitcases([...openedSuitcases, selectedSuitcase]);
    }
  };

  const handleDeal = () => {
    alert(`You accepted the deal of $${offer}`);
    setShowOffer(false);
    setOpenedSuitcases([...openedSuitcases, selectedSuitcase]);
  };

  const handleNoDeal = () => {
    setShowOffer(false);
    setTurn(turn + 1);
    setTotalOpenedThisTurn(suitcaseCounts[turn + 1]);
  };

  const resetGame = () => {
    setSuitcaseValues([]);
    setSelectedSuitcase(null);
    setOpenedSuitcases([]);
    setAnimateFirstCase(false);
    setTopPrize(0);
    setOpenPrompt(true);
    setTurn(0);
    setOffer(1000);
    setShowOffer(false);
    setTotalOpenedThisTurn(suitcaseCounts[0]);
  };

  useEffect(() => {
    if (showOffer) {
      const remainingValues = suitcaseValues.filter((_, index) => !openedSuitcases.includes(index));
      const newOffer = calculateBankerOffer(remainingValues, turn);
      setOffer(newOffer);
    }
  }, [showOffer, suitcaseValues, openedSuitcases, turn]);

  const renderSelectedSuitcase = () => {
    if (selectedSuitcase === null) return null;
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: 2,
          padding: 2,
          border: "2px solid #FFD700",
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#000000",
          color: "#FFD700",
          cursor: showOffer || openedSuitcases.length + 1 === suitcaseValues.length ? 'pointer' : 'default',
        }}
        onClick={handleOpenSelectedSuitcase}
      >
        <Typography variant="h6">Your Selected Suitcase:</Typography>
        <Typography variant="h4">#{selectedSuitcase + 1}</Typography>
      </Box>
    );
  };

  const renderEndGame = () => {
    if (openedSuitcases.length + 1 === suitcaseValues.length && selectedSuitcase !== null) {
      return (
        <Box
          sx={{
            marginTop: 4,
            padding: 2,
            border: "2px solid #FFD700",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#000000",
            color: "#FFD700",
          }}
        >
          <Typography variant="h6">Final Suitcase Value:</Typography>
          <Typography variant="h3">${suitcaseValues[selectedSuitcase]}</Typography>
        </Box>
      );
    }
    return null;
  };

  const renderValueList = (values, openedValues) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {values.map((value, index) => {
          const isOpened = openedValues.includes(value);
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 0.5,
                padding: 1,
                border: '2px solid',
                borderColor: isOpened ? 'gray' : '#FFD700',
                background: isOpened ? 'lightgray' : 'linear-gradient(45deg, #FFFACD 30%, #FFD700 90%)', // More noticeable gradient
                color: isOpened ? 'gray' : 'black', // Black font
                borderRadius: 1,
                width: '100%',
                textAlign: 'center',
                fontWeight: 'bold', // Thicker and bolder font
                fontSize: 18, // Larger font size
              }}
            >
              <Typography variant="body1" sx={{ flex: 1, textAlign: 'left', fontWeight: 'bold', fontSize: 20 }}>
                $
              </Typography>
              <Typography variant="body1" sx={{ flex: 2, textAlign: 'right', fontWeight: 'bold', fontSize: 20 }}>
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  const sortedValues = [...suitcaseValues].sort((a, b) => a - b);
  const leftValues = sortedValues.slice(0, 13);
  const rightValues = sortedValues.slice(13);
  const openedValues = openedSuitcases.map(index => suitcaseValues[index]);

  const renderBankerOffer = () => {
    if (showOffer) {
      return (
        <BankerOffer
          offer={offer}
          handleDeal={handleDeal}
          handleNoDeal={handleNoDeal}
        />
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        padding: 4,
        color: "#FFD700",
        backgroundColor: "#000000", // Fallback background color
        backgroundImage: 'url(/deal.jpg)', // Absolute path for public directory
        backgroundSize: 'contain', // Maintain aspect ratio
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh', // Ensure it covers the entire viewport height
        position: 'relative',
      }}
    >
      <audio ref={audioRef} />
      <Dialog open={openPrompt} disableEscapeKeyDown>
        <DialogTitle>Enter Top Prize</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Top Prize Value"
            type="number"
            fullWidth
            onChange={(e) => setTopPrize(parseFloat(e.target.value))}
          />
          <FormControlLabel
            control={<Checkbox checked={useBigMoney} onChange={(e) => setUseBigMoney(e.target.checked)} />}
            label="Use Big Money"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => initializeGame(parseFloat(topPrize))}
            disabled={!topPrize || topPrize <= 0}
          >
            Start Game
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 0, marginRight: 2 }}>
          <SuitcaseCount totalOpenedThisTurn={totalOpenedThisTurn} />
        </Box>
        <Logo />
      </Box>
      {renderSelectedSuitcase()}
      {renderBankerOffer()}
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={2}>
          {renderValueList(leftValues, openedValues)}
        </Grid>
        <Grid item xs={8}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {suitcaseValues.map((value, index) => (
              <Box
                key={index}
                sx={{
                  flex: '1 0 18%', // Adjust flex basis to control the number of suitcases per row
                  maxWidth: '18%',
                  margin: '5px 2.5px', // Reduce horizontal margin by half
                  boxSizing: 'border-box',
                }}
              >
                <Suitcase
                  index={index}
                  isSelected={index === selectedSuitcase}
                  isOpened={openedSuitcases.includes(index)}
                  suitcaseValue={value}
                  handleSuitcaseClick={handleSuitcaseClick}
                  animateFirstCase={animateFirstCase}
                  showOffer={showOffer}
                />
              </Box>
            ))}
          </Box>
          {renderEndGame()}
        </Grid>
        <Grid item xs={2}>
          {renderValueList(rightValues, openedValues)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DealOrNoDeal;

