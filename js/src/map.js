/*!
 *
 *	Map constants, data, and utilities
 *
 */

(function() {

// These will be shortcuts to SKY.mapConstants, SKY.mapData, and SKY.mapUtilities (respectively)
var c, d, u;

// Initializing function. Called from index.html
SKY.init = function() {
	
	// Define the map and constants
	SKY.map = Snap('#map');

	SKY.mapConstants = {
		background: '#bbb',
		buildingColor: '#555',
		buildingHighlight: '#ddd',
		roadColor: '#999',
		skywayColor: '#333',
		screenBackground: '#345',
		width: 500
	};

	// map c to make things easier when we refer to constants
	c = SKY.mapConstants;

	c.tileWidth = c.width / 10;
	c.roadWidth = c.width / 75;
	c.skywayWidth = c.roadWidth * 0.75;
	c.buildingInset = c.roadWidth * 0.6;
	c.buildingStroke = c.buildingInset * 0.5;

	// Cardinal directions
	c.cardinals = {
		n: { x:  0, y: -1 },
		e: { x:  1, y:  0 },
		s: { x:  0, y:  1 },
		w: { x: -1, y:  0 }
	};

	// Draw the map
	SKY.mapUtils.drawMap();
};

// Empty objects for utility functions and map data
SKY.mapUtils = {};
u = SKY.mapUtils;

SKY.mapData = {
	buildings: [],
	circles: [],
	tiles: []
};
d = SKY.mapData;

SKY.mapUtils.drawRoad = function(x1, y1, x2, y2) {

	SKY.map.line(x1, y1, x2, y2).attr({
		stroke: c.roadColor,
		strokeWidth: c.roadWidth
	});

};

SKY.mapUtils.drawRoads = function() {

	var points = {
		x: [],
		y: []
	};

	for ( var i = 1; i < 10; i++ ) {
		[ points.x, points.y ].forEach(function( el ) {
			el.push( i * c.tileWidth );
		});
	}

	for ( var j in points.x ) {
		u.drawRoad( points.x[j], 0, points.x[j], c.width );
	}

	for ( var k in points.y ) {
		u.drawRoad( 0, points.y[k], c.width, points.y[k] );
	}

};

SKY.mapUtils.drawCircle = function(x, y) {

	SKY.map.circle( x * c.tileWidth, y * c.tileWidth, c.tileWidth / 2 ).attr({
		fill: c.background,
		stroke: c.roadColor,
		strokeWidth: c.roadWidth
	});

	d.circles.push({
		x: x,
		y: y
	});

	d.tiles[x][y] = true;
	d.tiles[x - 1][y] = true;
	d.tiles[x][y - 1] = true;
	d.tiles[x - 1][y - 1] = true;

};

SKY.mapUtils.findUnusedTile = function() {

	var row = _.random(0, 9),
		col = _.random(0, 9);

	if ( d.tiles[row][col] === true ) {

		return u.findUnusedTile();

	}

	return { x: row, y: col };
};

SKY.mapUtils.drawBuilding = function(coord) {

	return SKY.map.rect( 

		coord.x * c.tileWidth + c.roadWidth / 2 + c.buildingInset + c.buildingStroke / 2,
		coord.y * c.tileWidth + c.roadWidth / 2 + c.buildingInset + c.buildingStroke / 2,
		c.tileWidth - c.roadWidth - c.buildingInset * 2 - c.buildingStroke,
		c.tileWidth - c.roadWidth - c.buildingInset * 2 - c.buildingStroke

	).attr({

		fill: c.buildingColor,
		stroke: c.buildingColor,
		strokeWidth: c.buildingStroke

	}).mouseover(function(){

		this.attr({
			stroke: c.buildingHighlight
		});

	}).mouseout(function(){

		this.attr({
			stroke: c.buildingColor
		});

	}).mousedown(function(){

		this.attr({ 
			fill: c.buildingHighlight,
			stroke: c.buildingHighlight
		});

	}).mouseup(function(){

		this.attr({ 
			fill: c.buildingColor,
			stroke: c.buildingColor
		});

	}).click(function(e){

		var x = Math.floor( e.offsetX / c.tileWidth ),
			y = Math.floor( e.offsetY / c.tileWidth );

		for ( var i = 0; i < d.buildings.length; i++ ) {

			for ( var cardinal in c.cardinals ) {
				
				// Can we build a skyway?
				if ( d.buildings[i].x - x === c.cardinals[cardinal].x && d.buildings[i].y - y === c.cardinals[cardinal].y ) {
					
					var skyway;

					// If yes, which direction?
					if ( cardinal === 'n' || cardinal === 's' ) {

						skyway = SKY.map.rect( 

							x * c.tileWidth + c.tileWidth / 2 - c.skywayWidth / 2, 
							y * c.tileWidth + ( ( c.cardinals[cardinal].y + 1 ) / 2 ) * c.tileWidth - c.roadWidth / 2 - c.buildingInset, 
							c.skywayWidth, 
							c.roadWidth + c.buildingInset * 2

						);

					} else {

						skyway = SKY.map.rect( 

							x * c.tileWidth + ( ( c.cardinals[cardinal].x + 1 ) / 2 ) * c.tileWidth - c.roadWidth / 2 - c.buildingInset, 
							y * c.tileWidth + c.tileWidth / 2 - c.skywayWidth / 2, 
							c.roadWidth + c.buildingInset * 2,
							c.skywayWidth

						);

					}

					skyway.attr({	
						fill: c.skywayColor
					});

				}

			}

		}

	});
};

// function to draw i random buildings
SKY.mapUtils.drawBuildings = function(i) {

	for (var j = 0; j < i; j++) {

		var coord = u.findUnusedTile();
		
		var path = u.drawBuilding( coord );

		// add the path to the coord object
		coord.path = path;

		// then add it to the mapData.buildings array
		// so we can refer to this later
		d.buildings.push( coord );

		// This tile is now booked
		d.tiles[coord.x][coord.y] = true;
	}

};

SKY.mapUtils.drawMap = function() {

	// Set background color of screen
	document.documentElement.style.background = c.screenBackground;

	// Set height and width of the map
	SKY.map.node.style.width = c.width + 'px';
	SKY.map.node.style.height = c.width + 'px';	

	// Set background color of the map
	SKY.map.node.style.backgroundColor = c.background;

	// draw roads
	u.drawRoads();

	// Because the outermost tiles don't get roads on them, add a border to the edge
	// of the map equal to 1/2 of the road width, the color of the screen background
	SKY.map.rect( 0, 0, c.width, c.width ).attr({
		fill: 'transparent',
		stroke: c.screenBackground,
		strokeWidth: c.roadWidth
	});

	// Tiles is an array of arrays s.t. [0][0] = (0, 0)
	// the value is false if empty (all empty at start)
	// and true if there's something in this tile
	for (var x = 0; x < 10; x++) {
		d.tiles.push([]);
		for (var y = 0; y < 10; y++) {
			d.tiles[x].push(false);
		}
	}

	// draw two pseudo-random circles
	var circles = [
		[ _.random(1, 5), _.random(1, 5) ],
		[ _.random(6, 9), _.random(6, 9) ]
	];
	u.drawCircle( circles[0][0], circles[0][1] );
	u.drawCircle( circles[1][0], circles[1][1] );

	// draw 40 buildings
	u.drawBuildings( 40 );
};
}());