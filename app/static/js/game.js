//MAKE A GOOD DESIGN!! Fix the bugs
//color all black, and only color alive? to speed up?
//window resize issue
//create some sort of model - and then create a space to view it. Models and viwers can be wrapped in new forms

//todo Plant things
// var selected cells.
// get click location - transform cells and copy over - make all selected alive
// colors - need to change the color of the cell stored in both the active and temp
// Randonness
//modules and research

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

	}



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


				}
			}
	    var temp;
	    temp = this.activeGrid;
	    this.activeGrid = this.inactiveGrid;
	    this.inactiveGrid = temp;



	};


}

//viewer - owns a model and some stats on how to visualize it
function GameOfLifeViewer(jQueryElem, model, interactive){
	this.model = model;
	this.canvas = jQueryElem[0];
	this.offsetLeft = jQueryElem.offset().left;
	this.offsetTop = jQueryElem.offset().top;
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
		this.activateClickedCell(x,y);
	};

	this.activatePreview = function(){
		var grid = this.model.getActiveGrid();
		var xCells = this.model.xCells;
		var yCells = this.model.yCells;
		for (var i = 0, l = xCells; i < l; i++) {
		    for (var j = 0, l2 = yCells; j < l2; j++) {
		    	if(grid[i][j].preview){
		    		grid[i][j].alive = true;
		    		grid[i][j].setColor(theColor);
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
		       	if(cell.alive||cell.preview){
		       		//alert("cell is alive");
		       		var bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       		if(cell.preview){
		       			this.ctx.fillStyle = 'rgba(255,255,255,.7)';
		       			bounds = generateCellBounds(i,j,this.squareWidth,this.squareHeight);
		       			this.paintGridCell(bounds);
		       			//alert('drawing preview');
		       		}
		       		if(cell.alive){
		       			this.ctx.fillStyle   = generateColorString(cell.color);
		       			this.paintGridCell(bounds);

		       		}


		       	}
		    }
		}
	};

	this.managePan = function(){
		var movement = Math.floor((this.viewer.zoom-1)*8);
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
	//alert(generateColorString(colorOne));
	//alert(generateColorString(colorTwo));
	//alert(generateColorString(colorThree));
	var mixColor = new Color( Math.floor( (colorOne.red+colorTwo.red+colorThree.red)/3 ), Math.floor( (colorOne.green+colorTwo.green+colorThree.green)/3 ),
		Math.floor( (colorOne.blue+colorTwo.blue+colorThree.blue)/3 ), Math.floor( (colorOne.alpha+colorTwo.alpha+colorThree.alpha)/3 ) ) ;
	//alert( " "+(colorOne.red+colorTwo.red+colorThree.red)/3 +" " +(colorOne.green+colorTwo.green+colorThree.green)/3 +" "+
		//(colorOne.blue+colorTwo.blue+colorThree.blue)/3 +" " +(colorOne.alpha+colorTwo.alpha+colorThree.alpha)/3);
	return mixColor;
}



// Create the canvas
//var canvas = document.getElementById("my_canvas");
var canvasElem = $('#my_canvas');
var moduleOneGrid = new GameOfLifeModel(100,100);
var moduleOneVisualizer = new GameOfLifeViewer(canvasElem, moduleOneGrid, true);
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
moduleOneVisualizer.zoom();
var moduleOneGameOfLife = new GameOfLife(moduleOneGrid,moduleOneVisualizer);
var activeModule = moduleOneGameOfLife;
//alert(moduleOneVisualizer.viewer.zoom);


var sCanvas = document.getElementById("sim_canvas");
var jQueryElem = $('#sim_canvas');

//I should just be able to plug in the model and have everything work..
//IE model needs to be independ of view - the view resizes the model... should be easy enough to do
//A cell contains location and color - not width! the view contains the cell width


var visualizer = new GameOfLifeViewer(jQueryElem,moduleOneGrid,false);
var gameOne = new GameOfLife(moduleOneGrid,visualizer);
//gameOne.updateAndRender();
//gameOne.updateAndRender();
//visualizer.zoom();
//visualizer.render();
//alert(test.grid[3][5].alive);




var offsetLeft = $('#my_canvas').offset().left;
var offsetTop = $('#my_canvas').offset().top;
//alert(offsetTop);
//alert(offsetLeft);
//alert(offsetLeft);

//var ctx = canvas.getContext("2d");
//canvas.width = 600;
//canvas.height = 600;
//document.body.appendChild(canvas);

//canvas.addEventListener("mousedown", moduleOneGameOfLife.viewer.getPosition(), false);

//TODO: orgainze this code better




//game speed and controll
var updateCounterMax = 10;
var updateCounter = updateCounterMax;
var autoUpdate = false;
var fpsMultiplier = 1.0;
var fps = 40;
var clicked = false;

var containsShape = false;



function renderPreview(module, e){
	var cells = module.viewer.getCellIndex(e.pageX-offsetLeft, e.pageY-offsetTop);
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
		}
	}

}



