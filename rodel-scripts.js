( function($) {
	
	jQuery(document).ready( function() {
		
		app.init();

	});
	
})();

var app = {
	vars: {
		boxDim: 50,
		rows: 6,
		cols: 6,
		doors: {
			1: {
				x: 3, // x must less than or equal to number of cols
				y: 6, // y must be less than or equal to number rows
				face: 'right'
			},
			2: {
				x: 4,
				y: 6,
				face: 'right'
			}
		},
		minPeople: 2,
		maxPeople: 2,
		people: {},
		sortedPeople: [{}],
		timeInter: 360,
		dtd: {},
		currStep: 0,
		maxSteps: 0,
		startMove: ''
	},

	init: function() {
		app.drawRoom(function() {
			app.addDoors(app.move.getExitDoor());
		});

		app.sortPeople(app.move.movePerson);

		//app.tweenMe();

		/* Init sa magdamag */
	},

	drawRoom: function(cbf) {
		jQuery('#classroom').css({
			width: app.vars.boxDim * app.vars.cols,
			height: app.vars.boxDim * app.vars.rows
		});

		for(var j = 1; j <= app.vars.rows; j++) {
			for(var i = 1; i <= app.vars.cols; i++) {
				jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ app.vars.boxDim +'px; height:'+ app.vars.boxDim +'px;"><span class="item"></span></li>').appendTo('.classroom-wrap');
			}
		}

		// Add play/start button
		playBtn = '<div class="play-btn-holder"> \
					<a href="javascript:;" class="play-btn">Start</a> \
					</div>';

		jQuery('#main-content').append(playBtn);

		if(typeof cbf == 'function') {
			app.addPeople(function() {
				cbf.call(this);
			});
		}
	},

	addPerson: function() {
		var people = "<span class='people-item'></span>",
			rowCoor = 3,
			colCoor = 6;

		jQuery('.classroom-wrap li').each(function() {
			if(jQuery(this).data('row') == rowCoor && jQuery(this).data('col') == colCoor) {
				jQuery(this).addClass('people');
			}
		});

		jQuery('.people').append(people);

		app.getPeople();
	},

	addDoors: function(cbf) {

		var numOfDoors = Object.keys(app.vars.doors).length;

		for(var i = 1; i <= numOfDoors; i++) {
			var x = app.vars.doors[i].x,
				y = app.vars.doors[i].y,
				face = app.vars.doors[i].face;

			jQuery('.classroom-wrap li[data-row=' +x+ '][data-col=' +y+ ']').addClass('door '+ face);
		}

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
		
	},

	addPeople: function(cbf) {

		var minPeople = app.vars.minPeople;
		var maxPeople = app.vars.maxPeople;
		var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
		jQuery('#number').text(currPeople + ' people');

		var randomElements = jQuery("li").get().sort(function(){ 
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		// people = "<span class='people-item'></span>",

		for(var i = 0; i < randomElements.length; i++) {
			// jQuery(randomElements[i]).addClass('people').append("<span class='item'>" + (i+1) + "</span>");
			jQuery(randomElements[i]).addClass('people').find('span.item').html(i+1);
			jQuery(randomElements[i]).attr('id', i+1);
		}

		if(typeof cbf == 'function') {
			app.getPeople(function() {
				cbf.call(this);
			});
		}

	},

	getPeople: function(cbf) {
		var i = 1;

		jQuery('.classroom-wrap li').each(function() {
			if(jQuery(this).hasClass('people')) {
				app.vars.people[i] = {
					'colCoords': jQuery(this).data('col'),
					'rowCoords': jQuery(this).data('row'),
					'num': jQuery(this).attr('id')
				}
				i += 1;
			}
		});

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	sortPeople: function(cbf) {
		var exitDoors = Object.keys(app.vars.dtd).length,
			numOfPeople = Object.keys(app.vars.people).length;

		for(var j = 0; j < numOfPeople; j++) {
			app.vars.sortedPeople[j] = {
				'startCol': app.vars.people[j+1].colCoords,
				'endCol': app.vars.dtd[j+1].col,
				'startRow': app.vars.people[j+1].rowCoords,
				'endRow': app.vars.dtd[j+1].row,
				'num': app.vars.people[j+1].num,
				'steps': Math.abs(app.vars.people[j+1].rowCoords - app.vars.dtd[j+1].row) + Math.abs(app.vars.people[j+1].colCoords - app.vars.dtd[j+1].col),
				'currCol': app.vars.people[j+1].colCoords,
				'currRow': app.vars.people[j+1].rowCoords
			}
		}

		app.vars.sortedPeople.sort(function(a, b) {
			return (a.steps) - (b.steps);
		});

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	move: {
		getExitDoor: function() {
			var numOfDoors = Object.keys(app.vars.doors).length,
				numOfPeople = Object.keys(app.vars.people).length,
				xRes = 0,
				yRes = 0,
				total = null,
				currTotal = null,
				currDoor = 1;

			for(var j = 1; j <= numOfPeople; j++) {
				for(var i = 1; i <= numOfDoors; i++) {

					xRes = Math.abs(app.vars.doors[i].x - app.vars.people[j].rowCoords);
					yRes = Math.abs(app.vars.doors[i].y - app.vars.people[j].colCoords);

					currTotal = xRes + yRes;

					if(total == null || currTotal < total) {

						// Compare distance to each door then assign exit door
						app.vars.dtd[j] = {
							'row': app.vars.doors[currDoor].x,
							'col': app.vars.doors[currDoor].y
						}

						total = currTotal;

					}

					currDoor += 1;
				} // numOfDoors
				currDoor = 1;
				total = null;
			} // numOfPeople

		},

		movePerson: function() {
			var x, y, numOfPeople = app.vars.sortedPeople.length, i = 0;

				app.vars.maxSteps = app.vars.sortedPeople[numOfPeople - 1].steps;
				

			jQuery('.play-btn').on('click', function() {

				// for(var i = 0; i < numOfPeople; i++) {

				// 	var startY = app.vars.sortedPeople[i].startRow,
				// 		endY = app.vars.sortedPeople[i].endRow,
				// 		startX = app.vars.sortedPeople[i].startCol,
				// 		endX = app.vars.sortedPeople[i].endCol,
				// 		label = app.vars.sortedPeople[i].num

				// 		app.move.getDirection(startY, endY, startX, endX, label);
				// }

				app.vars.startMove = setInterval(function() {
					var startY = app.vars.sortedPeople[i].currRow,
						endY = app.vars.sortedPeople[i].endRow,
						startX = app.vars.sortedPeople[i].currCol,
						endX = app.vars.sortedPeople[i].endCol,
						label = app.vars.sortedPeople[i].num;

					app.move.getDirection(startY, endY, startX, endX, label, i);

					i++;

					if(i < app.vars.maxSteps) {
						if(i == numOfPeople) {
							i = 0;
							app.vars.currStep = app.vars.currStep + 1;
						}
					}

					if(app.vars.currStep > app.vars.maxSteps) {
						console.log('end');
						clearInterval(app.vars.startMove);
					}

				}, app.vars.timeInter);
			});

		},

		getDirection: function(currRow, endRow, currCol, endCol, person, id, cbf) {
			var totalHorz = Math.abs(currCol - endCol),
				totalVert = Math.abs(currRow - endRow);

			if (endRow == 1) {
				if(currCol == endCol && currRow == endRow) {
					app.move.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currCol == endCol) {
					// console.log(person + ' will move up 1');
					app.move.moveUp(currRow, endRow, currCol, endCol, person, id);
				} else if(currCol < endCol) {
					if(totalVert == 0) {
						// console.log(person + ' will move right 2');
						app.move.moveRight(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move right 3');
						app.move.moveRight(currRow, endRow, currCol, endCol, person, id);
					}
				} else {
					if(totalVert == 0) {
						// console.log(person + ' will move left 4');
						app.move.moveLeft(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move left 5');
						app.move.moveLeft(currRow, endRow, currCol, endCol, person, id);
					}
				}
			} else if (endRow == app.vars.rows) {
				if(currCol == endCol && currRow == endRow) {
					app.move.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if (currCol == endCol) {
					// console.log(person + ' will move down 6');
					app.move.moveDown(currRow, endRow, currCol, endCol, person, id);
				} else if(currCol < endCol) {
					if (totalVert == 0) {
						// console.log(person + ' will move right 7');
						app.move.moveRight(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move right 8');
						app.move.moveRight(currRow, endRow, currCol, endCol, person, id);
					}
				} else {
					if (totalVert == 0) {
						// console.log(person + ' will move left 9');
						app.move.moveLeft(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move left 10');
						app.move.moveLeft(currRow, endRow, currCol, endCol, person, id);
					}
				}
			} else if (endCol == 1) {
				if(currCol == endCol && currRow == endRow) {
					app.move.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currRow == endRow) {
					// console.log(person + ' will move left 11');
					app.move.moveLeft(currRow, endRow, currCol, endCol, person, id);
				} else if(currRow < endRow) {
					if (totalHorz == 0) {
						// console.log(person + ' will move down 12');
						app.move.moveDown(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move down 13');
						app.move.moveDown(currRow, endRow, currCol, endCol, person, id);
					}
				} else {
					if (totalHorz == 0) {
						// console.log(person + ' will move up 14');
						app.move.moveUp(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move up 15');
						app.move.moveUp(currRow, endRow, currCol, endCol, person, id);
					}
				}
			} else if (endCol == app.vars.cols) {
				if(currCol == endCol && currRow == endRow) {
					app.move.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currRow == endRow) {
					//console.log(person + ' will move right 16');
					app.move.moveRight(currRow, endRow, currCol, endCol, person, id);

				} else if(currRow < endRow) {
					if (totalHorz == 0) {
						// console.log(person + ' will move down 17');
						app.move.moveDown(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log(person + ' will move down 18');
						app.move.moveDown(currRow, endRow, currCol, endCol, person, id);
					}
				} else {
					if (totalHorz == 0) {
						app.move.moveUp(currRow, endRow, currCol, endCol, person, id);
					} else {
						app.move.moveUp(currRow, endRow, currCol, endCol, person, id);
					}
				}
			}
		},

		moveExit: function(currRow, endRow, currCol, endCol, person, id, cbf) {
			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');

			if(typeof cbf == 'function') {
				cbf.call(this);
			}			
		},

		moveUp: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
			jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

			app.move.updatePeopleList((currRow-1), endRow, currCol, endCol, person, id);

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveRight: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').addClass('people').find('span.item').html(person);

			app.move.updatePeopleList(currRow, endRow, (currCol+1), endCol, person, id);

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveDown: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
			jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

			app.move.updatePeopleList((currRow+1), endRow, currCol, endCol, person, id);

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveLeft: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').addClass('people').find('span.item').html(person);

			app.move.updatePeopleList(currRow, endRow, (currCol-1), endCol, person, id);

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		updatePeopleList: function(currRow, endRow, currCol, endCol, person, id) {
			app.vars.sortedPeople[id].currRow = currRow;
			app.vars.sortedPeople[id].currCol = currCol;
		},

		isFree: function() {

		}
	},

	tweenMe: function() {
		
	}

}