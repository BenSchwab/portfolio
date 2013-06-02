function changeHeaderText(nT){
	$('.header_text_sub').text(nT);
}
function hideRandomGenerator(){
	$('#rg').hide();
	$('#rand_gen').hide();
}
function showRandomGenerator(){
	$('#rg').show();
	$('#randGen').show();
}

function hideLeftToolBar(){
	var tool = $('#left_toolbar');
	tool.fadeOut(500);

}
function showLeftToolBar(){
	var tool = $('#left_toolbar');
	tool.children().hide();
	tool.fadeIn(500, function(){
		tool.children().show();
		tool.children().addClass("animated bounceIn");
	});


}
function showRightToolBar(){
	var tool = $('#right_toolbar');
	tool.children().hide();
	tool.fadeIn(500, function(){
		tool.children().show();
		tool.children().addClass("animated bounceIn");
	});
}
function hideRightToolBar(){
	var tool = $('#right_toolbar');
	tool.fadeOut(500);
}
function hideSticky(){
	var todo = $('#todo_list');
	todo.children().fadeOut(300);
	todo.fadeOut(300);

}
function showSticky(){
	var todo = $('#todo_list');
	todo.fadeIn(100);
	todo.addClass('animated fadeInDown');
	var classType = '.todo_' + moduleIndex;
	$('#todo_head').fadeIn(500);
	todo.children(classType).fadeIn(1000);
}

function showMainBoard(){
	var cont = $('#active_holder');
	cont.fadeIn(300);
	cont.addClass('animated fadeInUp');
}
function hideMainBoard(){
	var cont = $('#active_holder');
	cont.fadeOut(300);
}
hideMainBoard();
hideRightToolBar();
hideLeftToolBar();
var activeModule;
var previewGame;
var gliderModel;
var ssModel;
var pentModel;
var randomArray = new Array();
//loadModuleOne();

var modules = new Array();
var moduleIndex =0;
modules[0] = loadModuleOne;
modules[1] = loadModuleTwo;
modules[2] = loadModuleThree;
modules[3] = loadModuleFour;
modules[4] = loadSandbox;



//Model - just contains the data
function GameOfLifeModel(xCells, yCells){

	//alert("The model"+ xCells+" thinks it has a sw of"+this.squareWidth);
	this.xCells = xCells;
	this.yCells = yCells;
	this.grid = [];
	this.gridTwo = [];
	this.activeGrid = this.grid;
	this.inactiveGrid = this.gridTwo;
	//iniatlize the model
	for (var i = 0; i < xCells; i++) {
		this.grid[i] = [];
		this.gridTwo[i] = [];
		for (var j = 0; j < yCells; j++) {
				var tarSquare = new Square(i, j,1,1);//create a view adapter that changes based on zoom
				this.grid[i][j] = new Cell(tarSquare, false, new Color(20,80,140,1));
				this.gridTwo[i][j] = new Cell(tarSquare, false, new Color(20,80,140,1));
			}
		}

		this.clearGrid = function(){
			for (var i = 0; i < xCells; i++) {
				for (var j = 0; j < yCells; j++) {
					this.inactiveGrid[i][j].alive = false;
					this.activeGrid[i][j].alive = false;
					this.inactiveGrid[i][j].randomGenerator = false;
					this.activeGrid[i][j].randomGenerator = false;
				}
			}
		}


		this.setPreviewRand = function(xCell,yCell,isPrev){

			if(xCell>=this.xCells){
				xCell-=this.xCells;
			}
			if(yCell>=this.xCells){
				yCell-=this.yCells;
			}
			if(xCell<0){
				xCell+=this.xCells;
			}
			if(yCell<0){
				yCell+=this.yCells;
			}

			this.activeGrid[xCell][yCell].randomGeneratorPrev = isPrev;
			this.inactiveGrid[xCell][yCell].randomGeneratorPrev = isPrev;

		}

		this.setPreview = function(xCell,yCell,isPrev){

			if(xCell>=this.xCells){
				xCell-=this.xCells;
			}
			if(yCell>=this.xCells){
				yCell-=this.yCells;
			}
			if(xCell<0){
				xCell+=this.xCells;
			}
			if(yCell<0){
				yCell+=this.yCells;
			}

			this.activeGrid[xCell][yCell].preview = isPrev;
			this.inactiveGrid[xCell][yCell].preview = isPrev;

		}

		this.clearPreview = function(){
			for (var i = 0; i < this.xCells; i++){
				for (var j = 0; j < this.yCells; j++){
					this.activeGrid[i][j].preview = false;
					this.inactiveGrid[i][j].preview = false;
					this.activeGrid[i][j].randomGeneratorPrev = false;
					this.inactiveGrid[i][j].randomGeneratorPrev = false;
				}
			}
		}

		this.setActive = function(xCell,yCell,color){
		//alert(xCell +" "+yCell);
		var tarCell = this.activeGrid[xCell][yCell];
		var secCell = this.inactiveGrid[xCell][yCell];
		if(color!=undefined){
			tarCell.setColor(color);
			secCell.setColor(color);
		}
		tarCell.alive = true;
	};

	this.getActiveGrid = function(){
		return this.activeGrid;
	};

	this.birthCell = function (cache,x,y) {
		this.inactiveGrid[x][y].alive = true;
		var newColor = calculateCellColor(cache[0],cache[1],cache[2]);
		this.inactiveGrid[x][y].setColor(newColor);

	};


	this.updateGrid = function(){
		for (var i = 0; i < this.xCells; i++){
			for (var j = 0; j < this.yCells; j++){
				//check all neighbor cells
				var neighbors = 0;
				var neighborCache = new Array();
				var ind = 0;
				for(var xC = -1; xC<=1; xC++){
					for(var yC = -1; yC<=1; yC++){
						if(xC==0&&yC==0){
							continue;

						}
						var x = xC+i;
						var y = yC+j;

						if(x>=this.xCells){
							x-=this.xCells;
						}
						if(y>=this.xCells){
							y-=this.yCells;
						}
						if(x<0){
							x+=this.xCells;
						}
						if(y<0){
							y+=this.yCells;
						}
						if(this.activeGrid[x][y].alive){
							neighbors++;
							neighborCache[ind] = this.activeGrid[x][y];
							ind++;
						}
					}
				}
				this.inactiveGrid[i][j].alive = this.activeGrid[i][j].alive;
				if(neighbors<2||neighbors>3){
					this.inactiveGrid[i][j].alive = false;
				}
				else if(neighbors==3){
					this.birthCell(neighborCache, i,j);
				}
				else{
					this.inactiveGrid[i][j].setColor(this.activeGrid[i][j].getColor());
				}
				if(this.activeGrid[i][j].randomGenerator){
					this.generateRandomLife(i,j);
				}


			}
		}
		var temp;
		temp = this.activeGrid;
		this.activeGrid = this.inactiveGrid;
		this.inactiveGrid = temp;
	};

	this.generateRandomLife = function(x,y){
		if(Math.random()<.01){
			var rind = Math.floor(3*Math.random());

			var mod = randomArray[rind];
			var mx =1;
			var my =1;
			if(Math.random()>.5){
				mx = -1;
			}
			if(Math.random()>.5){
				my = -1;
			}

			for (var i = 0; i < mod.xCells; i++){
				for (var j = 0; j < mod.yCells; j++){
					if(mod.activeGrid[i][j].alive){
						var spawnX;
						var spawnY;

						spawnX = (i*mx)+x;
						spawnY = (j*my)+y;

						if(spawnX>=this.xCells){
							spawnX-=this.xCells;
						}
						if(spawnY>=this.xCells){
							spawnY-=this.yCells;
						}
						if(spawnX<0){
							spawnX+=this.xCells;
						}
						if(spawnY<0){
							spawnY+=this.yCells;
						}

						this.inactiveGrid[spawnX][spawnY].alive = true;
						this.activeGrid[spawnX][spawnY].alive = true;
						this.inactiveGrid[spawnX][spawnY].setColor(this.activeGrid[x][y].color);
						this.activeGrid[spawnX][spawnY].setColor(this.activeGrid[x][y].color);


					}

				}
			}

		}
	}


}

