
// Initializing game data variables
var gameData = {
	version: '0.2',
	money: 1000,
	ticketPrice: 100,
	passengers: 0,
	lines: 0,
	stations: 0,
	trains: 0,
	cars: 0,
	prestige: 0
}	// remember to add new variables to load function

// non gameData variables
var pps = 0;
var mps = 0;
var lineCost = 0;
var stationCost = 0;
var trainCost = 0;
var carCost = 0;



function update(id, content) {
  document.getElementById(id).innerHTML = content;
}



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
			if (typeof saveGame.trains === 'undefined') saveGame.trains = gameData.trains;
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
	makeMoney(0);
	generatePassengers(0);
	buyLine(0);		// don't need the other buy functions bc line has all
	updatePps();
	updateMps();
	updateMaxPassengers();
	updateLineCost();
	updateStationCost();
	updateTrainCost();
	updateCarCost();
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
	// Prevents passengers from exceeding train car max
	if (gameData.passengers >= gameData.cars * 100) {
		gameData.passengers = gameData.cars * 100;
	}
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	updateMps();
}


function updatePps() {
	pps = gameData.stations * 2;
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
	lineCost = Math.floor(1000 * (10000 ** gameData.lines));
	update("lineCost", lineCost.toLocaleString("en-US"));
}

function updateStationCost() {
	stationCost = Math.floor(150000 * (1.2 ** gameData.stations));
	update("stationCost", stationCost.toLocaleString("en-US"));
}

function updateTrainCost() {
	trainCost = Math.floor(100000 * (1.15 ** gameData.trains));
	update("trainCost", trainCost.toLocaleString("en-US"));
}

function updateCarCost() {
	carCost = Math.floor(10000 * (1.1 ** gameData.cars));
	update("carCost", carCost.toLocaleString("en-US"));
}








function buyLine(number) {
	updateLineCost();
	if(gameData.money >= lineCost) {
		gameData.lines += number;
		gameData.money -= lineCost * number;		// allows use of (0) for refreshing values
		updateLineCost();		
		gameData.stations += 2 * number;			// allows use of (0) for refreshing values
		updateStationCost();
		gameData.trains += 1 * number;				// allows use of (0) for refreshing values
		updateTrainCost();
		gameData.cars += 1 * number;					// allows use of (0) for refreshing values
		updateCarCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("lines", gameData.lines.toLocaleString("en-US"));
		update("stations", gameData.stations.toLocaleString("en-US"));
		updatePps();
		update("trains", gameData.trains.toLocaleString("en-US"));		
		update("cars", gameData.cars.toLocaleString("en-US"));
		updateMaxPassengers();
}




function buyStation(number) {
	updateStationCost();
	if(gameData.money >= stationCost) {
		gameData.stations += number;
		gameData.money -= stationCost * number;// allows use of (0) for refreshing values		
		updateStationCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("stations", gameData.stations.toLocaleString("en-US"));
		updatePps();  // because pps is dependent on station number
}


function buyTrain(number) {
	updateTrainCost();
	if(gameData.trains >= gameData.stations) {
		alert ("Can't have more trains than stations!");
	} else if(gameData.money >= trainCost) {
		gameData.trains += number;
		gameData.money -= trainCost * number;// allows use of (0) for refreshing values		
		updateTrainCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("trains", gameData.trains.toLocaleString("en-US"));
}


function buyCar(number) {
	updateCarCost();
	if(gameData.cars >= gameData.trains * 12) {
		alert ("Can't have more than 12 cars per train!");
	} else if(gameData.money >= carCost) {
		gameData.cars += number;
		gameData.money -= carCost * number;// allows use of (0) for refreshing values		
		updateCarCost();
	}
		update("money", gameData.money.toLocaleString("en-US"));
		update("cars", gameData.cars.toLocaleString("en-US"));
		updateMaxPassengers();
}












// Game Loop
window.setInterval(function() {
	makeMoney(gameData.passengers * gameData.ticketPrice);
	generatePassengers(pps);
	
	
	save();
}, 1000);

