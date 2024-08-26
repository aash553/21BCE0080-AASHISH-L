# 21BCE0080-AASHISH-L
# Chess-like Turn-Based Game

## Project Overview

This is a turn-based chess-like game with a server-client architecture. The game is played on a 5x5 board and supports real-time communication between players using websockets. The primary goal is to develop a functional game with server-side and client-side validation, handling edge cases, and ensuring smooth gameplay.

## Features

- **Real-time Multiplayer:** Supports two players in real-time, with game state synchronization across clients.
- **Websocket Communication:** Handles game events, player moves, and game state updates through websockets.
- **Move Validation:** Both client-side and server-side move validation to ensure fairness and adherence to game rules.
- **Edge Case Handling:** Includes handling for simultaneous moves, player disconnection/reconnection, out-of-turn moves, and more.
- **Turn-Based Gameplay:** The game alternates turns between players, with clear indication of the current player's turn.

## Game Rules

- The game is played on a 5x5 grid.
- Each player controls a set of unique characters, each with its own movement rules.
- The objective is to eliminate all opponent pieces or strategically dominate the board.

## Setup Instructions

### Prerequisites

- **Node.js** installed on your system.
- **npm** (Node Package Manager) to manage dependencies.
- **Git** for version control.

### Server Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
Navigate to the server directory:
bash
Copy code
cd your-repo-name/server
Install server dependencies:
bash
Copy code
npm install
Start the server:
bash
Copy code
npm start
Client Setup
Navigate to the client directory:
bash
Copy code
cd ../client
Install client dependencies:
bash
Copy code
npm install
Start the client:
bash
Copy code
npm start
Running the Game
Open your browser and go to http://localhost:3000 to start playing.
Ensure the server is running before starting the client.
Code Structure
/server: Contains the backend logic, including game rules, move validation, and websocket handling.
/client: Contains the frontend code, including the game board UI, websocket communication, and client-side validation.
Known Issues & Future Improvements
Simultaneous Moves: Currently, the system handles simultaneous moves, but further testing is needed.
AI Opponents: Adding AI players is a future enhancement.
Polish UI: Although functional, the UI can be enhanced for a better user experience.
Contributing
Feel free to fork this repository, submit pull requests, or report issues. Contributions are welcome!

License
This project is licensed under the MIT License.

Contact
If you have any questions, feel free to reach out to me at aashishlalith553@gmail.com.