//viewer - owns a model and some stats on how to visualize it
function GameOfLifeViewer(jQueryElem, model, interactive){
	if(jQueryElem==undefined){
		alert("The Elem is Undefined!");
	}
	this.jQueryElem = jQueryElem;
	this.model = model;
	this.canvas = jQueryElem[0];
	var off = jQueryElem.offset();
	this.offsetLeft =0;
	this.offsetRight = 0;
	if(off!==undefined){
		this.offsetLeft = jQueryElem.offset().left;
		this.offsetTop = jQueryElem.offset().top;
	}
	this.ctx = this.canvas.getContext("2d");
	this.interactive = interactive;
	this.clicked = false;
	this.viewer = new GridViewer(new Square(0,0,this.canvas.width, this.canvas.height),1);
	this.panRight = false;
	this.panLeft = false;
	this.panDown = false;
	this.panUp = false;
	this.squareWidth =  Math.floor(this.canvas.width/(model.yCells));
	this.squareHeight = Math.floor(this.canvas.height/(model.xCells));

	this.updateMargins = function(){
		var off = this.jQueryElem.offset();
		this.offsetLeft =0;
		this.offsetRight = 0;
		if(off!==undefined){
			this.offsetLeft = jQueryElem.offset().left;
			this.offsetTop = jQueryElem.offset().top;
		}
	}

	this.setInteractive = function(isInteractive){
		this.interactive = interactive;
	};

	this.getPosition = function(event){
		var x = event.pageX -this.offsetLeft;
		var y = event.pageY- this.offsetTop;
	 // alert(x+" "+y);
	 this.activateClickedCell(x,y);

	};


	this.getDragPosition = function(x,y){
		this.activateClickedCell(x-this.offsetLeft,y-this.offsetTop);
	};

	this.activatePreview = function(){
		var grid = this.model.getActiveGrid();
		var offGrid = this.model.inactiveGrid;
		var xCells = this.model.xCells;
		var yCells = this.model.yCells;
		for (var i = 0, l = xCells; i < l; i++) {
			for (var j = 0, l2 = yCells; j < l2; j++) {
				if(grid[i][j].preview){
					grid[i][j].alive = true;
					grid[i][j].setColor(theColor);
				}
				if(grid[i][j].randomGeneratorPrev){
					grid[i][j].randomGenerator = true;
					grid[i][j].setColor(theColor);
					offGrid[i][j].randomGenerator = true;
					offGrid[i][j].setColor(theColor);
				}
			}
		}
	}

	this.activateClickedCell = function(x,y){
		//alert(this.model.squareWidth);
		xIndex = Math.floor((x+ this.viewer.bounds.x)/(this.squareWidth*this.viewer.zoom));
		yIndex = Math.floor((y+ this.viewer.bounds.y)/(this.squareHeight*this.viewer.zoom));
		//alert("activating" +xIndex +" "+yIndex);
		model.setActive(xIndex,yIndex, theColor);
	};

	this.getCellIndex = function(x,y){
		var ind = new Array();
		ind[0] = Math.floor((x+ this.viewer.bounds.x)/(this.squareWidth*this.viewer.zoom));
		ind[1] = Math.floor((y+ this.viewer.bounds.y)/(this.squareHeight*this.viewer.zoom));
		return ind;
	}

	this.zoom = function(){
		this.viewer.zoom = this.viewer.zoom+.1;
		this.viewer.bounds.x += this.canvas.width*.1/2;
		this.viewer.bounds.y += this.canvas.height*.1/2;
	};

	this.unzoom = function(){
		if(this.viewer.zoom>=1.1){
			this.viewer.zoom = this.viewer.zoom-.1;
			this.viewer.bounds.x -= this.canvas.width*.1/2;
			this.viewer.bounds.y -= this.canvas.height*.1/2;
		}
	};

	this.setPanRight = function(isActive){
		this.panRight = isActive;
	};
	this.setPanLeft =  function(isActive){
		this.panLeft = isActive;
	};
	this.setPanUp = function(isActive){
		this.panUp = isActive;
	};
	this.setPanDown = function(isActive){
		this.panDown = isActive;
	};

	this.transformBounds = function(bounds){
		var transformedBounds = new Square(bounds.x*this.viewer.zoom - this.viewer.bounds.x , bounds.y*this.viewer.zoom - this.viewer.bounds.y ,
			bounds.width*this.viewer.zoom , bounds.height*this.viewer.zoom);
		return transformedBounds;
	};

	this.paintGridCell = function(bounds){
		bounds = this.transformBounds(bounds);
		this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
	};
	this.paintCircle = function(bounds){
		//alert("painting cirlce");
		bounds = this.transformBounds(bounds);
		this.ctx.beginPath();
		this.ctx.arc(bounds.x, bounds.y, bounds.width/2, 0 , 2 * Math.PI, false);
		this.ctx.closePath();
		this.ctx.fill();
	};

	this.render = function() {
		//alert("rendering "+this.model.xCells);
		this.ctx.fillStyle = '#000000';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		var grid = this.model.getActiveGrid();
		var xCells = this.model.xCells;
		var yCells = this.model.yCells;
		//alert(xCells+" "+yCells);

		for (var i = 0, l = xCells; i < l; i++) {
			for (var j = 0, l2 = yCells; j < l2; j++) {
				var cell = grid[i][j];
		         //alert("cell is not alive");
		         if(cell.alive||cell.preview||cell.randomGenerator||cell.randomGeneratorPrev){
		       		//alert("cell is alive");
		       		var bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       		if(cell.preview){
		       			this.ctx.fillStyle = 'rgba(255,255,255,.7)';
		       			bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       			this.paintGridCell(bounds);
		       		}
		       		if(cell.alive){
		       			this.ctx.fillStyle = generateColorString(cell.color);
		       			this.paintGridCell(bounds);

		       		}
		       		if(cell.randomGenerator){
		       			this.ctx.fillStyle = generateColorString(cell.color);
		       			bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       			this.paintCircle(bounds);
		       		}
		       		if(cell.randomGeneratorPrev){
		       			//alert("painting preview");
		       			this.ctx.fillStyle = 'rgba(255,255,255,.7)';
		       			bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       			this.paintCircle(bounds);
		       		}


		       	}
		       }
		   }
		};

		this.managePan = function(){
			var movement = Math.floor((this.viewer.zoom-1)*3);
			if(this.panRight){
				this.viewer.bounds.x = this.viewer.bounds.x +movement;

			}
			if(this.panLeft){
				this.viewer.bounds.x = this.viewer.bounds.x-movement;

			}
			if(this.panUp){
				this.viewer.bounds.y = this.viewer.bounds.y-movement;


			}
			if(this.panDown){
				this.viewer.bounds.y = this.viewer.bounds.y +movement;

			}

			if(this.viewer.bounds.x>(this.viewer.zoom-1)*this.viewer.bounds.width){
				this.viewer.bounds.x=(this.viewer.zoom-1)*this.viewer.bounds.width;
			}
			if(this.viewer.bounds.x<0){
				this.viewer.bounds.x = 0;
			}
			if(this.viewer.bounds.y>(this.viewer.zoom-1)*this.viewer.bounds.height){
				this.viewer.bounds.y=(this.viewer.zoom-1)*this.viewer.bounds.height;
			}
			if(this.viewer.bounds.y<0){
				this.viewer.bounds.y = 0;
			}

		};

	}

	function GameOfLife(model, viewer){
		this.model = model;
		this.viewer = viewer;
		this.autoUpdate = false;

		this.updateAndRender = function(){
			this.model.updateGrid();
			this.viewer.render();
		};
		this.render = function(){
			if(this.viewer.interactive){
			//alert("managing Pan");
			this.viewer.managePan();
		}
		this.viewer.render();
	};
	this.updateGrid = function(){
		this.model.updateGrid();
	};
}

