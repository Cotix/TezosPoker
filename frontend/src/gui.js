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

    // var imageObj = new Image();
    // imageObj.src = '/static/images/Diamond 2.png';

    var imageObjA = new Image();
    var imageObjB = new Image();

    while(true) {
        await sleep(50);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch(game.state) {
            case State.LOBBY:
                draw_text('Waiting in lobby for other player. Calculating prime...');
                // ctx.drawImage(imageObj, 0, 0, 200, 400);
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

            imageObjA.src = '/static/images/' + game.get_card_value(game.hand[0]) + '.png';
            imageObjB.src = '/static/images/' + game.get_card_value(game.hand[1]) + '.png';
            ctx.drawImage(imageObjA, canvas.width / 2 - 100, canvas.height-200, 130, 200);
            ctx.drawImage(imageObjB, canvas.width / 2 + 100, canvas.height-200, 130, 200);
        }
        if (game.river.length !== 0) {
            let river = game.river.map(x => game.get_card_value(x));
            draw_text(`River: ${river.join(', ')}`,
                canvas.width/2, canvas.height/1.75);
        }

    }
}
