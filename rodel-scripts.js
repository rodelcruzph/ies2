( function($) {

	jQuery(document).ready( function() {

		app.init();

	});

})();

var app = {
	vars: {
		boxDim: 25,
		rows: 0,
		cols: 0,
		doors: {},
		numOfPeople: 0,
		people: {},
		sortedPeople: [{}],
		timeInter: 800,
		dtd: {},
		currStep: 0,
		maxSteps: 0,
		startMove: '',
		currPerson: 0,
		numOfPeopleToMove: 0,
		area: 0,
		sameFace: false,
		ptd: [{}]
	},

	init: function(c) {

		app.renderForm();

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
		} else {

			if(jQuery('input[name="door-count"]:checked').val() == 2) {
				if(!jQuery('input[name="dfr-1"]').is(':checked')) {
					empty = true;
				}
			} else {
				if(!jQuery('input[name="dfr-2"]').is(':checked')) {
					empty = true;
				}
			}
		}


		if(empty == true) {
			alert('Please fill out form completely');
			return;
		} else {
			app.vars.cols = jQuery('#room-width').val() * 2;
			app.vars.rows = jQuery('#room-height').val() * 2;
			app.vars.numOfPeople = jQuery('#num-people').val();

			app.vars.area = jQuery('#room-width').val() * jQuery('#room-height').val();

			if(jQuery('input[name="door-count"]:checked').val() == 1) {
				app.setDoorVar(jQuery('input[name="door-count"]:checked').attr('value'), [[jQuery('#face-select-1').val(), jQuery('input[name="dfr-1"]:checked').val()]]);
			} else {
				app.setDoorVar(jQuery('input[name="door-count"]:checked').attr('value'), [[jQuery('#face-select-1').val(), jQuery('input[name="dfr-1"]:checked').val()], [jQuery('#face-select-2').val(), jQuery('input[name="dfr-2"]:checked').val()]]);
			}


		}

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	setDoorVar: function(num, param) {

		var dir, pos;

		// instantiate object
		for(var i = 1; i <= num; i++) {
			app.vars.doors[i] = {};
		}

		// create doors object
		for(var i = 1; i <= num; i += 2) {

			if(num > 2) {
				if(i == 1) {
					if(param[i-1][0] == param[i][0] && param[i-1][1] == param[i][1]) {
						app.vars.sameFace = true;
					}
				}
			}

			if(i == 1) {
				dir = param[i-1][0];
				pos = param[i-1][1]
			} else {
				dir = param[1][0];
				pos = param[1][1];
			}

			// door location
			switch(dir) {

				case '1':
					// Upper
					// console.log('face top \n');
					app.vars.doors[i].x = 1;
					app.vars.doors[i+1].x = 1;

					app.vars.doors[i].face = 'top';
					app.vars.doors[i+1].face = 'top';
					break;

				case '2':
					// Lower
					// console.log('face bottom \n');
					app.vars.doors[i].x = app.vars.rows;
					app.vars.doors[i+1].x = app.vars.rows;

					app.vars.doors[i].face = 'bottom';
					app.vars.doors[i+1].face = 'bottom';
					break;

				case '3':
					// Left
					// console.log('face left \n');
					app.vars.doors[i].y = 1;
					app.vars.doors[i+1].y = 1;

					app.vars.doors[i].face = 'left';
					app.vars.doors[i+1].face = 'left';
					break;

				case '4':
					// Right
					// console.log('face right \n');
					app.vars.doors[i].y = app.vars.cols;
					app.vars.doors[i+1].y = app.vars.cols;

					app.vars.doors[i].face = 'right';
					app.vars.doors[i+1].face = 'right';
					break;
			} /* switch door location */

			// door position
			switch(pos) {

				case '1':
					// Top
					if (!app.vars.sameFace) {
						app.vars.doors[i].x = 1;
						app.vars.doors[i+1].x = 2;
					} else {
						if (i == 1) {
							app.vars.doors[i].x = 1;
							app.vars.doors[i+1].x = 2;
						} else {
							app.vars.doors[i].x = 3;
							app.vars.doors[i+1].x = 4;
						}
					}
					break;

				case '2':
					// Bottom
					if (!app.vars.sameFace) {
						app.vars.doors[i].x = app.vars.rows;
						app.vars.doors[i+1].x = app.vars.rows - 1;
					} else {
						if (i == 1) {
							app.vars.doors[i].x = app.vars.rows;
							app.vars.doors[i+1].x = app.vars.rows - 1;
						} else {
							app.vars.doors[i].x = app.vars.rows - 2;
							app.vars.doors[i+1].x = app.vars.rows - 3;
						}
					}
					break;

				case '3':
					// Left
					if (!app.vars.sameFace) {
						app.vars.doors[i].y = 1;
						app.vars.doors[i+1].y = 2;
					} else {
						if (i == 1) {
							app.vars.doors[i].y = 1;
							app.vars.doors[i+1].y = 2;
						} else {
							app.vars.doors[i].y = 3;
							app.vars.doors[i+1].y = 4;
						}
					}
					break;

				case '4':
					// Right
					if (!app.vars.sameFace) {
						app.vars.doors[i].y = app.vars.cols;
						app.vars.doors[i+1].y = app.vars.cols - 1;
					} else {
						if (i == 1) {
							app.vars.doors[i].y = app.vars.cols;
							app.vars.doors[i+1].y = app.vars.cols - 1;
						} else {
							app.vars.doors[i].y = app.vars.cols - 2;
							app.vars.doors[i+1].y = app.vars.cols - 3;
						}
					}
					break;

				case '5':
					// Center
					if(dir == '1' || dir == '2') {
						if (!app.vars.sameFace) {
							app.vars.doors[i].y = Math.floor(app.vars.cols / 2);
							app.vars.doors[i+1].y = Math.floor(app.vars.cols / 2) + 1;
						} else {
							if (i == 1) {
								app.vars.doors[i].y = Math.floor(app.vars.cols / 2) - 1;
								app.vars.doors[i+1].y = Math.floor(app.vars.cols / 2);
							} else {
								app.vars.doors[i].y = Math.floor(app.vars.cols / 2) + 1;
								app.vars.doors[i+1].y = Math.floor(app.vars.cols / 2) + 2;
							}
						}

						if(dir == '1') {
							app.vars.doors[i].face = 'top';
							app.vars.doors[i+1].face = 'top';
						} else {
							app.vars.doors[i].face = 'bottom';
							app.vars.doors[i+1].face = 'bottom';
						}

					} else if(dir == '3' || dir == '4') {
						if (!app.vars.sameFace) {
							app.vars.doors[i].x = Math.floor(app.vars.rows / 2);
							app.vars.doors[i+1].x = Math.floor(app.vars.rows / 2) + 1;
						} else {
							if (i == 1) {
								app.vars.doors[i].x = Math.floor(app.vars.rows / 2) - 1;
								app.vars.doors[i+1].x = Math.floor(app.vars.rows / 2);
							} else {
								app.vars.doors[i].x = Math.floor(app.vars.rows / 2) + 1;
								app.vars.doors[i+1].x = Math.floor(app.vars.rows / 2) + 2;
							}
						}

						if(dir == '3') {
							app.vars.doors[i].face = 'left';
							app.vars.doors[i+1].face = 'left';
						} else {
							app.vars.doors[i].face = 'right';
							app.vars.doors[i+1].face = 'right';
						}
					}
					break;

			} /*switch door position*/


		} /*create doors object*/
	},

	setDoorVars: function(num, param) {

		// instantiate object
		for(var i = 1; i <= num; i++) {
			app.vars.doors[i] = {};
		}


		// create doors object
		for(var i = 1; i <= num; i++) {

			console.log(param[i-1][0] + " : " + param[i-1][1]);
			if(num > 1) {
				if(i == 1) {
					if(param[i-1][0] == param[i][0] && param[i-1][1] == param[i][1]) {
						app.vars.sameFace = true;
					}
				}
			}

			// door location
			switch(param[i-1][0]) {
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
			} /* switch door location */

			// door position
			switch(param[i-1][1]) {
				case '1':
					// Top
					if (!app.vars.sameFace) {
						app.vars.doors[i].x = 1;
					} else {
						if (i == 1) {
							app.vars.doors[i].x = 1;
						} else {
							app.vars.doors[i].x = 2;
						}
					}
					break;

				case '2':
					// Bottom
					if (!app.vars.sameFace) {
						app.vars.doors[i].x = app.vars.cols;
					} else {
						if (i == 1) {
							app.vars.doors[i].x = app.vars.cols;
						} else {
							app.vars.doors[i].x = app.vars.cols - 1;
						}
					}
					break;

				case '3':
					// Left
					if (!app.vars.sameFace) {
						app.vars.doors[i].y = 1;
					} else {
						if (i == 1) {
							app.vars.doors[i].y = 1;
						} else {
							app.vars.doors[i].y = 2;
						}
					}
					break;

				case '4':
					// Right
					if (!app.vars.sameFace) {
						app.vars.doors[i].y = app.vars.rows;
					} else {
						if (i == 1) {
							app.vars.doors[i].y = app.vars.rows;
						} else {
							app.vars.doors[i].y = app.vars.rows - 1;
						}
					}
					break;

				case '5':
					// Center
					if(param[i-1][0] == '1' || param[i-1][0] == '2') {
						if (!app.vars.sameFace) {
							app.vars.doors[i].y = Math.floor(app.vars.rows / 2);
						} else {
							if (i == 1) {
								app.vars.doors[i].y = Math.floor(app.vars.rows / 2);
							} else {
								app.vars.doors[i].y = Math.floor(app.vars.rows / 2) + 1;
							}
						}

						if(param[i-1][0] == '1') {
							app.vars.doors[i].face = 'top';
						} else {
							app.vars.doors[i].face = 'bottom';
						}

					} else if(param[i-1][0] == '3' || param[i-1][0] == '4') {
						if (!app.vars.sameFace) {
							app.vars.doors[i].x = Math.floor(app.vars.cols / 2);
						} else {
							if (i == 1) {
								app.vars.doors[i].x = Math.floor(app.vars.cols / 2);
							} else {
								app.vars.doors[i].x = Math.floor(app.vars.cols / 2) + 1;
							}
						}

						if(param[i-1][0] == '3') {
							app.vars.doors[i].face = 'left';
						} else {
							app.vars.doors[i].face = 'right';
						}
					}
					break;
			} /* switch door positiion */
		} /* end for */

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

		// Add form
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
							<div class="f-group door"> \
								<label for="doof-info">Door</label> \
								<div class="door-num"> \
									<p> \
										<label for="dc-one"> \
											<input type="radio" name="door-count" value="2" id="dc-one"> 1 Door \
										</label> \
									</p> \
									<p> \
										<label for="dc-two"> \
											<input type="radio" name="door-count" value="4" id="dc-two"> 2 Doors \
										</label> \
									</p> \
								</div> \
								<div class="f-control"> \
									<div class="door-face"> \
										<div class="df-select"> \
											<select name="face-select-1" id="face-select-1"> \
												<option value="1">Upper</option> \
												<option value="2">Lower</option> \
												<option value="3">Left</option> \
												<option value="4">Right</option> \
											</select> \
										</div> \
										<div class="df-radio"> \
											<label for="dfrt-1"> \
												<input type="radio" name="dfr-1" value="1" id="dfrt-1"> Top \
											</label> \
											<label for="dfrb-1"> \
												<input type="radio" name="dfr-1" value="2" id="dfrb-1"> Bottom \
											</label> \
											<label for="dfrl-1"> \
												<input type="radio" name="dfr-1" value="3" id="dfrl-1"> Left \
											</label> \
											<label for="dfrr-1"> \
												<input type="radio" name="dfr-1" value="4" id="dfrr-1"> Right \
											</label> \
											<label for="dfrc-1"> \
												<input type="radio" name="dfr-1" value="5" id="dfrc-1"> Center \
											</label> \
										</div> \
									</div> \
								</div> \
								<div class="f-control"> \
									<div class="door-face"> \
										<div class="df-select"> \
											<select name="face-select-2" id="face-select-2"> \
												<option value="1">Upper</option> \
												<option value="2">Lower</option> \
												<option value="3">Left</option> \
												<option value="4">Right</option> \
											</select> \
										</div> \
										<div class="df-radio"> \
											<label for="dfrt-2"> \
												<input type="radio" name="dfr-2" value="1" id="dfrt-2"> Top \
											</label> \
											<label for="dfrb-2"> \
												<input type="radio" name="dfr-2" value="2" id="dfrb-2"> Bottom \
											</label> \
											<label for="dfrl-2"> \
												<input type="radio" name="dfr-2" value="3" id="dfrl-2"> Left \
											</label> \
											<label for="dfrr-2"> \
												<input type="radio" name="dfr-2" value="4" id="dfrr-2"> Right \
											</label> \
											<label for="dfrc-2"> \
												<input type="radio" name="dfr-2" value="5" id="dfrc-2"> Center \
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
							</div> \
						</div> \
					</div>';

		jQuery('#main-content').append(formHtml);

		jQuery('.draw-btn').on('click', function() {

			app.setVars(function() {
				app.drawRoom(function() {
					jQuery('.form-holder').remove();
					app.addDoors(app.addPeople());
				});

				//app.init(app.sortPeople(app.move.getExitDoor()));

				app.init(app.sortPeople(app.getExitDoor()));

				app.makePeople();

				/*app.getNewExitDoor(function() {
					app.makePeople();
				});*/

				/*app.timer();*/
			});
		});

		jQuery('.play-btn').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			app.stopWatch.init();

			var i;

			for(i = 0; i < people.length; i++) {
				people[i].movePerson();
			}

			var globalInterval = setInterval(function() {
				if(!app.checkRoom()) {
					console.log('stop timer');
					app.stopWatch.stop();
					app.modifyTimer();
					clearInterval(globalInterval);
				}
			}, app.vars.timeInter);
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

		var currPeople = app.vars.numOfPeople;

		jQuery('#number').text(currPeople + ' people');

		var randomElements = jQuery("li").get().sort(function(){
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		for(var i = 0; i < randomElements.length; i++) {
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

				people[i-1] = new person();

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
			numOfPeople = Object.keys(app.vars.people).length,
			j = 0;

		for(j = 0; j < numOfPeople; j++) {

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

			/*people[k].startCol	= app.vars.people[k+1].colCoords;
			people[k].endCol	= app.vars.dtd[k+1].col;
			people[k].startRow	= app.vars.people[k+1].rowCoords;
			people[k].endRow		= app.vars.dtd[k+1].row;
			people[k].num		= app.vars.people[k+1].num;
			people[k].steps		= Math.abs(app.vars.people[k+1].rowCoords - app.vars.dtd[k+1].row) + Math.abs(app.vars.people[k+1].colCoords - app.vars.dtd[k+1].col);
			people[k].currCol	= app.vars.people[k+1].colCoords;
			people[k].currRow	= app.vars.people[k+1].rowCoords;*/
		}

		app.vars.sortedPeople.sort(function(a, b) {
			return (a.steps) - (b.steps);
		});

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	getExitDoor: function(c) {
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

		if(typeof c == 'function') {
			c.call(this);
		}
	},

	getNewExitDoor: function(c) {

		var numOfDoors = Object.keys(app.vars.doors).length,
			totalPeople = 0,
			getNumPeople = [], // total number of people per door
			getFrom = [],
			addTo = [];

		for(var i = 0; i < numOfDoors; i++) {
			app.vars.ptd[i] = jQuery.grep(app.vars.sortedPeople, function(el) {
						return el.endRow == app.vars.doors[i+1].x && el.endCol == app.vars.doors[i+1].y;
					});
		}

		// console.log(app.vars.ptd.length);

		if (app.vars.ptd.length < 3) {
			for(var i = 0; i <= app.vars.ptd.length - 2; i++) {

				var k = i * 2;

				// check which door tile has more people
				if (app.vars.ptd[k].length > app.vars.ptd[k+1].length) {
					getFrom[i] = k;
				} else {
					getFrom[i] = k+1;
				}
			}
		} else {
			for(var i = 0; i < app.vars.ptd.length - 2; i++) {

				var k = i * 2;

				// check which door tile has more people
				if (app.vars.ptd[k].length > app.vars.ptd[k+1].length) {
					getFrom[i] = k;
				} else {
					getFrom[i] = k+1;
				}
			}
		}



		console.log(getFrom);

		if (app.vars.ptd.length < 3) {
			for(var i = 0; i <= app.vars.ptd.length - 2; i++) {

				var k = i * 2,
					j = getFrom[i];

				totalPeople = Math.ceil((app.vars.ptd[k].length + app.vars.ptd[k+1].length) / 2 );

				getNumPeople[i] = app.vars.ptd[j].length - totalPeople;
			}
		} else {
			for(var i = 0; i < app.vars.ptd.length - 2; i++) {

				var k = i * 2,
					j = getFrom[i];

				totalPeople = Math.ceil((app.vars.ptd[k].length + app.vars.ptd[k+1].length) / 2 );

				getNumPeople[i] = app.vars.ptd[j].length - totalPeople;
			}
		}



		console.log(getNumPeople);

		for(var i = 0; i < getNumPeople.length; i++) {

			/*for(var j = getNumPeople.length - 1; j > 0; j--) {

				var index = app.vars.sortedPeople.map(function(o) { return o.num; }).indexOf(app.vars.ptd[getFrom[i]][j].num);

				app.vars.sortedPeople[index].endRow = app.vars.doors[i+1].x;
				app.vars.sortedPeople[index].endCol = app.vars.doors[i+1].y;

			}*/

			for(var j = (app.vars.ptd[getFrom[i]].length - 1); j > (app.vars.ptd[getFrom[i]].length - 1) - getNumPeople[i]; j--) {

				var index = app.vars.sortedPeople.map(function(o) { return o.num; }).indexOf(app.vars.ptd[getFrom[i]][j].num);

				app.vars.sortedPeople[index].endRow = app.vars.doors[i + 1].x;
				app.vars.sortedPeople[index].endCol = app.vars.doors[i + 1].y;

			}

		}

		/*var index = peoples.map(function(o) { return o.attr1; }).indexOf("john");
		console.log("index of 'john': " + index);*/

		/*
		app.vars.ptd[0].length > app.vars.ptd[1].length;

		app.vars.ptd[2].length < app.vars.ptd[3].length;

		Math.floor((app.vars.ptd[0].length + app.vars.ptd[1].length) / 2);

		Math.floor((app.vars.ptd[2].length + app.vars.ptd[3].length) / 2);

		2, 11, 1, 7



		1. add total of both ptd
		2. divide total by 2, round up
		3. total = get the remainder
		4. get total number of objects starting from end of the larger ptd
		5. change endRow and endCol of the retrieved objects equal to endRow and endCol of lower ptd
		*/

		if(typeof c == 'function') {
			c.call(this);
		}

	},

	makePeople: function(cbf) {
		var exitDoors = Object.keys(app.vars.dtd).length,
			numOfPeople = Object.keys(app.vars.people).length,
			k = 0;

		for(k = 0; k < numOfPeople; k++) {

			/*app.vars.sortedPeople[j] = {
				'startCol': app.vars.people[j+1].colCoords,
				'endCol': app.vars.dtd[j+1].col,
				'startRow': app.vars.people[j+1].rowCoords,
				'endRow': app.vars.dtd[j+1].row,
				'num': app.vars.people[j+1].num,
				'steps': Math.abs(app.vars.people[j+1].rowCoords - app.vars.dtd[j+1].row) + Math.abs(app.vars.people[j+1].colCoords - app.vars.dtd[j+1].col),
				'currCol': app.vars.people[j+1].colCoords,
				'currRow': app.vars.people[j+1].rowCoords
			}*/

			people[k].startCol	= app.vars.sortedPeople[k].startCol;
			people[k].endCol	= app.vars.sortedPeople[k].endCol;
			people[k].startRow	= app.vars.sortedPeople[k].startRow;
			people[k].endRow	= app.vars.sortedPeople[k].endRow;
			people[k].num		= app.vars.sortedPeople[k].num;
			people[k].steps		= Math.abs(app.vars.sortedPeople[k].startCol - app.vars.sortedPeople[k].endCol) + Math.abs(app.vars.sortedPeople[k].startRow - app.vars.sortedPeople[k].endRow);
			people[k].currCol	= app.vars.sortedPeople[k].currCol;
			people[k].currRow	= app.vars.sortedPeople[k].currRow;
		}

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	stopWatch: {
		vars: {
			h1: '',
			seconds: 0,
			minutes: 0,
			hours: 0,
			t: 0
		},

		init: function() {
			app.stopWatch.vars.h1 = jQuery('#stop-watch')[0];
			app.stopWatch.start();
		},

		add: function() {

			app.stopWatch.vars.seconds++;
			if (app.stopWatch.vars.seconds >= 60) {
					app.stopWatch.vars.seconds = 0;
					app.stopWatch.vars.minutes++;
					if (app.stopWatch.vars.minutes >= 60) {
							app.stopWatch.vars.minutes = 0;
							app.stopWatch.vars.hours++;
					}
			}

			app.stopWatch.vars.h1.textContent = (app.stopWatch.vars.hours ? (app.stopWatch.vars.hours > 9 ? app.stopWatch.vars.hours : "0" + app.stopWatch.vars.hours) : "00") + ":" + (app.stopWatch.vars.minutes ? (app.stopWatch.vars.minutes > 9 ? app.stopWatch.vars.minutes : "0" + app.stopWatch.vars.minutes) : "00") + ":" + (app.stopWatch.vars.seconds > 9 ? app.stopWatch.vars.seconds : "0" + app.stopWatch.vars.seconds);

			app.stopWatch.start();
		},

		start: function() {
			app.stopWatch.vars.t = setTimeout(app.stopWatch.add, 1000);
		},

		stop: function() {
			clearTimeout(app.stopWatch.vars.t);
		}
	},

	timers: function() {
		var h1 = jQuery('#stop-watch')[0],
				seconds = 0, minutes = 0, hours = 0, t;

		function add() {
			console.log(seconds);
		    seconds++;
		    if (seconds >= 60) {
		        seconds = 0;
		        minutes++;
		        if (minutes >= 60) {
		            minutes = 0;
		            hours++;
		        }
		    }

		    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

		    timer();
		}
		function timer() {
		    t = setTimeout(add, 1000);
		}
		timer();

		function stop() {
			clearTimeout(t);
		}
	},

	timerOld: function() {

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

	},

	checkRoom: function() {
		if(jQuery('.classroom-wrap li').hasClass('people')) {
			return true;
		} else {
			return false;
		}
	},

	modifyTimer: function() {
		var currTime = jQuery('#stop-watch').html(),
			currHr = currTime.substr(0, 2),
			currMin = currTime.substr(3, 2),
			currSec = currTime.substr(6, 2),
			newSec, newMin, newTime;

			// timeSep = currTime.indexOf(":");
			//
			// currSec = parseInt(currTime.substr(timeSep+1, 2));

			newSec = parseInt(currSec) + 45;

			if(newSec > 59) {

				// Get minutes
				newMin = Math.floor(newSec / 60);
				newSec = newSec % 60;

				if(newMin <= 9 ) {
					newMin = "0" + newMin;
				}

				if(newSec <= 9) {
					newSec = "0" + newSec;
				}

			} else {
				newMin = currMin;
			}

			jQuery('.timer').append('<p>+ 45 seconds</p><hr /><p>' + currHr + ':' + newMin + ':' + newSec + '</p>');
	}

}

function person(startCol, endCol, startRow, endRow, num, steps,currCol, currRow) {

	this.startCol = 0;
	this.endCol = 0;
	this.startRow = 0;
	this.endRow = 0;
	this.num = 0;
	this.steps = 0;
	this.currCol = 0;
	this.currRow = 0;
	this.currStep = 0;
	this.startMove = '';

	this.movePerson = function() {

		var parent = this;

		this.startMove = setInterval(function() {
			var gparent = parent;

			/*if(gparent.currStep <= gparent.steps) {*/

			if(app.checkRoom()) {

				gparent.getDirection(gparent.currRow, gparent.endRow, gparent.currCol, gparent.endCol, gparent.num);

			} else {
				clearInterval(this.startMove);
			}

		}, app.vars.timeInter);

		/*if(parent.currStep <= parent.steps) {
			parent.getDirection(parent.currRow, parent.endRow, parent.currCol, parent.endCol, parent.num);
		}*/

		/*this.startMove = setInterval(function() {

			var gparent = parent;

			if(gparent.currStep < gparent.steps) {
				gparent.getDirection(gparent.currRow, gparent.endRow, gparent.currCol, gparent.endCol, gparent.num);
			}

		}, app.vars.timeInter);*/

		// var x, y, startY, endY, startX, endX, label;

			/*this.startMove = setInterval(function() {

				console.log(parent.parent.currStep);

				if(this.currStep < this.step) {

					startY = this.currRow,
					endY = this.endRow,
					startX = this.currCol,
					endX = this.endCol,
					label = this.num;

					//this.getDirection(startY, endY, startX, endX, label, app.vars.currPerson);
					console.log('call getDirection');

				} else {
					clearInterval(this.startMove);
					this.timer.Timer.stop();
				}

			}, app.vars.timeInter);*/

	};

	this.allowedDirection = function(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, dir) {
		/* Select movement direction */

		if(dir == 1) {
			if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
				this.moveUp(currRow, endRow, currCol, endCol, person, id);
			} else {
				if(moveSecondary == 2) {
					if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
						this.moveRight(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				} else if(moveSecondary == 4) {
					if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
						this.moveLeft(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				}
			}
		} else if(dir == 2) {
			if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
				this.moveRight(currRow, endRow, currCol, endCol, person, id);
			} else {
				if(moveSecondary == 1) {
					if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
						this.moveUp(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				} else if(moveSecondary == 3) {
					if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
						this.moveDown(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				}
			}
		} else if(dir == 3) {
			if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
				this.moveDown(currRow, endRow, currCol, endCol, person, id);
			} else {
				if(moveSecondary == 2) {
					if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
						this.moveRight(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				} else if(moveSecondary == 4) {
					if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
						this.moveLeft(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				}
			}
		} else if(dir == 4) {
			if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
				this.moveLeft(currRow, endRow, currCol, endCol, person, id);
			} else {
				if(moveSecondary == 1) {
					if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
						this.moveUp(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				} else if(moveSecondary == 3) {
					if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
						this.moveDown(currRow, endRow, currCol, endCol, person, id);
					} else {
						// console.log('pass');
					}
				}
			}
		}

		/*if(movePrimary == 1 && moveSecondary == 2 && dir == 1) {
			if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
				console.log('up');
				this.moveUp(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
				console.log('right');
				this.moveRight(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 1 && moveSecondary == 4) {
			if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
				console.log('up');
				this.moveUp(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
				console.log('left');
				this.moveLeft(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 3 && moveSecondary == 2) {
			if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
				console.log('down');
				this.moveDown(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
				console.log('right');
				this.moveRight(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 3 && moveSecondary == 4) {
			if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
				console.log('down');
				this.moveDown(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
				console.log('left');
				this.moveLeft(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 2 && moveSecondary == 1) {
			if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
				console.log('right');
				this.moveRight(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
				console.log('up');
				this.moveUp(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 2 && moveSecondary == 3) {
			if(this.checkRight(currRow, endRow, currCol, endCol, person, id)) {
				console.log('right');
				this.moveRight(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
				console.log('down');
				this.moveDown(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 4 && moveSecondary == 1) {
			if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
				console.log('left');
				this.moveLeft(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkUp(currRow, endRow, currCol, endCol, person, id)) {
				console.log('up');
				this.moveUp(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		} else if(movePrimary == 4 && moveSecondary == 3) {
			if(this.checkLeft(currRow, endRow, currCol, endCol, person, id)) {
				console.log('left');
				this.moveLeft(currRow, endRow, currCol, endCol, person, id);
			} else if(this.checkDown(currRow, endRow, currCol, endCol, person, id)) {
				console.log('down');
				this.moveDown(currRow, endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}
		}*/
	},

	this.getDirection = function(currRow, endRow, currCol, endCol, person, id, cbf) {
			var totalHorz = Math.abs(currCol - endCol),
				totalVert = Math.abs(currRow - endRow),
				movePrimary = 0, moveSecondary = 0;

			/* Check Primary and Secondary moves */
			if (endRow == 1) {
				movePrimary = 1;
				if(endCol == 1 || endCol == 2) {
					moveSecondary = 4;
				} else if(endCol == app.vars.cols || endCol == app.vars.cols - 1) {
					moveSecondary = 2;
				}
			} else if (endRow == app.vars.rows) {
				movePrimary = 3;
				if(endCol == 1 || endCol == 2) {
					moveSecondary = 4;
				} else if(endCol == app.vars.cols || endCol == app.vars.cols - 1) {
					moveSecondary = 2;
				}
			} else if (endCol == 1) {
				movePrimary = 4;
				if (endRow == 1 || endRow == 2) {
					moveSecondary = 1;
				} else if (endRow == app.vars.rows || endRow == app.vars.rows -1) {
					moveSecondary = 3;
				}
			} else if (endCol == app.vars.cols) {
				movePrimary = 2;
				if (endRow == 1 || endRow == 2) {
					moveSecondary = 1;
				} else if (endRow == app.vars.rows || endRow == app.vars.rows -1) {
					moveSecondary = 3;
				}
			}



			if (endRow == 1) {
				if(currCol == endCol && currRow == endRow) {
					this.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currRow > endRow) {

					// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
					this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);

					/*this.moveUp(currRow, endRow, currCol, endCol, person, id);*/
				} else if(currCol < endCol) {
					if(totalVert == 0) {

						/*this.moveRight(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
					} else {

						/*this.moveRight(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
					}
				} else {
					if(totalVert == 0) {

						/*this.moveLeft(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
					} else {

						/*this.moveLeft(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
					}
				}
			} else if (endRow == app.vars.rows) {
				if(currCol == endCol && currRow == endRow) {
					this.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if (currRow < endRow) {

					/*this.moveDown(currRow, endRow, currCol, endCol, person, id);*/
					// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
					this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
				} else if(currCol < endCol) {
					if (totalVert == 0) {

						/*this.moveRight(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
					} else {

						/*this.moveRight(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
					}
				} else {
					if (totalVert == 0) {

						/*this.moveLeft(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
					} else {

						/*this.moveLeft(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
					}
				}
			} else if (endCol == 1) {
				if(currCol == endCol && currRow == endRow) {
					this.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currCol > endCol) {

					/*this.moveLeft(currRow, endRow, currCol, endCol, person, id);*/
					// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
					this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 4);
				} else if(currRow < endRow) {
					if (totalHorz == 0) {

						/*this.moveDown(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
					} else {

						/*this.moveDown(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
					}
				} else {
					if (totalHorz == 0) {

						/*this.moveUp(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
					} else {

						/*this.moveUp(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
					}
				}
			} else if (endCol == app.vars.cols) {
				if(currCol == endCol && currRow == endRow) {
					this.moveExit(currRow, endRow, currCol, endCol, person, id);
				} else if(currCol < endCol) {

					/*this.moveRight(currRow, endRow, currCol, endCol, person, id);*/
					// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);
					this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 2);

				} else if(currRow < endRow) {
					if (totalHorz == 0) {

						/*this.moveDown(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
					} else {

						/*this.moveDown(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 3);
					}
				} else {
					if (totalHorz == 0) {
						/*this.moveUp(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
					} else {
						/*this.moveUp(currRow, endRow, currCol, endCol, person, id);*/
						// console.log(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
						this.allowedDirection(currRow, endRow, currCol, endCol, person, id, movePrimary, moveSecondary, 1);
					}
				}
			}
		};

		this.moveExit = function(currRow, endRow, currCol, endCol, person, id, cbf) {

			jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');

			/*app.vars.sortedPeople.splice(id, 1);
			app.vars.currPerson = -1;*/

			// Delete object

			people = jQuery.grep(people, function(el) {
				return el.num != person;
			});

			// console.log(person);

			/*if(people.length > 0) {
				people.splice((person - 1), 1);
			} else {
				app.timer.Timer.stop();
			}*/

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		};

		this.checkUp = function(currRow, endRow, currCol, endCol, person, id, cbf) {
			if(!jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').hasClass('people')) {
				return true;
			} else {
				return false;
			}
		};

		this.moveUp = function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + (currRow-1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

				this.updatePeopleList((currRow-1), endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		};

		this.checkRight = function(currRow, endRow, currCol, endCol, person, id, cbf) {
			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').hasClass('people')) {
				return true;
			} else {
				return false;
			}
		};

		this.moveRight = function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol+1) + ']').addClass('people').find('span.item').html(person);

				this.updatePeopleList(currRow, endRow, (currCol+1), endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		};

		this.checkDown = function(currRow, endRow, currCol, endCol, person, id, cbf) {
			if(!jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').hasClass('people')) {
				return true;
			} else {
				return false;
			}
		};

		this.moveDown = function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').hasClass('people')) {
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + (currRow+1) + '][data-col=' + currCol + ']').addClass('people').find('span.item').html(person);

				this.updatePeopleList((currRow+1), endRow, currCol, endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		};

		this.checkLeft = function(currRow, endRow, currCol, endCol, person, id, cbf) {
			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').hasClass('people')) {
				return true;
			} else {
				return false;
			}
		},

		this.moveLeft = function(currRow, endRow, currCol, endCol, person, id, cbf) {

			if(!jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').hasClass('people')) {

				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + currCol + ']').removeClass('people').find('span.item').html('');
				jQuery('.classroom-wrap li[data-row=' + currRow + '][data-col=' + (currCol-1) + ']').addClass('people').find('span.item').html(person);

				this.updatePeopleList(currRow, endRow, (currCol-1), endCol, person, id);
			} else {
				console.log('pass');
			}

			if(typeof cbf == 'function') {
				cbf.call(this);
			}
		};

		this.updatePeopleList = function(currRow, endRow, currCol, endCol, person, id) {

			this.currRow = currRow;
			this.currCol = currCol;
			this.currStep += 1;

			/*app.vars.sortedPeople[id].currRow = currRow;
			app.vars.sortedPeople[id].currCol = currCol;*/
		};
}

var people = [];
