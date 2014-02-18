SKY.init = function() {
	
	// Define the map and constants
	SKY.map = Snap('#map');

	SKY.mapConstants = {
		background: '#bbb',
		buildingColor: '#555',
		buildingHighlight: '#fff',
		buildingInset: 6,
		roadColor: '#999',
		roadWidth: 8,
		skywayColor: '#282828',
		skywayWidth: 6,
		screenBackground: '#345',
		width: SKY.map.node.clientWidth,
		tileWidth: SKY.map.node.clientWidth / 10
	};

	SKY.cardinals = {
		n: { x:  0, y: -1 },
		e: { x:  1, y:  0 },
		s: { x:  0, y:  1 },
		w: { x: -1, y:  0 }
	};

	// Draw the map
	SKY.mapUtils.drawMap();
};

SKY.mapUtils = {};
SKY.mapData = {};

SKY.mapUtils.drawRoad = function(x1, y1, x2, y2) {
	SKY.map.line(x1, y1, x2, y2).attr({
		stroke: SKY.mapConstants.roadColor,
		strokeWidth: SKY.mapConstants.roadWidth
	});
};

SKY.mapUtils.drawCircle = function(x, y) {
	SKY.map.circle( x * SKY.mapConstants.tileWidth, y * SKY.mapConstants.tileWidth, SKY.mapConstants.tileWidth / 2 ).attr({
		fill: SKY.mapConstants.background,
		stroke: SKY.mapConstants.roadColor,
		strokeWidth: SKY.mapConstants.roadWidth
	});
};

SKY.mapUtils.drawRoads = function() {

	var points = {
		x: [],
		y: []
	};

	for ( var i = 1; i < 10; i++ ) {
		[ points.x, points.y ].forEach(function( el ) {
			el.push( i * SKY.mapConstants.tileWidth );
		});
	}

	for ( var j in points.x ) {
		SKY.mapUtils.drawRoad( points.x[j], 0, points.x[j], SKY.mapConstants.width );
	}
	for ( var k in points.y ) {
		SKY.mapUtils.drawRoad( 0, points.y[k], SKY.mapConstants.width, points.y[k] );
	}
};

SKY.mapUtils.findUnusedTile = function() {

	var row = _.random(0, 9),
		col = _.random(0, 9);

	if ( SKY.mapData.tiles[row][col] === true ) {
		return SKY.mapUtils.findUnusedTile();
	}

	SKY.mapData.tiles[row][col] = true;
	return { x: row, y: col };
};

SKY.mapUtils.drawBuilding = function(coord) {
	return SKY.map.rect( 

		coord.x * SKY.mapConstants.tileWidth + SKY.mapConstants.roadWidth + SKY.mapConstants.buildingInset,
		coord.y * SKY.mapConstants.tileWidth + SKY.mapConstants.roadWidth + SKY.mapConstants.buildingInset,
		SKY.mapConstants.tileWidth - SKY.mapConstants.roadWidth * 2 - SKY.mapConstants.buildingInset * 2,
		SKY.mapConstants.tileWidth - SKY.mapConstants.roadWidth * 2 - SKY.mapConstants.buildingInset * 2

	).attr({

		fill: SKY.mapConstants.buildingColor,
		stroke: SKY.mapConstants.buildingColor,
		strokeWidth: 4

	}).mouseover(function(){

		this.attr({
			stroke: SKY.mapConstants.buildingHighlight
		});

	}).mouseout(function(){

		this.attr({
			stroke: SKY.mapConstants.buildingColor
		});

	}).mousedown(function(){

		this.attr({ 
			fill: SKY.mapConstants.buildingHighlight,
			stroke: SKY.mapConstants.buildingHighlight
		});

	}).mouseup(function(){

		this.attr({ 
			fill: SKY.mapConstants.buildingColor,
			stroke: SKY.mapConstants.buildingColor
		});

	}).click(function(e){

		var x = Math.floor( e.offsetX / SKY.mapConstants.tileWidth ),
			y = Math.floor( e.offsetY / SKY.mapConstants.tileWidth );

		for ( var i = 0; i < SKY.mapData.buildings.length; i++ ) {

			for ( var cardinal in SKY.cardinals ) {
				
				// Can we build a skyway?
				if ( SKY.mapData.buildings[i].x - x === SKY.cardinals[cardinal].x && SKY.mapData.buildings[i].y - y === SKY.cardinals[cardinal].y ) {
					console.log('can build skyway ' + cardinal);
					var skyway;

					// If yes, which direction?
					if ( cardinal === 'n' || cardinal === 's' ) {

						skyway = SKY.map.rect( 

							x * SKY.mapConstants.tileWidth + SKY.mapConstants.tileWidth / 2 - SKY.mapConstants.skywayWidth / 2, 
							y * SKY.mapConstants.tileWidth + ( ( SKY.cardinals[cardinal].y + 1 ) / 2 ) * SKY.mapConstants.tileWidth - SKY.mapConstants.roadWidth / 2 - SKY.mapConstants.buildingInset, 
							SKY.mapConstants.skywayWidth, 
							SKY.mapConstants.roadWidth + SKY.mapConstants.buildingInset * 2

						);

					} else {

						skyway = SKY.map.rect( 

							x * SKY.mapConstants.tileWidth + ( ( SKY.cardinals[cardinal].x + 1 ) / 2 ) * SKY.mapConstants.tileWidth - SKY.mapConstants.roadWidth / 2 - SKY.mapConstants.buildingInset, 
							y * SKY.mapConstants.tileWidth + SKY.mapConstants.tileWidth / 2 - SKY.mapConstants.skywayWidth / 2, 
							SKY.mapConstants.roadWidth + SKY.mapConstants.buildingInset * 2,
							SKY.mapConstants.skywayWidth

						);

					}

					skyway.attr({	
						fill: SKY.mapConstants.skywayColor
					});

				}

			}

		}

	});
};