function generateCellBounds(x,y,width, height){
	return new Square(x*width, y*height, width, height);
}

function calculateCellColor(cellOne, cellTwo,cellThree){
	var colorOne = cellOne.getColor();
	var colorTwo = cellTwo.getColor();
	var colorThree = cellThree.getColor();
	var mixColor = new Color( Math.floor( (colorOne.red+colorTwo.red+colorThree.red)/3 ), Math.floor( (colorOne.green+colorTwo.green+colorThree.green)/3 ),
		Math.floor( (colorOne.blue+colorTwo.blue+colorThree.blue)/3 ), Math.floor( (colorOne.alpha+colorTwo.alpha+colorThree.alpha)/3 ) ) ;
	//alert( " "+(colorOne.red+colorTwo.red+colorThree.red)/3 +" " +(colorOne.green+colorTwo.green+colorThree.green)/3 +" "+
		//(colorOne.blue+colorTwo.blue+colorThree.blue)/3 +" " +(colorOne.alpha+colorTwo.alpha+colorThree.alpha)/3);
return mixColor;
}

function updateMargin(){
	activeModule.viewer.updateMargins();
}

function loadCurModule(){
	modules[moduleIndex]();
}

function loadModuleOne(){
	var canvasElem = $('#my_canvas');
	var moduleOneGrid = new GameOfLifeModel(100,100);
	var tVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	var moduleGame = new GameOfLife(moduleOneGrid,tVisualizer);
	activeModule = moduleGame;
	preparePreview();
	showLeftToolBar();
	showMainBoard();
	showSticky();
	updateMargin();
	var nT = "1: Three Simple Rules";
	changeHeaderText(nT);
	hideRandomGenerator();
}


