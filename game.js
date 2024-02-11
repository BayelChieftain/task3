const crypto = require('crypto');
const Table = require('cli-table3');
const readline = require("readline");

class Game {
    constructor(moves) {
        if (!Array.isArray(moves) || moves.length < 3 || moves.length % 2 === 0) {
            throw new Error('Invalid moves, you must provide an odd number of at least 3 non-repeating strings.');
        }
        if (new Set(moves).size !== moves.length) {
            throw new Error('Invalid moves. You must provide non-repeating strings.');
        }

        this.moves = moves;
        this.half = Math.floor(moves.length / 2);
    }

    generateMove() {
        let index = Math.floor(Math.random() * this.moves.length);

        return this.moves[index]
    }

    compareMoves(move1st, move2nd) {
        if (move1st == move2nd) {
            return 'Draw';
        }

        let index1 = this.moves.indexOf(move1st);
        let index2 = this.moves.indexOf(move2nd);

        let distance = index2 - index1;

        if (distance < 0) {
            distance += this.moves.length;
        }

        if (distance <= this.half) {
            return 'Win';
        }

        return 'Lose';
    }

    displayHelp() {
        let table = new Table( {
            chars: {
                'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
                'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
                'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
                'right': '|', 'right-mid': '+', 'middle': '|'
            },
            style: { 'padding-left': 1, 'padding-right': 1, align: 'center' },
            colWidths: [14]
        });

        table.push(['v PC\\User >', ...this.moves]);
        for (let i = 0; i < this.moves.length; i++) {
            let row = []

            row.push(this.moves[i])

            for (let j = 0; j < this.moves.length; j++) {
                row.push(this.compareMoves(this.moves[i], this.moves[j]))
            }

            table.push(row);
        }

        return table.toString()
    }
}

class Crypto {
    constructor(algorithm) {
        if (!crypto.getHashes().includes(algorithm)) {
            throw new Error('Invalid algorithm. You must provide a supported hash algorithm.')
        }

        this.algorithm = algorithm;
    }

    generateKey(len) {
        if (!Number.isInteger(len) || len < 1) {
            throw new Error('Invalid length. You must provide a positive integer.');
        }

        return crypto.randomBytes(len).toString('hex')
    }

    generateHMAC(message, key) {
        if (typeof message !== 'string' || typeof key !== 'string') {
            throw new Error('Invalid message or key. You must provide strings.');
        }
        let hmac = crypto.createHmac(this.algorithm, key);
        hmac.update(message);
        return hmac.digest('hex');
    }
}

class UI {
    constructor(game, crypto) {
        this.game = game;
        this.crypto = crypto;

        this.key = this.crypto.generateKey(32);
        this.move = this.game.generateMove();

        this.hmac = this.crypto.generateHMAC(this.move, this.key);

        console.log('HMAC: ' + this.hmac);

        this.displayMenu();
    }

    displayMenu() {
        let menu = '';

        menu += 'Available moves:\n';

        for (let i = 0; i < this.game.moves.length; i++) {
            menu += (i + 1) + ' - ' + this.game.moves[i] + '\n';
        }

        menu += '0 - exit\n';
        menu += '? - help\n';

        console.log(menu);

        this.promptInput();
    }

    promptInput() {
        const readLine = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter your move: ', (answer) => {
            rl.close();

            this.handleInput(answer);
        });
    }

    handleInput(input) {
        if (input === '0') {
            console.log('bye!');
            process.exit(0);
        }
        if (input === '?') {
            console.log(this.game.displayHelp());
            this.displayMenu();
            return;
        }

        let index = parseInt(input);

        if (isNaN(index) || index < 1 || index > this.game.moves.length) {
            console.log('Invalid input. You must enter a number between 1 and ' + this.game.moves.length + ', 0 for exit, or ? for help.');
            this.displayMenu();
            return;
        }

        let userMove = this.game.moves[index - 1];

        console.log('Your move: ' + userMove);
        console.log('Computer move: ' + this.move);

        console.log("You " + this.game.compareMoves(userMove, this.move).toLowerCase() + '!');

        console.log('HMAC key: ' + this.key);

        process.exit(0);
    }
}

let args = process.argv.slice(2);
let game = new Game(args);
let crypto1 = new Crypto('sha256');
let ui = new UI(game, crypto1);