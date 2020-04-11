const sshuffle = require('secure-shuffle');
import { draw_loop } from './gui';
import SRACrypto from './libs/SRACrypto';
import io from 'socket.io-client';



export const State = {
    LOBBY: 'lobby', TABLE: 'table', SETUPDONE: 'setupdone',AWAITINGDECK: 'awaitingdeck', AWAITINGHAND: 'awaitinghand',
    BET0: 'bet0', BET1: 'bet1', FLOP: 'flop', TURN: 'turn', RIVER: 'river'
};

class PokerGame {

    constructor() {
        this.crypto = new SRACrypto(8);
        this.prime = undefined;
        this.room = undefined;
        this.plaintext = undefined;
        this.player_id = 1;
        this.state = State.LOBBY;
        this.hand = [];
        this.opponent_hand = [];
        this.deck = undefined;
        this.river = [];
        this.bets = [0, 0];
        this.chips = [1000, 1000];
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

    async decrypt_value(value) {
        let resultObj = await this.crypto.invoke('decrypt', {'value': value, 'keypair':this.key});
        return resultObj.data.result;
    }

    get_card_value(value) {
        let result = this.plaintext.indexOf(value);
        if (result === -1) return undefined;
        const suite = ['Clubs', 'Hearts', 'Clover', 'Diamond'][result%4];
        const rank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'][Math.floor(result/4)];
        return suite + ' ' + rank;
    }

    bet(amount) {
        if ((this.state === State.BET0 && this.player_id === 0) || (this.state === State.BET1 && this.player_id === 1)) {
            // Little ugly to call socket here because it entangles the game logic with networking
            // But fuck it
            emit('bet', {amount: amount});
        }
    }

    draw_card() {
        return this.deck.pop();
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

function emit(topic, data) {
    socket.emit('message', {topic: topic, room: game.room, sender: game.player_id, ...data});
}

function on_lobby(data) {
    game.player_id = 0;
    game.room = data['room'];
    game.generate_prime().then(result => {
        console.log('Prime found: ' + result);
        game.prime = result;
        if (game.state === State.TABLE) emit('shared_prime', {prime: game.prime});
    })
}

function on_start(data) {
    game.room = data['room'];
    if (game.prime !== undefined) {
        emit('shared_prime', {prime: game.prime});
    }
    if (game.state === State.LOBBY) {
        game.state = State.TABLE;
    }
}

function finish_hand(winner) {
    if (winner === 0) {
        game.chips = [game.chips[0] + game.bets[1], game.chips[1] - game.bets[1]];
    } else {
        game.chips = [game.chips[0] - game.bets[0], game.chips[1] + game.bets[0]];
    }
    game.bets = [0,0];
    game.player_id = game.player_id === 0 ? 1 : 0;
    game.hand = [];
    game.opponent_hand = [];
    game.deck = undefined;
    game.river = [];

    if (game.player_id === 0) {
        game.encrypt_shuffle_deck(game.plaintext).then((result) => {
            emit('deck_proposal', {deck: result});
            game.state = State.AWAITINGDECK;
        });
    } else {
        game.state = State.SETUPDONE;
    }
}

function on_message(data) {
    console.log(data);
    switch(data['topic']) {
        case 'shared_prime':
            //TODO: Check if prime is correct
            game.init(data['prime']).then(() => {
                game.state = State.SETUPDONE;
                if (game.player_id === 0) {
                    game.encrypt_shuffle_deck(game.plaintext).then((result) => {
                        emit('deck_proposal', {deck: result});
                        game.state = State.AWAITINGDECK;
                    });
                }
            });
            break;

        case 'deck_proposal':
            if (game.player_id === 0) break; // Only player 1 does this
            require_state(State.SETUPDONE).then(() => {
                game.encrypt_shuffle_deck(data['deck']).then((result) => {
                    game.state = State.AWAITINGDECK;
                    emit('deck_final', {deck: result});
                });
            });
            break;

        case 'deck_final':
            assert_state(State.AWAITINGDECK);
            game.state = State.AWAITINGHAND;
            game.deck = data['deck'];
            // pop the opponents cards
            const p0 = [game.draw_card(), game.draw_card()];
            const p1 = [game.draw_card(), game.draw_card()];
            let cards = game.player_id == 0 ? p1 : p0;
            Promise.all(cards.map(
                async x => (await game.decrypt_value(x))
            )).then(result => {
               emit('player_hand', {cards: result});
            });
            break;

        case 'player_hand':
            if (data['sender'] === game.player_id) break;
            assert_state(State.AWAITINGHAND);
            Promise.all(data['cards'].map(
                async x => (await game.decrypt_value(x))
            )).then(result => {
                game.hand = result;
                game.state = State.BET0;
            });
            break;

        case 'bet':
            if (data['sender'] === 0) assert_state(State.BET0);
            if (data['sender'] === 1) assert_state(State.BET1);
            // TODO: Check wether bet is allowed or not

            if (game.state === State.BET0) {
                if (data['amount'] === -1) {
                    finish_hand(1);
                    break;
                }
            } else {
                if (data['amount'] === -1) {
                    finish_hand(0);
                    break;
                }
            }

            game.bets[data['sender']] += data['amount'];
            if (game.state === State.BET0 && (game.bets[0] !== game.bets[1] && data['amount'] !== 0)) game.state = State.BET1;
            else {
                if (game.bets[1] > game.bets[0]) {
                    game.state = State.BET0;
                    break;
                }
                let cards = [];
                if (game.river.length === 0) {
                    cards = [game.draw_card(), game.draw_card(), game.draw_card()];
                    game.state = State.FLOP;
                } else if (game.river.length === 3) {
                    cards = [game.draw_card()];
                    game.state = State.TURN;
                } else if (game.river.length === 4) {
                    cards = [game.draw_card()];
                    game.state = State.RIVER;
                } else if (game.river.length === 5) {
                    emit('show', {hand: game.hand});
                }
                if (cards.length !== 0) {
                    Promise.all(cards.map(
                        async x => (await game.decrypt_value(x))
                    )).then(result => {
                        emit('river_cards', {cards: result});
                    });
                }
            }
            break;

        case 'river_cards':
            if (data['sender'] !== game.player_id) {
                Promise.all(data['cards'].map(
                    async x => (await game.decrypt_value(x))
                )).then(result => {
                    game.river = game.river.concat(result);
                    game.state = State.BET0;
                });
            }
            break;

        case 'show':
            if (data['sender'] !== game.player_id) {
                game.opponent_hand = data['hand'];
            }
            break;
    }
}


export async function init() {
    draw_loop();
    socket = io('http://localhost:5000');
    socket.on('connect', () => {socket.emit('join')});
    socket.on('lobby', on_lobby);
    socket.on('start', on_start);
    socket.on('message', on_message);
}