function loadModuleTwo(){
	var canvasElem = $('#my_canvas');
	var moduleOneGrid = new GameOfLifeModel(100,100);
	var tVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	var moduleGame = new GameOfLife(moduleOneGrid,tVisualizer);
	activeModule = moduleGame;
	preparePreview();
	showLeftToolBar();
	showRightToolBar();
	showMainBoard();
	showSticky();
	updateMargin();
	var nT = "2: It's all in the seed";
	changeHeaderText(nT);
	hideRandomGenerator();

}
function loadModuleThree(){
	var canvasElem = $('#my_canvas');
	var moduleOneGrid = new GameOfLifeModel(100,100);
	var tVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	var moduleGame = new GameOfLife(moduleOneGrid,tVisualizer);
	activeModule = moduleGame;
	preparePreview();
	showLeftToolBar();
	showRightToolBar();
	showMainBoard();
	showSticky();
	updateMargin();
	var nT = "3: A Quantum Leap";
	changeHeaderText(nT);
	showRandomGenerator();
}
function loadModuleFour(){
	var canvasElem = $('#my_canvas');
	var moduleOneGrid = new GameOfLifeModel(500,500);
	var tVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
	tVisualizer.zoom();
	tVisualizer.zoom();
	var moduleGame = new GameOfLife(moduleOneGrid,tVisualizer);
	activeModule = moduleGame;
	preparePreview();
	showLeftToolBar();
	showRightToolBar();
	showMainBoard();
	showSticky();
	updateMargin();
	var nT = "4: A Step Back";
	changeHeaderText(nT);
	showRandomGenerator();
}
function loadSandbox(){
	var canvasElem = $('#my_canvas');
	var moduleOneGrid = new GameOfLifeModel(250,250);
	var tVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	tVisualizer.zoom();
	var moduleGame = new GameOfLife(moduleOneGrid,tVisualizer);
	activeModule = moduleGame;
	preparePreview();
	showLeftToolBar();
	showRightToolBar();
	showMainBoard();
	showSticky();
	updateMargin();
	var nT = "Sandbox";
	changeHeaderText(nT);
	showRandomGenerator();
}




function preparePreview(){
	var sCanvas = document.getElementById("sim_canvas");
	var jQueryElem = $('#sim_canvas');
	var visualizer = new GameOfLifeViewer(jQueryElem,activeModule.model,false);
	previewGame = new GameOfLife(activeModule.model,visualizer);
}
//gameOne.updateAndRender();
//gameOne.updateAndRender();
//visualizer.zoom();
//visualizer.render();
//alert(test.grid[3][5].alive);




var offsetLeft = $('#my_canvas').offset().left;
var offsetTop = $('#my_canvas').offset().top;

//game speed and controll
var updateCounterMax = 10;
var updateCounter = updateCounterMax;
var autoUpdate = false;
var fpsMultiplier = 1.0;
var fps = 40;
var clicked = false;
var containsShape = false;



function renderPreview(module,e){
	var cells = module.viewer.getCellIndex(e.pageX-module.viewer.offsetLeft, e.pageY-module.viewer.offsetTop);
	var xCell = cells[0];
	var yCell = cells[1];
	var mod = shapeHandler.getModel();
	var tarMod = module.model;
	tarMod.clearPreview();
	for (var i = 0; i < mod.xCells; i++){
		for (var j = 0; j < mod.yCells; j++){
			if(mod.getActiveGrid()[i][j].alive){
				tarMod.setPreview(xCell+i-10,yCell+j-10,true);
			}
			if(mod.getActiveGrid()[i][j].randomGenerator){
				//alert("setPreviewRand");
				tarMod.setPreviewRand(xCell+i-10,yCell+j-10,true);
			}
		}
	}

}



$('#my_canvas').mousemove(function(e){

	if(activeModule==null){

		return;
	}

	if(shapeHandler.isActive()){
		renderPreview(activeModule, e);
	}
	else if(clicked){
		activeModule.viewer.getDragPosition(e.pageX, e.pageY);
	}
});
$('#my_canvas').mousedown(function(e){
	e.preventDefault();
	clicked = true;
});
$('#my_canvas').mouseup(function(e){
	clicked = false;
});
$('#my_canvas').click(function(e){

	if(activeModule==null){
		alert('Active Module is not set.')
		return;
	}

	if(shapeHandler.isActive()){
		activeModule.viewer.activatePreview();
	}
	else{
		activeModule.viewer.getPosition(e);
	}

});


var theColor = new Color(200,260,20,1);

var shapeHandler = new ShapeHandler();
function ShapeHandler(){
	this.active = false;

	this.setActive = function(isActive){
		this.active = isActive;
	};
	this.setModel = function(model){
		this.model = model;
	};
	this.toggleActive = function(){
		this.active = !this.active;
	};
	this.isActive = function(){
		return this.active;
	};
	this.getModel = function(){
		return this.model;
	};

}

