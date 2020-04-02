const serverUri = "wss://home.marcolorenzo.com:3024";
//const serverUri = "wss://127.0.0.1:3024";

let netIO = new NetIO(serverUri);
netIO.waitForConnection(function () { netIO.send('{"t":"r"}'); })

let app = new PIXI.Application(
    {
        backgroundColor: 0x1099bb,
        autoResize: true
    });

let id = Date.now();

document.body.appendChild(app.view);

// create a new Sprite from an image path
let goomba = PIXI.Sprite.from('assets/png/goomba.png');

// center the sprite's anchor point
goomba.anchor.set(0.5);

// move the sprite to the center of the screen
goomba.x = app.screen.width / 2;
goomba.y = app.screen.height / 2;

app.stage.addChild(goomba);

app.ticker.add((d) => {
    let delta = app.ticker.deltaMS * 0.001;

    goomba.rotation += 3.14 * delta;

    if (pkeys[37] || pkeys[38] || pkeys[39] || pkeys[40])
    {
        const speed = 200;

        if (pkeys[37]) // left
            goomba.x -= speed * delta;
        if (pkeys[38]) // up
            goomba.y -= speed * delta;
        if (pkeys[39]) // right
            goomba.x += speed * delta;
        if (pkeys[40]) // down
            goomba.y += speed * delta;

        netIO.send(JSON.stringify({id:id, x:goomba.x, y:goomba.y}));
    }
});

window.addEventListener('resize', resize);

// Resize function window
function resize() {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    goomba.x = app.screen.width / 2;
    goomba.y = app.screen.height / 2;
}

let objs = [];

function onData(jsonData) {
    const obj = JSON.parse(jsonData);

    if (obj.id == null)
        return;

    let found = false;
    for (let i = 0; i < objs.length; i++)
    {
        if (objs[i].id === obj.id)
        {
            objs[i].sprite.x = obj.x;
            objs[i].sprite.y = obj.y;
            found = true;
        }
    }

    if (!found)
    {
        let newObj =
        {
            id: obj.id,
            sprite: PIXI.Sprite.from('assets/png/goomba.png')
        }

        newObj.sprite.x = obj.x;
        newObj.sprite.y = obj.y;

        objs.push(newObj);
        app.stage.addChild(newObj.sprite);
    }
}

var pkeys=[];
window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    pkeys[code]=true;

}
window.onkeyup = function (e) {
  var code = e.keyCode ? e.keyCode : e.which;
  pkeys[code]=false;
};

resize();

netIO.onData = function (d) { onData(d); }
netIO.waitForConnection(function () { netIO.send(JSON.stringify({id:id, x:goomba.x, y:goomba.y})); })
