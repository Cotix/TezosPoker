const sshuffle = require('secure-shuffle');
import SRACrypto from './libs/SRACrypto';
import io from 'socket.io-client';


const State = {
    LOBBY: 'lobby', TABLE: 'table', SETUPDONE: 'setupdone',AWAITINGDECK: 'awaitingdeck', DECKMADE: 'deckmade'
};

class PokerGame {

    constructor() {
        this.crypto = new SRACrypto(8);
        this.prime = undefined;
        this.room = undefined;
        this.plaintext = undefined;
        this.player_id = 1;
        this.state = State.LOBBY;
        this.deck = undefined;
    }

    async init(prime) {
        if (prime !== undefined) {
            this.prime = prime;
        }
        this.key = (await this.crypto.invoke('randomKeypair', {'prime':prime})).data.result;
        this.plaintext = (await Promise.all(Array.from(Array(52).keys()).map(
            async x => (await this.crypto.invoke('randomQuadResidues', {'prime':prime, 'numValues':x})).data.result
        )))[51];
    }

    async generate_prime() {
        return (await this.crypto.invoke('randomPrime', {bitLength:512, radix:16})).data.result;
    }

    async encrypt_shuffle_deck(deck) {
        let result = (await Promise.all(deck.map(
            async x => (await this.crypto.invoke('encrypt', {'value':x, 'keypair':this.key})).data.result
        )));
        return sshuffle(result);
    }
}

export let game = new PokerGame();
let socket;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function require_state(state) {
    while (game.state !== state) await sleep(100);
}

function assert_state(state) {
    if (game.state !== state) {
        // Something weird happened, stop the game
        console.log(state + ' ' + game.state);
        alert('Game broken bye.');
    }
}

function draw_text(text) {
    let canvas = document.getElementById("canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width/2, canvas.height/2);
}

function emit(topic, data) {
    socket.emit('message', {topic: topic, room: game.room, ...data});
}

function on_lobby(data) {
    draw_text('Waiting in lobby for other player. Calculating prime...');
    game.player_id = 0;
    game.room = data['room'];
    game.generate_prime().then(result => {
        console.log('Prime found: ' + result);
        game.prime = result;
        if (game.state === State.TABLE) emit('shared_prime', {prime: game.prime});
    })
}

function on_start(data) {
    draw_text('Other player found. Preparing game...');
    game.room = data['room'];
    if (game.prime !== undefined) {
        emit('shared_prime', {prime: game.prime});
    }
    if (game.state === State.LOBBY) {
        game.state = State.TABLE;
    }
}

function on_message(data) {
    console.log(data);
    switch(data['topic']) {
        case 'shared_prime':
            //TODO: Check if prime is correct
            draw_text('Shared prime negotiated! Calculating quadresidues...');
            game.init(data['prime']).then(() => {
                game.state = State.SETUPDONE;
                if (game.player_id === 0) {
                    draw_text('Encrypting and shuffling deck...');
                    game.encrypt_shuffle_deck(game.plaintext).then((result) => {
                        emit('deck_proposal', {deck: result});
                        game.state = State.AWAITINGDECK;
                        draw_text('Sent deck proposal...');
                    });
                }
            });
            break;

        case 'deck_proposal':
            if (game.player_id === 0) break; // Only player 1 does this
            require_state(State.SETUPDONE).then(() => {
                draw_text('Received deck proposal, encrypting and shuffling...');
                game.encrypt_shuffle_deck(data['deck']).then((result) => {
                    draw_text('Deck shuffled and ready to play!');
                    game.state = State.AWAITINGDECK;
                    emit('deck_final', {deck: result});
                });
            });
            break;

        case 'deck_final':
            assert_state(State.AWAITINGDECK);
            draw_text('Deck negotiated. Drawing cards..');
            game.deck = data['deck'];

            break;
    }
}


export async function init() {
    draw_text('Connecting to lobby...');
    socket = io('http://localhost:5000');
    socket.on('connect', () => {socket.emit('join')});
    socket.on('lobby', on_lobby);
    socket.on('start', on_start);
    socket.on('message', on_message);
}