function mouseoverHandler(tarElem, el, content, maintain, game,freeze){


	tarElem.mouseenter(function() {

		tarElem.click(function(){
			if(game!=undefined){
			shapeHandler.setModel(game.model);
			shapeHandler.toggleActive();
			//alert(shapeHandler.isActive());
			if(shapeHandler.isActive()){
				$('.button_div').removeClass('clicked');
				tarElem.addClass('clicked');
			}
			else{
				tarElem.removeClass('clicked');
				activeModule.model.clearPreview();

			}
		}
		});
		//alert("triggering addin");
		var handler;
		var timeoutId = setTimeout(function() {
			if(game!=undefined){
				game.render();
				if(freeze!==undefined&&freeze){

				}
				else{
					handler = startAutoThread(game,3);
				}
			}
			content.hide();
			content.appendTo(el);

			content.fadeIn(500);
			el.show();
		}, 300);

		tarElem.mouseleave(function() {
			clearTimeout(timeoutId);
			if(handler!=null){
				clearInterval(handler);
			}
			content.fadeOut(100,function(){

				if(maintain){
					content.remove();
				}
				else{
					content.hide();
				}
				el.hide();
			});




		});
	});



}
var preview_thread = null;

function startAutoThread(game,fps){
	if(preview_thread!=null){
		clearInterval(preview_thread);
	}
	return preview_thread = setInterval(function(){autoUpdateGame(game)}, 1000/fps);
}

function autoUpdateGame(game){
	game.updateAndRender();
}


