This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installations
npx create-next-app@latest --typescript
npm install axios

## Learn More
Create a component Folder and add all the react components here.
Card.tsx -> display individual cards
Game.tsx ->  Manage the game state and logic
Game.module.css-> CSS module for the Game component 

## API  API `https://deckofcardsapi.com/` 
It is a web service that allows developers to interact with a deck of playing cards programmatically. It provides endpoints for creating, shuffling, drawing cards from, and managing decks of cards. Some of the key functionalities provided by this API include:

1. Creating a New Deck: You can create a new deck of cards, specifying parameters such as the number of decks to include and whether to include jokers.

2. Shuffling a Deck: After creating a deck, you can shuffle it to randomize the order of cards.

3. Drawing Cards: You can draw one or multiple cards from a deck. Drawing a card removes it from the deck.

4. Deck Information: You can retrieve information about a deck, such as the remaining cards, shuffled status, and deck ID.

5. Card Information: Get details about a specific card, including its value, suit, image URL, and code.

The API is useful for building card games, simulations, or any application that requires card manipulation and management. It simplifies tasks related to handling decks of cards and provides a convenient way to integrate card-related functionalities into your applications.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
