// var boxDim = 50;
// var rows = 5;
// var cols = 7;

( function() {
	
	jQuery(document).ready( function() {
		
		// divideArea();
		// drawRoom();
		
		// function divideArea(){
			
		// 	var x = ( jQuery('#classroom').width() ) / boxDim;
		// 	var y = ( jQuery('#classroom').height() ) / boxDim;
		// 	var insertLi = x * y;

		// 	for(var i =1; i<= insertLi; i++){

		// 		jQuery('<li id="r'+i+'" class="tileBox" style="width:'+ boxDim +'px; height:'+ boxDim +'px;"></li>').appendTo('.classroom-wrap');
				
		// 	}
		// 	addPeople();
		// }


		// function addPeople() {
		// 	jQuery(".classroom-wrap li:nth-last-child(2), .classroom-wrap li:last-child").addClass('door');

		// 	var minPeople = 15;
		// 	var maxPeople = rows * cols;
		// 	var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
		// 	jQuery('#number').text(currPeople + ' people');

		// 	var people = "<span class='people-item'></span>",
		// 		randomElements = jQuery("li").get().sort(function(){ 
		// 		  return Math.round(Math.random())-0.5
		// 		}).slice(0,currPeople);

		// 	jQuery(randomElements).addClass('people');
		// 	jQuery('.people').append(people);
			
		// }


		// function addPerson() {
		// 	var people = "<span class='people-item'></span>",
		// 		rowCoor = 3,
		// 		colCoor = 6;

		// 	jQuery('.classroom-wrap li').each(function() {
		// 		if(jQuery(this).data('row') == rowCoor && jQuery(this).data('col') == colCoor) {
		// 			jQuery(this).addClass('people');
		// 		}
		// 	});

		// 	jQuery('.people').append(people);
		// }

		// function drawRoom() {

		// 	jQuery('#classroom').css({
		// 		width: boxDim * cols,
		// 		height: boxDim * rows
		// 	});

		// 	for(var j = 1; j <= rows; j++) {
		// 		for(var i = 1; i <= cols; i++) {
		// 			jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ boxDim +'px; height:'+ boxDim +'px;"></li>').appendTo('.classroom-wrap');
		// 		}
		// 	}

		// 	addPeople();
		// 	addPerson();
		// }

		app.init();

	});
	
})();

var app = {
	vars: {
		boxDim: 50,
		rows: 5,
		cols: 6,
		people: {}
	},

	init: function() {
		app.drawRoom();
		//app.getPeople();
	},

	drawRoom: function() {
		jQuery('#classroom').css({
			width: app.vars.boxDim * app.vars.cols,
			height: app.vars.boxDim * app.vars.rows
		});

		for(var j = 1; j <= app.vars.rows; j++) {
			for(var i = 1; i <= app.vars.cols; i++) {
				jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ app.vars.boxDim +'px; height:'+ app.vars.boxDim +'px;"></li>').appendTo('.classroom-wrap');
			}
		}

		//app.addPerson();
		app.addPeople();
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

	addPeople: function() {
		jQuery(".classroom-wrap li:nth-last-child(2), .classroom-wrap li:last-child").addClass('door');

		var minPeople = 15;
		var maxPeople = app.vars.rows * app.vars.cols;
		var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
		jQuery('#number').text(currPeople + ' people');

		var people = "<span class='people-item'></span>",
			randomElements = jQuery("li").get().sort(function(){ 
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		jQuery(randomElements).addClass('people');
		jQuery('.people').append(people);

		app.getPeople();
	},

	getPeople: function() {
		var i = 1;

		jQuery('.classroom-wrap li').each(function() {
			if(jQuery(this).hasClass('people')) {
				app.vars.people[i] = {
					'colCoords': jQuery(this).data('col'),
					'rowCoords': jQuery(this).data('row')
				}
				i += 1;
			}
		});
	}
}