$(document).ready(function(){

	var cw = Raphael.colorwheel($("#color_wheel"), 60);
	cw.color('#FF9950');

	cw.onchange(function(color){
		theColor = new Color(parseInt(color.r), parseInt(color.g), parseInt(color.b));
	});


	mouseoverHandler( $("#start_button"), $('#pop_up'), $('<img class = "pop_image" width="90" height="60" src="../static/images/game_of_life/space.png"/>'), false);
	mouseoverHandler( $("#stop_button"), $('#pop_up'), $('<img class = "pop_image" width="90" height="60" src="../static/images/game_of_life/space.png"/>'), false);
	mouseoverHandler( $("#zoom_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/plus_equal.png"/>'), false);
	mouseoverHandler( $("#unzoom_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/minus.png"/>'), false);
	mouseoverHandler( $("#update_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/n_key.png"/>'), false);
	mouseoverHandler( $("#slow_down_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/sskey.png"/>'), false);
	mouseoverHandler( $("#speed_up_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/ffkey.png"/>'), false);

	mouseoverHandler( $("#pan_right"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/arrow_right.png"/>'), false);
	mouseoverHandler( $("#pan_left"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/arrow_left.png"/>'), false);
	mouseoverHandler( $("#pan_up"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/arrow_up.png"/>'), false);
	mouseoverHandler( $("#pan_down"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/arrow_down.png"/>'), false);
	mouseoverHandler( $("#clear_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../static/images/game_of_life/c_key.png"/>'), false);

	createPreviews();
	setKeyBindings();
});

function createPreviews(){
	var jQueryElem = $('#preview_canvas');
	//alert(jQueryElem);
	var test2 = new GameOfLifeModel(20,20);
	test2.grid[4][5].alive = true;
	test2.grid[5][5].alive = true;
	test2.grid[6][5].alive = true;
	test2.grid[6][4].alive = true;
	test2.grid[5][3].alive = true;
	var visualizer = new GameOfLifeViewer(jQueryElem,test2,false);
	var popup = new GameOfLife(test2,visualizer);
	mouseoverHandler($('#space_ship'),$('#pop_up_right'),$('#preview_canvas'), true, popup);
	randomArray[0] = test2;


	var test3 = new GameOfLifeModel(20,20);
	test3.grid[10][5].alive = true;
	test3.grid[10][6].alive = true;
	test3.grid[11][6].alive = true;
	test3.grid[11][7].alive = true;
	test3.grid[11][4].alive = true;
	test3.grid[11][3].alive = true;
	test3.grid[12][3].alive = true;
	test3.grid[12][4].alive = true;
	test3.grid[12][5].alive = true;
	test3.grid[12][6].alive = true;
	test3.grid[13][4].alive = true;
	test3.grid[13][5].alive = true;
	var visualizerTwo = new GameOfLifeViewer(jQueryElem,test3,false);
	var popup2 = new GameOfLife(test3,visualizerTwo);
	randomArray[1] = test3;
	//redo
	var test4 = new GameOfLifeModel(20,20);
	test4.grid[3][5].alive = true;
	test4.grid[3][6].alive = true;
	test4.grid[3][12].alive = true;
	test4.grid[3][13].alive = true;

	test4.grid[4][6].alive = true;
	test4.grid[4][7].alive = true;
	test4.grid[4][11].alive = true;
	test4.grid[4][12].alive = true;

	test4.grid[5][3].alive = true;
	test4.grid[5][6].alive = true;
	test4.grid[5][8].alive = true;
	test4.grid[5][10].alive = true;
	test4.grid[5][12].alive = true;
	test4.grid[5][15].alive = true;

	test4.grid[6][3].alive = true;
	test4.grid[6][4].alive = true;
	test4.grid[6][5].alive = true;
	test4.grid[6][7].alive = true;
	test4.grid[6][8].alive = true;
	test4.grid[6][10].alive = true;
	test4.grid[6][11].alive = true;
	test4.grid[6][13].alive = true;
	test4.grid[6][14].alive = true;
	test4.grid[6][15].alive = true;

	test4.grid[7][4].alive = true;
	test4.grid[7][6].alive = true;
	test4.grid[7][8].alive = true;
	test4.grid[7][10].alive = true;
	test4.grid[7][12].alive = true;
	test4.grid[7][14].alive = true;

	test4.grid[8][5].alive = true;
	test4.grid[8][6].alive = true;
	test4.grid[8][7].alive = true;
	test4.grid[8][11].alive = true;
	test4.grid[8][12].alive = true;
	test4.grid[8][13].alive = true;

	test4.grid[10][5].alive = true;
	test4.grid[10][6].alive = true;
	test4.grid[10][7].alive = true;
	test4.grid[10][11].alive = true;
	test4.grid[10][12].alive = true;
	test4.grid[10][13].alive = true;

	test4.grid[11][4].alive = true;
	test4.grid[11][6].alive = true;
	test4.grid[11][8].alive = true;
	test4.grid[11][10].alive = true;
	test4.grid[11][12].alive = true;
	test4.grid[11][14].alive = true;

	test4.grid[12][3].alive = true;
	test4.grid[12][4].alive = true;
	test4.grid[12][5].alive = true;
	test4.grid[12][7].alive = true;
	test4.grid[12][8].alive = true;
	test4.grid[12][10].alive = true;
	test4.grid[12][11].alive = true;
	test4.grid[12][13].alive = true;
	test4.grid[12][14].alive = true;
	test4.grid[12][15].alive = true;

	test4.grid[13][3].alive = true;
	test4.grid[13][6].alive = true;
	test4.grid[13][8].alive = true;
	test4.grid[13][10].alive = true;
	test4.grid[13][12].alive = true;
	test4.grid[13][15].alive = true;

	test4.grid[14][6].alive = true;
	test4.grid[14][7].alive = true;
	test4.grid[14][11].alive = true;
	test4.grid[14][12].alive = true;

	test4.grid[15][5].alive = true;
	test4.grid[15][6].alive = true;
	test4.grid[15][12].alive = true;
	test4.grid[15][13].alive = true;


	//save space by having a swap model method
	var visualizerThree = new GameOfLifeViewer(jQueryElem,test4,false);
	var popup3 = new GameOfLife(test4,visualizerThree);



	mouseoverHandler($('#lwss'),$('#pop_up_right'),$('#preview_canvas'), true, popup2);
	mouseoverHandler($('#pulsar'),$('#pop_up_right'),$('#preview_canvas'), true, popup3);

	var test5 = new GameOfLifeModel(40,40);
	test5.grid[0][13].alive =true;
	test5.grid[1][12].alive =true;
	test5.grid[1][13].alive =true;
	test5.grid[8][13].alive =true;
	test5.grid[8][14].alive =true;
	test5.grid[9][12].alive =true;
	test5.grid[9][14].alive =true;
	test5.grid[10][12].alive =true;
	test5.grid[10][13].alive =true;
	test5.grid[16][14].alive =true;
	test5.grid[16][15].alive =true;
	test5.grid[16][16].alive =true;
	test5.grid[17][14].alive =true;
	test5.grid[18][15].alive =true;
	test5.grid[22][11].alive =true;
	test5.grid[22][12].alive =true;
	test5.grid[23][10].alive =true;
	test5.grid[23][12].alive =true;
	test5.grid[24][10].alive =true;
	test5.grid[24][11].alive =true;
	test5.grid[24][22].alive =true;
	test5.grid[24][23].alive =true;
	test5.grid[25][22].alive =true;
	test5.grid[25][24].alive =true;
	test5.grid[26][22].alive =true;
	test5.grid[34][10].alive =true;
	test5.grid[34][11].alive =true;
	test5.grid[35][10].alive =true;
	test5.grid[35][11].alive =true;
	test5.grid[35][17].alive =true;
	test5.grid[35][18].alive =true;
	test5.grid[35][19].alive =true;
	test5.grid[36][17].alive =true;
	test5.grid[37][18].alive =true;

	var visualizerFour = new GameOfLifeViewer(jQueryElem,test5,false);
	var popup4 = new GameOfLife(test5,visualizerFour);
	mouseoverHandler($('#gospel_gun'),$('#pop_up_right'),$('#preview_canvas'), true, popup4);


	var test6 = new GameOfLifeModel(10,10);
	test6.grid[2][3].alive =true;
	test6.grid[2][4].alive =true;
	test6.grid[3][3].alive =true;
	test6.grid[4][6].alive =true;
	test6.grid[5][5].alive =true;
	test6.grid[5][6].alive =true;

	var visualizerSix = new GameOfLifeViewer(jQueryElem,test6,false);
	var popup6 = new GameOfLife(test6,visualizerSix);
	mouseoverHandler($('#beacon'),$('#pop_up_right'),$('#preview_canvas'), true, popup6);


	var test7 = new GameOfLifeModel(10,10);
	test7.grid[4][3].alive =true;
	test7.grid[4][4].alive =true;
	test7.grid[4][5].alive =true;
	test7.grid[5][4].alive =true;
	test7.grid[5][5].alive =true;
	test7.grid[5][6].alive =true;

	var visualizerSix = new GameOfLifeViewer(jQueryElem,test7,false);
	var popup7 = new GameOfLife(test7,visualizerSix);
	mouseoverHandler($('#toad'),$('#pop_up_right'),$('#preview_canvas'), true, popup7);

	var stillLifeOne = new GameOfLifeModel(10,10);
	stillLifeOne.grid[4][4].alive =true;
	stillLifeOne.grid[4][5].alive =true;
	stillLifeOne.grid[5][5].alive =true;
	stillLifeOne.grid[5][4].alive =true;


	var visualizerSL = new GameOfLifeViewer(jQueryElem,stillLifeOne,false);
	var popup8 = new GameOfLife(stillLifeOne,visualizerSL);
	mouseoverHandler($('#block'),$('#pop_up_right'),$('#preview_canvas'), true, popup8);


	var stillLifeTwo = new GameOfLifeModel(10,10);
	stillLifeTwo.grid[4][5].alive =true;
	stillLifeTwo.grid[4][6].alive =true;
	stillLifeTwo.grid[5][4].alive =true;
	stillLifeTwo.grid[5][7].alive =true;
	stillLifeTwo.grid[6][5].alive =true;
	stillLifeTwo.grid[6][6].alive =true;

	var visualizerSLTwo = new GameOfLifeViewer(jQueryElem,stillLifeTwo,false);
	var popup9 = new GameOfLife(stillLifeTwo,visualizerSLTwo);
	mouseoverHandler($('#hive'),$('#pop_up_right'),$('#preview_canvas'), true, popup9);


	var stillLifeThree = new GameOfLifeModel(10,10);
	stillLifeThree.grid[4][3].alive =true;
	stillLifeThree.grid[4][4].alive =true;
	stillLifeThree.grid[4][5].alive =true;
	stillLifeThree.grid[5][4].alive =true;
	stillLifeThree.grid[5][5].alive =true;
	stillLifeThree.grid[5][6].alive =true;

	var visualizerSLThree = new GameOfLifeViewer(jQueryElem,stillLifeThree,false);
	var popup10 = new GameOfLife(stillLifeThree,visualizerSLThree);
	mouseoverHandler($('#loaf'),$('#pop_up_right'),$('#preview_canvas'), true, popup10);


	var stillLifeFour = new GameOfLifeModel(10,10);
	stillLifeFour.grid[4][3].alive =true;
	stillLifeFour.grid[4][4].alive =true;
	stillLifeFour.grid[4][5].alive =true;
	stillLifeFour.grid[5][4].alive =true;
	stillLifeFour.grid[5][5].alive =true;
	stillLifeFour.grid[5][6].alive =true;

	var visualizerSLFour = new GameOfLifeViewer(jQueryElem,stillLifeFour,false);
	var popup11 = new GameOfLife(stillLifeFour,visualizerSLFour);
	mouseoverHandler($('#boat'),$('#pop_up_right'),$('#preview_canvas'), true, popup11);


	var pent = new GameOfLifeModel(20,20);
	pent.grid[10][11].alive =true;
	pent.grid[10][12].alive =true;
	pent.grid[11][10].alive =true;
	pent.grid[11][11].alive =true;
	pent.grid[12][11].alive =true;

	var visualizerPent = new GameOfLifeViewer(jQueryElem,pent,false);
	var popup13 = new GameOfLife(pent,visualizerPent);
	mouseoverHandler($('#r_pent'),$('#pop_up_right'),$('#preview_canvas'), true, popup13, true);
	randomArray[2] = pent;
	var rand = new GameOfLifeModel(4,4);
	rand.grid[2][2].randomGenerator = true;
	var visualizerRand = new GameOfLifeViewer(jQueryElem,rand,false);
	var popup14 = new GameOfLife(rand,visualizerRand);
	mouseoverHandler($('#rand_gen'),$('#pop_up_right'),$('#preview_canvas'), true, popup14, true);

}




function hideMenu(){
	var menu = $('#drop_down_menu');
	menu.fadeOut(200);
}
function showMenu(){
	var menu = $('#drop_down_menu');
	menu.fadeIn(200);
	menu.mouse
	menu.mouseleave(function(){
		hideMenu();
	});
}

function createModal(){
	var title = '#basic-modal-content'+'-'+moduleIndex;
	hideRightToolBar();
	hideLeftToolBar();
	hideMainBoard();
	hideSticky();
	$(title).modal(
		{onClose: function(){$.modal.close();loadCurModule();resetLoop();}, onOpen: function (dialog) { dialog.overlay.fadeIn('slow', function () { dialog.data.hide(); dialog.container.fadeIn('slow', function () {
			dialog.data.fadeIn('slow');
		});
	});
	}
});
}

createModal();

function setKeyBindings(){


	$('#mOne').click(function(){
		moduleIndex =0;
		createModal();
	});
	$('#mTwo').click(function(){
		moduleIndex =1;
		createModal();
	});
	$('#mThree').click(function(){
		moduleIndex =2;
		createModal();
	});
	$('#mFour').click(function(){
		moduleIndex =3;
		createModal();
	});
	$('#mSix').click(function(){
		moduleIndex =4;
		createModal();
	});


	$('#next_module').click(function(){
		moduleIndex++;
		if(moduleIndex>4){
			moduleIndex = 4;
		}
		else{
			createModal();
		}
	});

	$('#previous_module').click(function(){
		moduleIndex--;
		if(moduleIndex<0){
			moduleIndex = 0;
		}
		else{
			createModal();
		}
	});

	$('#current_module').click(function(){
		createModal();
	});



	$('#pulldown_div').click(function(){
		//alert("clicked")
		var menu = $('#drop_down_menu');
		if( menu.is(":visible") ){
			hideMenu();
		}
		else{
			showMenu();
		}
	});

	$("#update_button").click(function () {

		activeModule.updateGrid();
	});
	$("#clear_button").click(function(){
		activeModule.model.clearGrid();
	});

	$("#start_button").click(function () {
		activeModule.autoUpdate = true;

	});
	$("#stop_button").click(function () {
		activeModule.autoUpdate = false;
	});


	$("#speed_up_button").click(function () {
		increaseFps(1.1);

	});
	$("#slow_down_button").click(function () {
		//alert("stop update grid called");
		shrinkFps(1.1);

	});


	$("#zoom_button").click(function () {
		//alert("stop update grid called");
		activeModule.viewer.zoom();
	});
	$("#unzoom_button").click(function () {
		//alert("stop update grid called");
		activeModule.viewer.unzoom();
	});
	$("#pan_right").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panRight = true;
     });
	$("#pan_right").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panRight = false;
     	//alert("pan right false");
     });
	$("#pan_left").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panLeft = true;
     });
	$("#pan_left").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panLeft = false;
     	//alert("pan right false");
     });
	$("#pan_up").mouseover(function(){
     	//alert("top true");
     	activeModule.viewer.panUp = true;
     });
	$("#pan_up").mouseout(function(){
     	//alert("top false");
     	activeModule.viewer.panUp = false;
     	//alert("pan right false");
     });
	$("#pan_down").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panDown = true;
     });
	$("#pan_down").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panDown = false;
     	//alert("pan right false");
     });

	$(document).keydown(function(e) {
		//alert(""+e.keyCode);
		//alert(e.keyCode);
		switch(e.keyCode){
     		//space
     		case 32: activeModule.autoUpdate = !activeModule.autoUpdate;
     		e.preventDefault();
     		e.stopPropagation();

     		//alert(randomArray[0].xCells +" "+randomArray[1].xCells +" "+randomArray[2].xCells);
     		//showLeftToolBar();
     		//showRightToolBar();
     		break;
     		//left arrow
     		case 37: activeModule.viewer.panLeft = true;
     		e.preventDefault();
     		e.stopPropagation();

     		break;
     		//up arrow
     		case 38: activeModule.viewer.panUp = true;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     		//right arrow
     		case 39: activeModule.viewer.panRight = true;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     		//down arrow
     		case 40: activeModule.viewer.panDown = true;
     		e.preventDefault();
     		e.stopPropagation();
     		break;

     		case 67:
     		activeModule.model.clearGrid();
     		e.preventDefault();
     		e.stopPropagation();
     		break;

     		//n
     		case 78:
     		activeModule.updateAndRender();
     		break;

     		case 187:
     		activeModule.viewer.zoom();
     		break;
     		case 189:
     		activeModule.viewer.unzoom();
     		break;
     		//>
     		case 188:
     		shrinkFps();
     		break;
     		//<
     		case 190:
     		increaseFps();
     		break;
     	}
     });
$(document).keyup(function(e) {

		//alert(e.keyCode);
		switch(e.keyCode){
     		//left arrow
     		case 37: activeModule.viewer.panLeft = false;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     		//up arrow
     		case 38: activeModule.viewer.panUp = false;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     		//right arrow
     		case 39: activeModule.viewer.panRight = false;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     		case 40: activeModule.viewer.panDown = false;
     		e.preventDefault();
     		e.stopPropagation();
     		break;
     	}
     });

}
function Color(red, green, blue, alpha){
	this.red = red;
	this.blue = blue;
	this.green = green;
	if(alpha==undefined){
		this.alpha = 1;
	}
	else{
		this.alpha = alpha;
	}
}
function generateColorString(color){
	return "rgba("+color.red+","+color.green+","+color.blue+","+color.alpha+")";
}

function Cell(tarSquare, alive, color){
	this.bounds = tarSquare;
	this.alive = alive;
	this.color = new Color(color.red, color.green, color.blue);
	this.preview = false;
	this.randomGenerator = false;
	this.randomGeneratorPrev = false;
	this.randColor;

	this.setColor = function(newColor){
		this.color = new Color(newColor.red, newColor.green, newColor.blue);
	}

	this.setPreview = function(isPrev){
		this.preview = isPrev;
	}
	this.getColor = function(){
		return this.color;
	}

	this.setRandomGenerator = function(rg){
		this.randomGenerator = rg;
	}

}

function GridViewer(bounds, zoom){
	this.bounds = bounds;
	this.zoom = zoom;
}

function Square(xLoc, yLoc, width, height){
	this.x = xLoc;
	this.y = yLoc;
	this.height = height;
	this.width = width;
}




var main = function () {

	//alert('main called');
	if(activeModule!=null){
		updateCounter = updateCounter-1;
		if(activeModule.autoUpdate&&updateCounter<=0){
			activeModule.updateGrid();
			updateCounter = updateCounterMax;
			//var snd = new Audio("bleep.wav"); // buffers automatically when created
			//snd.play();

		}
		activeModule.render();
		previewGame.render();
		//slowDown = !slowDown;

		drawZoomPane(previewGame,activeModule);
	}
	else{
		alert("Error: no active module. Please reset your tab. Sorry for the inconvenience.")
	}


};

function resetLoop(){
	clearInterval(mainLoopHandler);
	var newFps = Math.floor(fps*fpsMultiplier);
	mainLoopHandler = setInterval(main, 1000/newFps);
	mainLoopHandler = setInterval(main, 1000/newFps);
}

function shrinkFps(){
	if(fpsMultiplier>.5){
		fpsMultiplier-=.1;
		clearInterval(mainLoopHandler);
		var newFps = Math.floor(fps*fpsMultiplier);
		mainLoopHandler = setInterval(main, 1000/newFps);
		$('#speed_multiplier').text(""+fpsMultiplier.toFixed(1)+"x");
	}
}
function increaseFps(){
	if(fpsMultiplier<3){
		fpsMultiplier+=.1;
		clearInterval(mainLoopHandler);
		var newFps = Math.floor(fps*fpsMultiplier);
		mainLoopHandler = setInterval(main, 1000/newFps);
		$('#speed_multiplier').text(""+fpsMultiplier.toFixed(1)+"x");
	}
}

function drawZoomPane(tarGame,srcGame){
	var pCtx = tarGame.viewer.ctx;
	pCtx.fillStyle = generateColorString(new Color(20,200,200,.3));
	var srcViewer = srcGame.viewer;
	var tarViewer = tarGame.viewer;
	//fix this code
	//this.viewer.bounds.x += this.canvas.width*.1/2;
	//this.viewer.bounds.y += this.canvas.height*.1/2;

	var ratio = tarViewer.canvas.width/srcViewer.canvas.width;
	//alert(ratio);
	//alert(zViewer.bounds.x +' '+ zViewer.bounds.y +' '+ 200 +' '+ 200);
	pCtx.fillRect(srcViewer.viewer.bounds.x/srcViewer.viewer.zoom*ratio,
		srcViewer.viewer.bounds.y/srcViewer.viewer.zoom*ratio, tarViewer.canvas.width/srcViewer.viewer.zoom,
		tarViewer.canvas.height/srcViewer.viewer.zoom);
}


 //processAjaxData("")


//add call back to modal
var then = Date.now();
var mainLoopHandler = null;
