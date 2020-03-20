const sshuffle = require('secure-shuffle');
import SRACrypto from './libs/SRACrypto';
class PokerGame {

    constructor() {
        this.crypto = new SRACrypto(8);
    }

    async init(prime) {
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
        console.log(result);
        return sshuffle(result);
    }
}

export let game = new PokerGame();

function draw_text(text) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width/2, canvas.height/2);
}

export async function init() {
    draw_text('Generating prime...');
    let prime = await game.generate_prime();
    draw_text('Generating cryptokey and card values...');
    await game.init(prime);
    draw_text('Encrypting the deck...');
    console.log(await game.encrypt_shuffle_deck(game.plaintext));
    draw_text('Crypto keys generated and deck shuffled!');
}