$('#my_canvas').mousemove(function(e){

 if(shapeHandler.isActive()){
 	renderPreview(activeModule, e);
 }
  else if(clicked){
    activeModule.viewer.getDragPosition(e.pageX-offsetLeft, e.pageY-offsetTop);
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

function mouseoverHandler(tarElem, el, content, maintain, game){


	tarElem.mouseenter(function() {

		tarElem.click(function(){

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
		});
		//alert("triggering addin");
		var handler;
	 	 var timeoutId = setTimeout(function() {
	 	 	if(game!=undefined){
	 	 		game.render();
				handler = startAutoThread(game,3);
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


	mouseoverHandler( $("#start_button"), $('#pop_up'), $('<img class = "pop_image" width="90" height="60" src="../images/space.png"/>'), false);
	mouseoverHandler( $("#stop_button"), $('#pop_up'), $('<img class = "pop_image" width="90" height="60" src="../images/space.png"/>'), false);
	mouseoverHandler( $("#zoom_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/plus_equal.png"/>'), false);
	mouseoverHandler( $("#unzoom_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/minus.png"/>'), false);
	mouseoverHandler( $("#update_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/n_key.png"/>'), false);
	mouseoverHandler( $("#slow_down_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/sskey.png"/>'), false);
	mouseoverHandler( $("#speed_up_button"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/ffkey.png"/>'), false);

	mouseoverHandler( $("#pan_right"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/arrow_right.png"/>'), false);
	mouseoverHandler( $("#pan_left"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/arrow_left.png"/>'), false);
	mouseoverHandler( $("#pan_up"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/arrow_up.png"/>'), false);
	mouseoverHandler( $("#pan_down"), $('#pop_up'), $('<img class = "pop_image" width="60" height="60" src="../images/arrow_down.png"/>'), false);

function createPreviews(){
	var jQueryElem = $('#preview_canvas');
	var test2 = new GameOfLifeModel(20,20);
	test2.grid[4][5].alive = true;
	test2.grid[5][5].alive = true;
	test2.grid[6][5].alive = true;
	test2.grid[6][4].alive = true;
	test2.grid[5][3].alive = true;
	var visualizer = new GameOfLifeViewer(jQueryElem,test2,false);
	var popup = new GameOfLife(test2,visualizer);

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


	mouseoverHandler($('#space_ship'),$('#pop_up_right'),$('#preview_canvas'), true, popup);
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





}

createPreviews();



	var vClicked = false;
    $('#video_pulldown').click(function(){
    	if(!vClicked){
	    $(this).animate({height: '600', width: '700'}, 500, function() {
	    	vClicked = true;
	  	});
		}
		else{
	  	$(this).animate({height: '50', width: '100'}, 500, function() {
	    	vClicked = false;
	  	});
	  }
	});

	//$('#update_button').modal({opacity:10});
	$('#basic-modal-content').modal();

	//alert("Jquery works");
	$("#update_button").click(function () {
		//alert("update grid called");
      	activeModule.updateGrid();
    });
    $("#start_button").click(function () {
		//alert("auto update grid called");

      activeModule.autoUpdate = true;
      //alert(autoUpdate);
    });
    $("#stop_button").click(function () {
		//alert("stop update grid called");
      activeModule.autoUpdate = false;
    });


    $("#speed_up_button").click(function () {
		increaseFps(1.1);
		//$('#speed_multiplier').text(""+fpsMultiplier.toFixed(1)+"x");

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
     $("#right_box").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panRight = true;
     });
       $("#right_box").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panRight = false;
     	//alert("pan right false");
     });
         $("#left_box").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panLeft = true;
     });
       $("#left_box").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panLeft = false;
     	//alert("pan right false");
     });
      $("#top_box").mouseover(function(){
     	//alert("top true");
     	activeModule.viewer.panUp = true;
     });
       $("#top_box").mouseout(function(){
     	//alert("top false");
     	activeModule.viewer.panUp = false;
     	//alert("pan right false");
     });
      $("#bottom_box").mouseover(function(){
     	//alert("pa right true");
     	activeModule.viewer.panDown = true;
     });
      $("#bottom_box").mouseout(function(){
     	//alert("panning right");
     	activeModule.viewer.panDown = false;
     	//alert("pan right false");
     });

     $(document).keydown(function(e) {

		//alert(e.keyCode);
     	switch(e.keyCode){
     		//space
     		case 32: activeModule.autoUpdate = !activeModule.autoUpdate;
     				e.preventDefault();
     				e.stopPropagation();
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

});



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

	this.setColor = function(newColor){
		this.color = new Color(newColor.red, newColor.green, newColor.blue);
	}

	this.setPreview = function(isPrev){
		this.preview = isPrev;
	}
	this.getColor = function(){
		return this.color;
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

	updateCounter = updateCounter-1;
	if(activeModule.autoUpdate&&updateCounter<=0){
		activeModule.updateGrid();
		updateCounter = updateCounterMax;
		//var snd = new Audio("bleep.wav"); // buffers automatically when created
		//snd.play();

	}
	activeModule.render();
	gameOne.render();
	//slowDown = !slowDown;

		drawZoomPane(gameOne,activeModule);


};

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

//use this to change url on module completion
function processAjaxData(response, urlPath){
     document.getElementById("content").innerHTML = response.html;
     document.title = response.pageTitle;
     window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 }


//add call back to modal
var then = Date.now();
var mainLoopHandler = setInterval(main, 1000/fps);