SKY.mapUtils.drawBuildings = function(i) {

	for (var j = 0; j < i; j++) {

		var coord = SKY.mapUtils.findUnusedTile();
		
		var path = SKY.mapUtils.drawBuilding( coord );
		coord.path = path;

		SKY.mapData.buildings.push( coord );

		SKY.mapData.tiles[coord.x][coord.y] = true;
	}

};

SKY.mapUtils.drawMap = function() {

	// Set background color of screen
	document.documentElement.style.background = SKY.mapConstants.screenBackground;

	// Set background color of the map
	SKY.map.node.style.backgroundColor = SKY.mapConstants.background;

	// draw roads
	SKY.mapUtils.drawRoads();

	// Because the outermost tiles don't get roads on them, add a border to the edge
	// of the map equal to 1/2 of the road width, the color of the screen background
	SKY.map.rect( 0, 0, SKY.mapConstants.width, SKY.mapConstants.width ).attr({
		fill: 'transparent',
		stroke: SKY.mapConstants.screenBackground,
		strokeWidth: SKY.mapConstants.roadWidth / 2
	});

	SKY.mapData.tiles = [];
	for (var x = 0; x < 10; x++) {
		SKY.mapData.tiles.push([]);
		for (var y = 0; y < 10; y++) {
			SKY.mapData.tiles[x].push(false);
		}
	}

	// draw two pseudo-random circles
	var circles = [
		[ _.random(1, 5), _.random(1, 5) ],
		[ _.random(6, 9), _.random(6, 9) ]
	];
	SKY.mapUtils.drawCircle( circles[0][0], circles[0][1] );
	SKY.mapUtils.drawCircle( circles[1][0], circles[1][1] );
	SKY.mapData.circles = [
		{
			x: circles[0][0],
			y: circles[0][1]
		},
		{
			x: circles[1][0],
			y: circles[1][1]
		}
	];
	SKY.mapData.tiles[circles[0][0]][circles[0][1]] = true;
	SKY.mapData.tiles[circles[1][0]][circles[1][1]] = true;
	SKY.mapData.tiles[circles[0][0] - 1][circles[0][1]] = true;
	SKY.mapData.tiles[circles[1][0] - 1][circles[1][1]] = true;
	SKY.mapData.tiles[circles[0][0]][circles[0][1] - 1] = true;
	SKY.mapData.tiles[circles[1][0]][circles[1][1] - 1] = true;
	SKY.mapData.tiles[circles[0][0] - 1][circles[0][1] - 1] = true;
	SKY.mapData.tiles[circles[1][0] - 1][circles[1][1] - 1] = true;

	SKY.mapData.buildings = [];
	SKY.mapUtils.drawBuildings( 40 );
};