var preloadCount = 0;
var preloadTotal = 3;

var stage;
var imgPlayer1 = new Image();
var imgObstacle = new Image();
var imgGround = new Image();

var player1;

var isKeyPressed = [];

var FPS = 5;
var frameBeforeAction = FPS * 5;
var elapsedFrames = 0;
var gameState = "programActions";


function startGame()
{
	stage = new createjs.Stage(document.getElementById("gameCanvas"));
	var text = new createjs.Text("Loading...");
	text.x = 600; text.y = 350;
	text.textAlign = "center"; text.textBaseline = "middle";
	stage.addChild(text);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	imgPlayer1.onload = preloadUpdate();
	imgPlayer1.src = "media/pacman.png";
	
	imgObstacle.onload = preloadUpdate();
	imgObstacle.src = "media/obstacle.png";

	imgGround.onload = preloadUpdate();
	imgGround.src = "media/ground.png";
}

function preloadUpdate()
{
	preloadCount++;
	if(preloadCount == preloadTotal)
		launchGame();
}

function launchGame()
{
	var sprites = [];
	sprites['X'] = imgObstacle;
	sprites['.'] = imgGround;
	board = new Board(sprites);
	board.Load();
	
	var bitmapPlayer1 = new createjs.Bitmap(imgPlayer1); // will become a sprite
	player1 = new Player(bitmapPlayer1);
	stage.addChild(player1.internalBitmap);
	
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update);


	//manage keyboard state
	document.onkeydown = function(e){
	    var key = code(e);
	    isKeyPressed[key] = true;
	};
	document.onkeyup = function(e){
	    var key = code(e);
	    isKeyPressed[key] = false;
	};
}

function code(e)
{
	e = e || window.event;
	return(e.keyCode || e.which);
}

function update(event)
{
	if (gameState == "programActions")
	{
		elapsedFrames++;
		console.log(elapsedFrames);
		player1.updateProgramPhase();


		if (elapsedFrames >= frameBeforeAction)
		{
			elapsedFrames = 0;
			gameState = "playActions";
		}

	}
	else
	{
		// Update players
		player1.updatePlayPhase();
	}
	// Update main scene
	stage.update();
}
