maxActionsToProgram = 5;
var controlsPad = {up:12, down:13, left:14, right:15, attackup:3, attackdown:0, attackleft:2, attackright:1};

LEFT = "left";
RIGHT = "right";
UP = "up";
DOWN = "down";
ATTACKLEFT = "attackleft";
ATTACKRIGHT = "attackright";
ATTACKUP = "attackup";
ATTACKDOWN = "attackdown";

function Player(bitmap, position, controls, gamepadId)
{
	var speed = 3;

	this.internalBitmap = bitmap;
	stage.addChild(bitmap);

	this.gamepadId = gamepadId;

	this.gridPosition = position;

	this.aliveState = "alive";

	this.internalBitmap.x = gridInitX + position.x*blockSize;
	this.internalBitmap.y = gridInitY + position.y*blockSize;

	this.programmedActions = [];
	this.animDone = true;


	this.controls = controls;

	this.attackBitmap = new createjs.Bitmap(imgFireball);
	this.attackBitmap.x = -gridInitX;
	this.attackBitmap.y = -gridInitY;
	stage.addChild(this.attackBitmap);

	//called at each tick of animation phase
	this.updatePlayPhase = function()
	{
		if(!this.animDone)
		{
			var target = {x:gridInitX + this.gridPosition.x*blockSize, y:gridInitY + this.gridPosition.y*blockSize};

			this.internalBitmap.x += Math.max(Math.min(target.x - this.internalBitmap.x, speed), -speed);
			this.internalBitmap.y += Math.max(Math.min(target.y - this.internalBitmap.y, speed), -speed);

			if(this.internalBitmap.x == target.x && this.internalBitmap.y == target.y)
			{
				this.animDone = true;
				this.internalBitmap.gotoAndPlay("idle" + (this.internalBitmap.currentAnimation))
			}

			var dx = target.x - this.internalBitmap.x < 0 ? 1 : 0;
			var dy = target.y - this.internalBitmap.y < 0 ? 1 : 0;
			var redrawJustBefore = texturesPerBlock[this.gridPosition.y + dy][this.gridPosition.x + dx];
			stage.removeChild(this.internalBitmap);
			var index = stage.getChildIndex(redrawJustBefore);
			stage.addChildAt(this.internalBitmap, index+1);
		}
	}

	this.prevState = [];
	this.gamePadState = [];
	this.prevGamePadState = [];

	//	called at each tick of program Phase
	this.updateProgramPhase = function()
	{
		this.gamePadState = [];
		if(gamepads[this.gamepadId])
		{
			var pad = gamepads[this.gamepadId];
			this.gamePadState[this.controls.left] = pad.buttons[controlsPad.left].value == 1
				|| pad.axes[0] < -0.5;
			this.gamePadState[this.controls.right] = pad.buttons[controlsPad.right].value == 1
				|| pad.axes[0] > 0.5;
			this.gamePadState[this.controls.up] = pad.buttons[controlsPad.up].value == 1
				|| pad.axes[1] < -0.5;
			this.gamePadState[this.controls.down] = pad.buttons[controlsPad.down].value == 1
				|| pad.axes[1] > 0.5;
			this.gamePadState[this.controls.attackleft] |= gamepads[this.gamepadId].buttons[controlsPad.attackleft].value == 1;
			this.gamePadState[this.controls.attackright] |= gamepads[this.gamepadId].buttons[controlsPad.attackright].value == 1;
			this.gamePadState[this.controls.attackup] |= gamepads[this.gamepadId].buttons[controlsPad.attackup].value == 1;
			this.gamePadState[this.controls.attackdown] |= gamepads[this.gamepadId].buttons[controlsPad.attackdown].value == 1;
		}

		if (this.programmedActions.length < maxActionsToProgram)
		{
			this.CheckOneAction(this.controls.left, LEFT);
			this.CheckOneAction(this.controls.right, RIGHT);
			this.CheckOneAction(this.controls.up, UP);
			this.CheckOneAction(this.controls.down, DOWN);
			this.CheckOneAction(this.controls.attackleft, ATTACKLEFT);
			this.CheckOneAction(this.controls.attackright, ATTACKRIGHT);
			this.CheckOneAction(this.controls.attackup, ATTACKUP);
			this.CheckOneAction(this.controls.attackdown, ATTACKDOWN);
		}
	}

	this.CheckOneAction = function(source, outcome)
	{
		if((!this.prevState[source] && isKeyPressed[source]) || (!this.prevGamePadState[source] && this.gamePadState[source]))
		{
			this.programmedActions.push(outcome);
			createjs.Sound.play(commandSetSound);
		}
		this.prevState[source] = isKeyPressed[source];
		this.prevGamePadState[source] = this.gamePadState[source];
	}
}
