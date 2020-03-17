const sshuffle = require('secure-shuffle');

class PokerGame {

    constructor() {
        this.crypto = new SRACrypto(4);
    }

    async init(prime) {
        this.key = (await this.crypto.invoke('randomKeypair', {'prime':prime})).data.result;
        this.plaintext = (await Promise.all(Array.from(Array(52).keys()).map(
            async x => (await this.crypto.invoke('randomQuadResidues', {'prime':prime, 'numValues':x})).data.result
        )))[51];
    }

    async generate_prime() {
        return (await this.crypto.invoke('randomPrime', {bitLength:1024, radix:16})).data.result;
    }

    async encrypt_shuffle_deck(deck) {
        let result = (await Promise.all(deck.map(
            async x => (await this.crypto.invoke('encrypt', {'value':x, 'keypair':this.key})).data.result
        )))[51];

    }

}