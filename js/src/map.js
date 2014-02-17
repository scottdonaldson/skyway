SKY.init = function() {
	
	// Define the map and constants
	SKY.map = Snap('#map');

	SKY.mapConstants = {
		background: '#bbb',
		buildingColor: '#555',
		roadColor: '#999',
		roadWidth: 6,
		width: SKY.map.node.clientWidth,
		tileWidth: SKY.map.node.clientWidth / 10
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

SKY.mapUtils.checkCircles = function(x, y) {
	for (var i = 0; i < SKY.mapData.circles.length; i++) {
		if ( 
			( x === SKY.mapData.circles[i].x || x === SKY.mapData.circles[i].x - 1 ) &&
			( y === SKY.mapData.circles[i].y || y === SKY.mapData.circles[i].y - 1 )
		) {
			return false;
		}
	}
	return true;
};

SKY.mapUtils.checkBuildings = function(x, y) {
	for (var i = 0; i < SKY.mapData.buildings.length; i++) {
		if ( x === SKY.mapData.buildings[i].x && y === SKY.mapData.buildings[i].y ) {
			return false;
		}
	}
	return true;
};

SKY.mapUtils.drawBuilding = function(x, y) {
	SKY.map.rect( x * SKY.mapConstants.tileWidth + 10, y * SKY.mapConstants.tileWidth + 10, SKY.mapConstants.tileWidth - 20, SKY.mapConstants.tileWidth - 20 ).attr({
		fill: SKY.mapConstants.buildingColor
	});
};

SKY.mapUtils.drawBuildings = function(i) {
	for (var j = 0; j < i; j++) {
		// Make sure that we're not in the tile of another building,
		// not next to a circle
		var x = Math.floor( Math.random() * 10 ),
			y = Math.floor( Math.random() * 10 );
		if ( SKY.mapUtils.checkCircles(x, y) && SKY.mapUtils.checkBuildings(x, y) ) {
			SKY.mapUtils.drawBuilding( x, y );
		} else {
			SKY.mapUtils.drawBuilding( Math.floor( Math.random() * 10 ), Math.floor( Math.random() * 10 ) );
		}
		SKY.mapData.buildings.push({
			x: x,
			y: y
		});
	}
};

SKY.mapUtils.drawMap = function() {

	// Set background color of the map
	SKY.map.node.style.backgroundColor = SKY.mapConstants.background;

	// draw roads
	SKY.mapUtils.drawRoads();

	SKY.mapData.unused = [];
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			SKY.mapData.unused.push({
				x: x,
				y: y
			});
		}
	}

	// draw two pseudo-random circles
	var circles = [
		[ Math.ceil( Math.random() * 5 ), Math.ceil( Math.random() * 5 ) ],
		[ Math.ceil( ( Math.random() ) * 5 ) + 4, Math.ceil( Math.random() * 5 ) + 4 ]
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

	SKY.mapData.buildings = [];
	SKY.mapUtils.drawBuildings( 30 );
};