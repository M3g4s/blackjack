## Installations
npx create-next-app@latest --typescript
npm install axios

## Techstack Used
React, TypeScript, and Next.js were chosen for the Blackjack game project for several reasons:

1. React: 
   - React is a popular JavaScript library for building user interfaces, known for its component-based architecture and declarative approach.
   - It simplifies the development of interactive UIs by breaking them into reusable components, which is beneficial for a game like Blackjack with distinct UI elements such as cards, buttons, and messages.

2. TypeScript:
   - TypeScript is a superset of JavaScript that adds static typing to the language, providing benefits such as improved code quality, better developer tooling, and early error detection.
   - In a complex application like a Blackjack game, TypeScript helps catch type-related errors during development, reducing bugs and improving code maintainability.

3. Next.js:
   - Next.js is a popular React framework that offers features like server-side rendering, static site generation, and routing out of the box.
   - For the Blackjack game project, Next.js could be beneficial for server-side rendering of initial game states, improving SEO and performance.
   - Additionally, Next.js provides a structured approach to building React applications with features like API routes, which can be useful for integrating with external APIs (e.g., the deck of cards API used in the game).

In summary, using React with TypeScript and Next.js provides a robust foundation for developing a dynamic and interactive game like Blackjack, combining the benefits of component-based UI development, static typing for code safety, and advanced features for web application architecture and performance.


## API  `https://deckofcardsapi.com/` 
It is a web service that allows developers to interact with a deck of playing cards programmatically. It provides endpoints for creating, shuffling, drawing cards from, and managing decks of cards. Some of the key functionalities provided by this API include:

1. Creating a New Deck: You can create a new deck of cards, specifying parameters such as the number of decks to include and whether to include jokers.

2. Shuffling a Deck: After creating a deck, you can shuffle it to randomize the order of cards.

3. Drawing Cards: You can draw one or multiple cards from a deck. Drawing a card removes it from the deck.

4. Deck Information: You can retrieve information about a deck, such as the remaining cards, shuffled status, and deck ID.

5. Card Information: Get details about a specific card, including its value, suit, image URL, and code.

The API is useful for building card games, simulations, or any application that requires card manipulation and management. It simplifies tasks related to handling decks of cards and provides a convenient way to integrate card-related functionalities into your applications.
