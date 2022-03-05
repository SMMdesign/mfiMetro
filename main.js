
// Initializing game data variables
var gameData = {
	version: '0.31',
	money: 10000,
	ticketPrice: 100,
	passengers: 0,
	lines: 0,
	stations: 0,
	locomotives: 0,
	cars: 0,
	prestige: 0
}	// remember to add new variables to load function

// non gameData variables
var pps = 0;
var maxPassengers = 0;
var mps = 0;
var lineCost = 0;
var stationCost = 0;
var locomotiveCost = 0;
var carCost = 0;







// Defining save function
function save() {
	localStorage.setItem("mfiSave",JSON.stringify(gameData));	// mfiSave is name of locally stored data
	console.log('Game Saved!');
}


// Defining load function
function load() {
	var saveGame = JSON.parse(localStorage.getItem("mfiSave"));	// saveGame is the decoded save
	if (saveGame !==null) {	// runs if player has a save file
		if (saveGame.version !== gameData.version) { // runs if the save is out of date
			if (typeof saveGame.version === 'undefined') saveGame.version = gameData.version;
			if (typeof saveGame.money === 'undefined') saveGame.money = gameData.money;
			if (typeof saveGame.ticketPrice === 'undefined') saveGame.ticketPrice = gameData.ticketPrice;
			if (typeof saveGame.passengers === 'undefined') saveGame.passengers = gameData.passengers;
			if (typeof saveGame.lines === 'undefined') saveGame.lines = gameData.lines;
			if (typeof saveGame.stations === 'undefined') saveGame.stations = gameData.stations;
			if (typeof saveGame.locomotives === 'undefined') saveGame.locomotives = gameData.locomotives;
			if (typeof saveGame.cars === 'undefined') saveGame.cars = gameData.cars;			
			if (typeof saveGame.prestige === 'undefined') saveGame.prestige = gameData.prestige;
			
			saveGame.version = gameData.version;
			console.log(`saveGame has been updated to ${gameData.version}`);
		}
		gameData = saveGame;	// loading the player's save data into the game
		refresh();	// visually refreshing values
		console.log('Game Loaded!');
	}
}


// Defining delete save function
function deleteSave() {
	localStorage.removeItem("mfiSave");
	console.log('Save Deleted!');
	location.reload();
}


// Defining refresh function to update page after loading game
function refresh() {
	// refreshing values from gameData
	update("money", gameData.money.toLocaleString("en-US"));
	update("ticketPrice", gameData.ticketPrice.toLocaleString("en-US"));
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	update("lines", gameData.lines.toLocaleString("en-US"));
	update("stations", gameData.stations.toLocaleString("en-US"));
	update("locomotives", gameData.locomotives.toLocaleString("en-US"));
	update("cars", gameData.cars.toLocaleString("en-US"));
	// refreshing formulas dependent on gameData
	updatePps();
	updateMps();
	updateMaxPassengers();
	updateLineCost();
	updateStationCost();
	updateLocomotiveCost();
	updateCarCost();
	// making sure proper elements are displayed
	if(gameData.lines > 0) {show("lineChildContainer");}
}



function update(id, content) {
  document.getElementById(id).innerHTML = content;
}


function show(id) {
	document.getElementById(id).style.display = "inline"; 
}

function hide(id) {
	document.getElementById(id).style.display = "none"; 
}





// INITIAL GAME LOAD
load();
refresh();
update("titleVer", `v${gameData.version}`);














// GAME FUNCTIONS

function makeMoney(number) {
	gameData.money += number;
	update("money", gameData.money.toLocaleString("en-US"));
}

function generatePassengers(number) {
	gameData.passengers += number;
	// Prevents passengers from exceeding passenger car max
	if (gameData.passengers >= gameData.cars * 100) {
		gameData.passengers = gameData.cars * 100;
	}
	
	// Prevents passengers from going below zero
	if (gameData.passengers < 0) {
		gameData.passengers = 0;
	}
	
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	updateMps();
	updatePps();
}







// equilibrium is ¥200 price

// oh god what is this formula, how do I math

