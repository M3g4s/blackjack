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
  deckID: string;
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
    deckID: '4mln5suc53ud',
  });

  const [inputValue, setInputValue] = useState<number>(0);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    try {
      const deckResponse = await fetch(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      );
      const deckData = await deckResponse.json();
      const deckId = deckData.deck_id;
      const drawResponse = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4` // Draw 4 cards to ensure enough for both player and house
      );
      const drawData = await drawResponse.json();
      const playerHand = drawData.cards.slice(0, 2).map((card: any) => ({
        ...card,
        image: card.image,
      }));
      const houseHand = drawData.cards.slice(2, 4).map((card: any) => ({ // Slice only two cards for the house
        ...card,
        image: card.image,
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
        deckID: gameState.deckID,
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
            message: 'BUST! You lose!',
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
  
      if (houseHand.length === 2) { 
        const winner = determineWinner(playerTotal, houseTotal);
        const message = getWinnerMessage(winner);
        setGameState((prevState) => ({ ...prevState, gameOver: true, message }));
        return; 
      }
  
      const drawHouseCard = async () => {
        try {
          const newCard = await drawCard();
          houseHand.push(newCard);
          houseTotal = calculateTotal([...houseHand]);
  
          if (houseHand.length < 2) { 
            await drawHouseCard(); 
          } else {
            const winner = determineWinner(playerTotal, houseTotal);
            const message = getWinnerMessage(winner);
            setGameState((prevState) => ({ ...prevState, houseTotal, gameOver: true, message }));
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
      <h1 style={{ textAlign: 'center' }}>
          BlackJack Game
        </h1>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ width: '30%'}}>
          <div style={{marginBottom:'100%'}}>
            <div>
              <button onClick={startGame}>Start Game</button>
              <button onClick={hit}>Hit</button>
              <button onClick={stand}>Stand</button>
            </div>
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
        </div>
        <div style={{ width: '60%' }}>
          <h1 style={{ textAlign: 'center' }}>Rules of the Game</h1>
          <p>If you’re not familiar with the game, here are the simplified rules we will be going by for this project:</p>
          <p>The game consists of two players: You vs The House (the computer), where the goal is to beat the House’s hand, without going over 21.</p>
          <p>A card contains a “point” value equivalent to its number (the 3 of club is worth 3 points...the 9 of spades is worth 9 points...etc etc). Face cards (Jack, Queen, King) are worth TEN points, and the Ace card is either worth 1 or 11, whichever is most helpful for the player’s hand. For example:</p>
          <p>If the player has a Jack and a Queen, and then draws an Ace, the Ace will be worth 1 point to add up to 21</p>
          <p>If the player has a Queen and an Ace, the Ace will be worth 11 points to add up to 21</p>
          <p>If the player has a 2 and an Ace, the Ace will be worth 11 points to get closer to 21</p>
          <p>If the player has a 2 and a 5, and then draws an Ace, the Ace will be worth 11 points to get closer to 21. If the player then draws a 10, the Ace will now be worth 1 point</p>
          <p>The House is initially dealt TWO face up cards and no more! This isn’t part of the regular rules for Blackjack, but it is for us. In other words, the House will always only have 2 cards.</p>
          <p>You are also initially dealt two face up cards, but you have one of the following options:</p>
          <p>Hit: You are dealt one more card to add to your point value. For this project, the player may hit as many times as they like, until their card value exceeds 21, at which point the game ends in an automatic loss</p>
          <p>Stand: Ends the round (for the purposes of this project, this will end the game)</p>
          <p>Once you end the round, the game is over, and there should be a display of whether you won or lost.</p>
          <p>Don’t deal with a new deck every hand or rely on a refresh. You should be able to run through the deck and shuffle at the end when needed.</p>

          <h1 style={{ textAlign: 'center' }}>Conditions</h1>
          <p>You Win if:</p>
          <ul>
            <li>Your current total is less than 21 but higher than the House’s total</li>
            <li>Your current total is 21 and the House’s total is not 21</li>
          </ul>
          <p>You lose if:</p>
          <ul>
            <li>Your current total totals over 21 (don’t forget to factor in the different edge cases of the Ace card!)</li>
            <li>You current total is less than 21 but lower than the House’s total</li>
            <li>You tie with the House</li>
          </ul>
        </div>
      </div>
    </div>
  );
              }

             
export default Game;
