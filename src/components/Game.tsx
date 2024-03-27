import React, { useState, useEffect } from 'react';

interface Card {
  value: string;
  suit: string;
}

interface GameState {
  playerHand: Card[];
  houseHand: Card[];
  playerTotal: number;
  houseTotal: number;
  gameOver: boolean;
  message: string;
  walletAmount:number;
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
    walletAmount:100
  });

  const [inputValue, setInputValue] = useState<number>(0);

  useEffect(() => {
    startGame();
  }, []);

  const placeBet = async (betAmount:number) =>{
      if(betAmount > walletAmount){
          alert("insufficient wallet balance")
      }else{
        try{
            const currentWalletAmount = gameState.walletAmount - betAmount;
            setGameState((prevState) => ({
              ...prevState, 
              walletAmount: currentWalletAmount, 
            }));
  
        }catch(error){
          console.error('Error placing the bet', error);
        }
      }
  }

  const startGame = async () => {
    try {
      const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const deckData = await deckResponse.json();
      const deckId = deckData.deck_id;
      const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
      const drawData = await drawResponse.json();
      const playerHand = drawData.cards.slice(0, 2);
      const houseHand = drawData.cards.slice(2);
      const playerTotal = calculateTotal(playerHand);
      const houseTotal = calculateTotal(houseHand);
      setGameState({
        playerHand,
        houseHand,
        playerTotal,
        houseTotal,
        gameOver: false,
        message: '',
        walletAmount,
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };


  const calculateTotal = (hand: Card[]) => {
    let total = 0;
    let hasAce = false;
    hand.forEach(card => {
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
        const deckId = gameState.playerHand[0].code.slice(0, -1);
        const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const drawData = await drawResponse.json();
        const newCard = drawData.cards[0];
        const playerHand = [...gameState.playerHand, newCard];
        const playerTotal = calculateTotal(playerHand);
        if (playerTotal > 21) {
          setGameState({ ...gameState, playerHand, playerTotal, gameOver: true, message: 'BUST! You lose!' });
        } else {
          setGameState({ ...gameState, playerHand, playerTotal });
        }
      } catch (error) {
        console.error('Error drawing card:', error);
      }
    }
  };

  const stand = () => {
    if (!gameState.gameOver) {
      const { houseHand, houseTotal } = gameState;
      const playerTotal = gameState.playerTotal;
      while (houseTotal < 17) {
        const newCard = drawCard();
        houseHand.push(newCard);
        const newTotal = calculateTotal([...houseHand]);
        if (newTotal > 21) break;
      }
      const winner = determineWinner(playerTotal, houseTotal);
      const message = getWinnerMessage(winner);
      setGameState({ ...gameState, houseHand, houseTotal, gameOver: true, message });
    }
  };

  const drawCard = () => {
    const deckId = gameState.houseHand[0].code.slice(0, -1);
    // Assume the deck has enough cards for the game
    // For a real application, handle deck exhaustion and reshuffling
    // Here, just draw a random card from the deck
    const cardValue = Math.floor(Math.random() * 13) + 1; // 1-13 for card value
    const cardSuit = Math.floor(Math.random() * 4) + 1; // 1-4 for card suit
    const value = cardValue > 10 ? ['JACK', 'QUEEN', 'KING'][cardValue - 11] : `${cardValue}`;
    const suit = ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS'][cardSuit - 1];
    return { value, suit };
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

  const { playerHand, houseHand, playerTotal, houseTotal, gameOver, message,walletAmount } = gameState;

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
      <p>Your Hand({playerTotal})</p>
      <div>
        {playerHand.map((card, index) => (
          <span key={index}>{`${card.value} of ${card.suit}, `}</span>
        ))}
      </div>
      <p>House Hand ({houseTotal})</p>
      <div>
        {houseHand.map((card, index) => (
          <span key={index}>{`${card.value} of ${card.suit}, `}</span>
        ))}
      </div>
      {gameOver && <p>{message}</p>}
    </div>
  );
};

export default Game;