// Math.ceil((((0.5 ** (gameData.ticketPrice/200)) - 0.5)*((gameData.passengers / maxPassengers) + 1)) * 2)


function updatePps() {
	// pps = gameData.stations * 2;
	pps = Math.ceil((((0.5 ** (gameData.ticketPrice/200)) - 0.5)*((gameData.passengers / maxPassengers) + 1)) * 5);
	// prevents errors from dividing by zero
	if(!pps) {
		pps = 0;
	}
	// prevents stalling at 0 passengers once game has started
	if(gameData.passengers === 0 && gameData.stations > 0) {
		gameData.passengers = 1;
	}
	update("pps", `(${pps.toLocaleString("en-US")}/s)`)
}

function updateMps() {
	mps = gameData.passengers * gameData.ticketPrice;
	update("mps", `(${mps.toLocaleString("en-US")}/s)`)
}

function updateMaxPassengers() {
	maxPassengers = gameData.cars * 100;
	update("maxPassengers", `/${maxPassengers.toLocaleString("en-US")}`)
}















function updateLineCost() {
	lineCost = Math.floor(10000 * (100 ** gameData.lines));
	update("lineCost", lineCost.toLocaleString("en-US"));
}

function updateStationCost() {
	stationCost = Math.floor(150000 * (2.1	** gameData.stations));
	update("stationCost", stationCost.toLocaleString("en-US"));
}

function updateLocomotiveCost() {
	locomotiveCost = Math.floor(100000 * (2 ** gameData.locomotives));
	update("locomotiveCost", locomotiveCost.toLocaleString("en-US"));
}

function updateCarCost() {
	carCost = Math.floor(10000 * (1.085 ** gameData.cars));
	update("carCost", carCost.toLocaleString("en-US"));
}








function buyLine(number) {
	updateLineCost();
	if(gameData.money >= lineCost) {
		gameData.lines += number;
		gameData.money -= lineCost * number;
		updateLineCost();		
		gameData.stations += 2 * number;
		updateStationCost();
		gameData.locomotives += 1 * number;
		updateLocomotiveCost();
		gameData.cars += 1 * number;	
		updateCarCost();
		show("lineChildContainer");
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("lines", gameData.lines.toLocaleString("en-US"));
		update("stations", gameData.stations.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("locomotives", gameData.locomotives.toLocaleString("en-US"));		
		update("cars", gameData.cars.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
}




function buyStation(number) {
	updateStationCost();
	if(gameData.money >= stationCost) {
		gameData.stations += number;
		gameData.money -= stationCost * number;	
		updateStationCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("stations", gameData.stations.toLocaleString("en-US"));
		updatePps(); 					// because pps is dependent on station number
}


function buyLocomotive(number) {
	updateLocomotiveCost();
	if(gameData.locomotives >= gameData.stations) {
		alert ("Can't have more locomotives than stations!");
	} else if(gameData.money >= locomotiveCost) {
		gameData.locomotives += number;
		gameData.money -= locomotiveCost * number;
		updateLocomotiveCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("locomotives", gameData.locomotives.toLocaleString("en-US"));
}


function buyCar(number) {
	updateCarCost();
	if(gameData.cars >= gameData.locomotives * 12) {
		alert ("Can't have more than 12 cars per locomotive!");
	} else if(gameData.money >= carCost) {
		gameData.cars += number;
		gameData.money -= carCost * number;	
		updateCarCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("cars", gameData.cars.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
}













function setTicketPrice() {
	gameData.ticketPrice = prompt("Set Price ( 1 - 1,000 )","100");
	while(gameData.ticketPrice < 1 || gameData.ticketPrice > 1000 || isNaN(gameData.ticketPrice) ) {
		alert("Please enter a number between 1 and 1,000.");
		gameData.ticketPrice = prompt("Set Price ( 1 - 1,000 )","100");
	}
	update("ticketPrice", gameData.ticketPrice);
	updatePps();					// because pps is dependent on ticket price
}












// Game Loop
window.setInterval(function() {
	makeMoney(gameData.passengers * gameData.ticketPrice);
	generatePassengers(pps);
	
	
	save();
}, 1000);

