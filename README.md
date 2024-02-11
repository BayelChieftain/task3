
## Description

This is a simple command-line game implemented in JavaScript. The game is a variation of the classic rock-paper-scissors, with an added twist of cryptographic hashing. The user plays against the computer, and the results are determined based on the rules of the game.

## Features

- **Game Logic**: Implements the core logic of the game, allowing for an arbitrary number of moves with the requirement that it must be an odd number of at least 3 non-repeating strings.

- **Random Move Generation**: The computer generates a random move for each game session.

- **Move Comparison**: Compares the user's move with the computer's move to determine the winner.

- **Command-Line Interface (CLI)**: Provides a simple CLI for users to interact with the game.

- **Help Display**: Shows a table displaying the possible moves and their outcomes against each other.

- **Cryptographic HMAC**: Uses a cryptographic HMAC (Hash-based Message Authentication Code) for added security. The key and HMAC are displayed to the user.



## Usage

Run the game by executing the following command in the terminal:

```bash
node <your-file-name>.js [move1] [move2] ... [moveN]

```
## Rules
- An odd number of moves is required, with a minimum of 3.
- Moves must be non-repeating strings.

## Commands
- `0` - Exit the game.
- `?` - Display the help table.
