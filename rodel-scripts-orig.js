( function($) {
	
	jQuery(document).ready( function() {

		/*var Example1 = new (function() {
			// Stopwatch element on the page
			var $stopwatch;

			// Timer speed in milliseconds
			var incrementTime = 70;

			// Current timer position in milliseconds
			var currentTime = 0;

			// Start the timer
			this.startStopwatch = function() {
				$stopwatch = jQuery('#stop-watch');
				Example1.Timer = jQuery.timer(updateTimer, incrementTime, false);  
			};

			// Output time and increment
			function updateTimer() {
				var timeString = formatTime(currentTime);
				$stopwatch.html(timeString);
				currentTime += incrementTime;
			}

			// Reset timer
			this.resetStopwatch = function() {
				currentTime = 0;
				Example1.Timer.stop().once();
			};

			function pad(number, length) {
				var str = '' + number;
				while (str.length < length) {str = '0' + str;}
				return str;
			}

			function formatTime(time) {
				time = time / 10;
				var min = parseInt(time / 6000),
					sec = parseInt(time / 100) - (min * 60),
					hundredths = pad(time - (sec * 100) - (min * 6000), 2);
				return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
			}
		});*/
		
		app.init();

	});
	
})();

var app = {
	vars: {
		boxDim: 25,
		rows: 6,
		cols: 6,
		doors: {},
		/*doors: {
			1: {
				x: 1, x must less than or equal to number of cols
				y: 6, y must be less than or equal to number rows
				face: 'right'
			},
			2: {
				x: 2,
				y: 6,
				face: 'right'
			}
		},*/
		numOfPeople: 10,
		people: {},
		sortedPeople: [{}],
		timeInter: 100,
		dtd: {},
		currStep: 0,
		maxSteps: 0,
		startMove: '',
		currPerson: 0,
		numOfPeopleToMove: 0,
		area: 0
	},

	init: function(c) {

		app.renderForm();

		// app.renderForm(function() {
		// 	app.addDoors(app.move.getExitDoor());
		// });

		/*app.sortPeople();*/

		/*app.move.movePerson*/

		if (c == 'function') {
			c.call(this);
		}

	},

	setVars: function(cbf) {

		// Check if form is empty
		var empty;

		jQuery('.form-holder form input[type="number"]').each(function(){
			if(jQuery(this).val() == ""){
				empty = true;
				return false;
			}
		});

		if(!jQuery('input[name="door-count"]').is(':checked')) {
			empty = true;
		}

		if(!jQuery('input[name="dfr"]').is(':checked')) {
			empty = true;
		}
		

		if(empty == true) {
			alert('Please fill out form completely');
			return;
		} else {
			app.vars.rows = jQuery('#room-width').val() * 2;
			app.vars.cols = jQuery('#room-height').val() * 2;
			app.vars.numOfPeople = jQuery('#num-people').val();

			app.vars.area = jQuery('#room-width').val() * jQuery('#room-height').val();

			app.setDoorVar(jQuery('input[name="door-count"]:checked').attr('value'), jQuery('#face-select').val(), jQuery('input[name="dfr"]:checked').attr('value'));
		}

		//app.generateDoors();

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	setDoorVar: function(num, dir, pos) {

		console.log('num: ' + num + ', dir: ' + dir + ', pos: ' + pos);
		console.log(app.vars.rows + ' : ' + app.vars.cols);

		// instantiate object
		for(var i = 1; i <= num; i++) {
			app.vars.doors[i] = {};
		}


		// create doors object
		for(var i = 1; i <= num; i++) {

			// door location
			switch(dir) {
				case '1':
					// Upper
					console.log('face top \n');
					app.vars.doors[i].x = 1;
					app.vars.doors[i].face = 'top';
					break;

				case '2':
					// Lower
					console.log('face bottom \n');
					app.vars.doors[i].x = app.vars.cols;
					app.vars.doors[i].face = 'bottom';
					break;

				case '3':
					// Left
					console.log('face left \n');
					app.vars.doors[i].y = 1;
					app.vars.doors[i].face = 'left';
					break;

				case '4':
					// Right
					console.log('face right \n');
					app.vars.doors[i].y = app.vars.rows;
					app.vars.doors[i].face = 'right';
					break;
			}

			// door position
			switch(pos) {
				case '1':
					// Top
					if (i == 1) {
						app.vars.doors[i].x = 1;
					} else {
						app.vars.doors[i].x = 2;
					}
					break;

				case '2':
					// Bottom
					if (i == 1) {
						app.vars.doors[i].x = app.vars.cols;
					} else {
						app.vars.doors[i].x = app.vars.cols - 1;
					}
					break;

				case '3':
					// Left
					if (i == 1) {
						app.vars.doors[i].y = 1;
					} else {
						app.vars.doors[i].y = 2;
					}
					break;

				case '4':
					// Right
					if (i == 1) {
						app.vars.doors[i].y = app.vars.rows;
					} else {
						app.vars.doors[i].y = app.vars.rows - 1;
					}
					break;

				case '5':
					// Center
					if(dir == '1' || dir == '2') {
						if (i == 1) {
							app.vars.doors[i].y = Math.floor(app.vars.rows / 2);
						} else {
							app.vars.doors[i].y = Math.floor(app.vars.rows / 2) + 1;
						}

						if(dir == '1') {
							app.vars.doors[i].face = 'top';
						} else {
							app.vars.doors[i].face = 'bottom';
						}

					} else if(dir == '3' || dir == '4') {
						if (i == 1) {
							app.vars.doors[i].x = Math.floor(app.vars.cols / 2);
						} else {
							app.vars.doors[i].x = Math.floor(app.vars.cols / 2) + 1;
						}

						if(dir == '3') {
							app.vars.doors[i].face = 'left';
						} else {
							app.vars.doors[i].face = 'right';
						}
					}
					break;
			}
		}

	},

	generateDoors: function() {
		let mid;

		if(app.vars.rows > 2) {
			mid = app.vars.rows / 2;
		} else {
			mid = 1;
		}

		app.vars.doors[1].x = mid;
		app.vars.doors[1].y = app.vars.cols;

		app.vars.doors[2].x = mid + 1;
		app.vars.doors[2].y = app.vars.cols;
	},

	renderForm: function(cbf) {
		/*jQuery('#main-content #number').append('<div id="classroom"></div');*/

		// Add play/start button
		playBtn = '<div class="play-btn-holder"> \
						<a href="javascript:;" class="play-btn">Start / Pause</a> \
						<a href="javascript:;" class="stop-btn">Stop / Reset</a> \
					</div>';

		formHtml = '<div class="form-holder"> \
						<form method="get" action=""> \
							<p>Room Settings:</p> \
							<div class="f-group"> \
								<div class="f-control"> \
									<label for="room-width">Width: (meters)</label> \
								</div> \
								<div class="f-control"> \
									<input type="number" id="room-width"> \
								</div> \
							</div> \
							<div class="f-group"> \
								<div class="f-control"> \
									<label for="room-height">Length: (meters)</label> \
								</div> \
								<div class="f-control"> \
									<input type="number" id="room-height"> \
								</div> \
							</div> \
							<div class="f-group"> \
								<div class="f-control"> \
									<label for="min-num-people"># of people:</label> \
								</div> \
								<div class="f-control"> \
									<input type="number" id="num-people"> \
								</div> \
							</div> \
							<div class="f-group"> \
								<div class="f-control"> \
									<label for="doof-info">Door</label> \
								</div> \
								<div class="f-control"> \
									<div class="door-num"> \
										<p> \
											<label for="dc-one"> \
												<input type="radio" name="door-count" value="1" id="dc-one"> 1 Door \
											</label> \
										</p> \
										<p> \
											<label for="dc-two"> \
												<input type="radio" name="door-count" value="2" id="dc-two"> 2 Doors \
											</label> \
										</p> \
									</div> \
									<div class="door-face"> \
										<div class="df-select"> \
											<select name="face-select" id="face-select"> \
												<option value="1">Upper</option> \
												<option value="2">Lower</option> \
												<option value="3">Left</option> \
												<option value="4">Right</option> \
											</select> \
										</div> \
										<div class="df-radio"> \
											<label for="dfrt"> \
												<input type="radio" name="dfr" value="1" id="dfrt"> Top \
											</label> \
											<label for="dfrb"> \
												<input type="radio" name="dfr" value="2" id="dfrb"> Bottom \
											</label> \
											<label for="dfrl"> \
												<input type="radio" name="dfr" value="3" id="dfrl"> Left \
											</label> \
											<label for="dfrr"> \
												<input type="radio" name="dfr" value="4" id="dfrr"> Right \
											</label> \
											<label for="dfrc"> \
												<input type="radio" name="dfr" value="5" id="dfrc"> Center \
											</label> \
										</div> \
									</div> \
								</div> \
							</div> \
							<div class="f-group"> \
								<a href="javascript:;" class="draw-btn">Draw Room</a> \
							</div> \
						</form> \
						<div class="lower-box"> \
							<div class="timer-holder"> \
								<div class="timer"> \
									<h3>Timer Lapsed</h3> \
									<p><span id="stop-watch">00:00:00</span></p> \
								</div> \
							</div> \
							<div class="btns-holder"> \
								<a href="javascript:;" class="play-btn">Start</a> \
								<a href="javascript:;" class="stop-btn">Stop</a> \
							</div> \
						</div> \
					</div>';

		jQuery('#main-content').append(formHtml);

		jQuery('.draw-btn').on('click', function() {

			app.setVars(function() {
				app.drawRoom(function() {
					jQuery('.form-holder').remove();
					app.addDoors(app.addPeople());
					/*app.addDoors(app.move.getExitDoor());*/
				});

				app.init(app.sortPeople(app.move.getExitDoor()));

				/*app.timer();*/
			});
		});

		jQuery('.play-btn').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			/*app.init(app.movePerson);*/
			app.move.movePerson();

			app.timer();
		});

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	drawRoom: function(c) {

		jQuery('#main-box').html('');

		var room = '<div id="number"></div> \
						<div id="area"></div> \
						<div id="classroom"> \
							<ul class="classroom-wrap"> \
							</ul> \
						</div>';

		jQuery('#main-box').append(room);

		jQuery('#classroom').css({
			width: app.vars.boxDim * app.vars.cols,
			height: app.vars.boxDim * app.vars.rows
		});

		for(var j = 1; j <= app.vars.rows; j++) {
			for(var i = 1; i <= app.vars.cols; i++) {
				jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ app.vars.boxDim +'px; height:'+ app.vars.boxDim +'px;"><span class="item"></span></li>').appendTo('.classroom-wrap');
			}
		}

		jQuery('#area').html('Area: ' + app.vars.area + ' sq. m.');

		if(typeof c == 'function') {
			c.call(this);
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

		/*var minPeople = app.vars.minPeople;
		var maxPeople = app.vars.maxPeople;
		var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);*/

		var currPeople = app.vars.numOfPeople;

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

		app.getPeople();

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

			var x, y, startY, endY, startX, endX, label;

			// jQuery('.play-btn').on('click', function() {

				app.vars.startMove = setInterval(function() {

					app.vars.numOfPeopleToMove = app.vars.sortedPeople.length;

					if(app.vars.numOfPeopleToMove > 0) {

						app.vars.maxSteps = app.vars.sortedPeople[app.vars.numOfPeopleToMove - 1].steps;

						console.log(app.vars.currPerson);

						startY = app.vars.sortedPeople[app.vars.currPerson].currRow,
						endY = app.vars.sortedPeople[app.vars.currPerson].endRow,
						startX = app.vars.sortedPeople[app.vars.currPerson].currCol,
						endX = app.vars.sortedPeople[app.vars.currPerson].endCol,
						label = app.vars.sortedPeople[app.vars.currPerson].num;

						app.move.getDirection(startY, endY, startX, endX, label, app.vars.currPerson);

						app.vars.currPerson++;

						if(app.vars.currPerson == app.vars.numOfPeopleToMove) {
							app.vars.currPerson = 0;
							app.vars.currStep = app.vars.currStep + 1;
						}

					} else {
						clearInterval(app.vars.startMove);
						app.timer.Timer.stop();
					}

				}, app.vars.timeInter);

			// });




				// for(var i = 0; i < numOfPeople; i++) {

				// 	var startY = app.vars.sortedPeople[i].startRow,
				// 		endY = app.vars.sortedPeople[i].endRow,
				// 		startX = app.vars.sortedPeople[i].startCol,
				// 		endX = app.vars.sortedPeople[i].endCol,
				// 		label = app.vars.sortedPeople[i].num

				// 		app.move.getDirection(startY, endY, startX, endX, label);
				// }



				/*app.vars.startMove = setInterval(function() {
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

				}, app.vars.timeInter);*/
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

			app.vars.sortedPeople.splice(id, 1);
			app.vars.currPerson = -1;

			console.log(app.vars.currPerson);

			if(typeof cbf == 'function') {
				cbf.call(this);
			}			
		},

		moveUp: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

				app.move.updatePeopleList((currRow-1), endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveRight: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').addClass('people').find('span.item').html(person);

				app.move.updatePeopleList(currRow, endRow, (currCol+1), endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveDown: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

				app.move.updatePeopleList((currRow+1), endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		moveLeft: function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').hasClass('people')) {

				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').addClass('people').find('span.item').html(person);

				app.move.updatePeopleList(currRow, endRow, (currCol-1), endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		},

		updatePeopleList: function(currRow, endRow, currCol, endCol, person, id) {
			app.vars.sortedPeople[id].currRow = currRow;
			app.vars.sortedPeople[id].currCol = currCol;
		}
	},

	timer: function() {
		
			// Stopwatch element on the page
			var $stopwatch;

			// Timer speed in milliseconds
			var incrementTime = 70;

			// Current timer position in milliseconds
			var currentTime = 0;

			// Start the timer
			jQuery(function() {
				$stopwatch = jQuery('#stop-watch');
				app.timer.Timer = jQuery.timer(updateTimer, incrementTime, true);  
			});

			// Output time and increment
			function updateTimer() {
				var timeString = formatTime(currentTime);
				$stopwatch.html(timeString);
				currentTime += incrementTime;
			}

			// Reset timer
			this.resetStopwatch = function() {
				currentTime = 0;
				app.timer.Timer.stop().once();
			};

			function pad(number, length) {
				var str = '' + number;
				while (str.length < length) {str = '0' + str;}
				return str;
			}

			function formatTime(time) {
				time = time / 10;
				var min = parseInt(time / 6000),
					sec = parseInt(time / 100) - (min * 60),
					hundredths = pad(time - (sec * 100) - (min * 6000), 2);
				return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
			}
		
	}

}