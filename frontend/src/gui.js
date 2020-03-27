import {game, PokerGame, State} from './poker';

let canvas;
let ctx;

function draw_text(text, x, y) {
    if (x === undefined) x = canvas.width/2;
    if (y === undefined) y = canvas.height/2;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function draw_loop() {
    canvas = document.getElementById("canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    while(true) {
        await sleep(50);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch(game.state) {
            case State.LOBBY:
                draw_text('Waiting in lobby for other player. Calculating prime...');
                break;
            case State.TABLE:
                draw_text('Other player found. Preparing game...');
                break;
            case State.SETUPDONE:
                draw_text('Shared prime negotiated! Setup is done. Shuffling cards now...');
                break;
            case State.AWAITINGDECK:
                draw_text('Shuffling the cards...');
                break;
            case State.AWAITINGHAND:
                draw_text('Deck negotiated. Drawing cards..');
                break;
            case State.BET0:
                draw_text('Player 1\'s turn');
                break;
            case State.BET1:
                draw_text('Player 2\'s turn');
                break;
        }
        if (game.hand.length !== 0) {
            draw_text(`Your hand: ${game.get_card_value(game.hand[0])}, ${game.get_card_value(game.hand[1])}`,
                canvas.width/2, canvas.height/1.5);
        }
    }
}
