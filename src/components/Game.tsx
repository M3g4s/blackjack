import React, { useState, useEffect } from 'react';

interface Card {
  value: string;
  suit: string;
  image: string; // Add image property
}

interface GameState {
  playerHand: Card[];
  houseHand: Card[];
  playerTotal: number;
  houseTotal: number;
  gameOver: boolean;
  message: string;
  walletAmount: number;
  deckID: string
}

const Game: React.FC = () => {
  console.error('Error starting test:');
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    houseHand: [],
    playerTotal: 0,
    houseTotal: 0,
    gameOver: false,
    message: '',
    walletAmount: 100,
    deckID:'yuao6sy7n8z9'
  });

  const [inputValue, setInputValue] = useState<number>(0);

  useEffect(() => {
    startGame();
  }, []);

  const placeBet = async (betAmount: number) => {
    const { walletAmount } = gameState;
    if (betAmount > walletAmount) {
      alert('Insufficient wallet balance');
    } else {
      try {
        const currentWalletAmount = walletAmount - betAmount;
        setGameState((prevState) => ({
          ...prevState,
          walletAmount: currentWalletAmount
        }));
      } catch (error) {
        console.error('Error placing the bet', error);
      }
    }
  };

  const startGame = async () => {
    try {
      const deckResponse = await fetch(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      );
      const deckData = await deckResponse.json();
      const deckId = deckData.deck_id;
      const drawResponse = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
      );
      const drawData = await drawResponse.json();
      const playerHand = drawData.cards.slice(0, 2).map((card: any) => ({
        ...card,
        image: card.image
      }));
      const houseHand = drawData.cards.slice(2).map((card: any) => ({
        ...card,
        image: card.image
      }));
      const playerTotal = calculateTotal(playerHand);
      const houseTotal = calculateTotal(houseHand);
      setGameState({
        playerHand,
        houseHand,
        playerTotal,
        houseTotal,
        gameOver: false,
        message: '',
        walletAmount: gameState.walletAmount,
        deckID:gameState.deckID
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const calculateTotal = (hand: Card[]) => {
    let total = 0;
    let hasAce = false;
    hand.forEach((card) => {
      if (card.value === 'ACE') {
        hasAce = true;
      }
      total += getCardValue(card.value);
    });
    if (hasAce && total + 10 <= 21) {
      total += 10; // Use Ace as 11
    }
    return total;
  };

  const getCardValue = (value: string) => {
    if (['KING', 'QUEEN', 'JACK'].includes(value)) {
      return 10;
    } else if (value === 'ACE') {
      return 1; // Assume Ace as 1 initially
    } else {
      return parseInt(value);
    }
  };

  const hit = async () => {
    if (!gameState.gameOver) {
      try {
        const deckId = gameState.deckID;
        const drawResponse = await fetch(
          `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
        );
        const drawData = await drawResponse.json();
        const newCard = drawData.cards[0];
        const playerHand = [...gameState.playerHand, { ...newCard, image: newCard.image }];
        const playerTotal = calculateTotal(playerHand);
        if (playerTotal > 21) {
          setGameState({
            ...gameState,
            playerHand,
            playerTotal,
            gameOver: true,
            message: 'BUST! You lose!'
          });
        } else {
          setGameState({ ...gameState, playerHand, playerTotal });
        }
      } catch (error) {
        console.error('Error drawing card:', error);
      }
    }
  };
  

  const stand = async () => {
    if (!gameState.gameOver) {
      let { houseHand, houseTotal } = gameState;
      const playerTotal = gameState.playerTotal;
      
      const drawHouseCard = async () => {
        try {
          const newCard = await drawCard();
          houseHand.push(newCard);
          houseTotal = calculateTotal([...houseHand]);
  
          if (houseTotal < 17) {
            await drawHouseCard(); // Recursive call until house total >= 17
          } else {
            const winner = determineWinner(playerTotal, houseTotal);
            const message = getWinnerMessage(winner);
            setGameState(prevState => ({ ...prevState, houseHand, houseTotal, gameOver: true, message }));
          }
        } catch (error) {
          console.error('Error drawing card:', error);
        }
      };
  
      await drawHouseCard(); // Start drawing cards for the house
    }
  };
  

  const drawCard = async () => {
    try {
      const deckId = gameState.deckID;
      const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const drawData = await drawResponse.json();
      const newCard = drawData.cards[0];
      return { 
        value: newCard.value, 
        suit: newCard.suit, 
        image: newCard.image 
      };
    } catch (error) {
      console.error('Error drawing card:', error);
      return null;
    }
  };
  

  const determineWinner = (playerTotal: number, houseTotal: number) => {
    if (playerTotal > 21) return 'house';
    if (houseTotal > 21) return 'player';
    if (playerTotal > houseTotal) return 'player';
    if (houseTotal > playerTotal) return 'house';
    return 'tie';
  };

  const getWinnerMessage = (winner: string) => {
    if (winner === 'player') return 'You win!';
    if (winner === 'house') return 'House wins!';
    return 'It\'s a tie!';
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseInt(event.target.value));
  };

  const { playerHand, houseHand, playerTotal, houseTotal, gameOver, message, walletAmount } = gameState;

  return (
    <div>
      <div>
        <button onClick={startGame}>Start Game</button>
        <button onClick={hit}>Hit</button>
        <button onClick={stand}>Stand</button>
      </div>
      <p>Wallet $({walletAmount})</p>
      <input onChange={handleInputChange} /> 
      <button onClick={() => placeBet(inputValue)}>place bet</button>
      <p>Your Hand ({playerTotal})</p>
      <div>
        {playerHand.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} style={{ width: '100px', marginRight: '5px' }} />
        ))}
      </div>
      <p>House Hand ({houseTotal})</p>
      <div>
        {houseHand.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} style={{ width: '100px', marginRight: '5px' }} />
        ))}
      </div>
      {gameOver && <p>{message}</p>}
    </div>
  );
        }

        export default Game;
