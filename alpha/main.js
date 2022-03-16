/*
* MFI Metro
* Copyright (C) 2022 Shandra McCollough <shandramccollough@gmail.com>
 */


// Initializing game data variables
var gameData = {
	version: '0.42',
	money: 50000,
	ticketPrice: 100,
	passengers: 0,
	prestige: 0,
	ginza: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	marunouchi: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	hibiya: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	tozai: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	chiyoda: 		{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	yurakucho: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	hanzomon: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	namboku: 		{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	fukutoshin: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 }
	
}	// remember to add new variables to load function

// non gameData variables
var pps = 0;
var maxPassengers = 0;
var mps = 0;
var lineCost = 0;			// dont forget this exists
var buyMax = false;









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
			if (typeof saveGame.prestige === 'undefined') saveGame.prestige = gameData.prestige;
			if (typeof saveGame.ginza === 'undefined') saveGame.ginza = gameData.ginza;
			if (typeof saveGame.marunouchi === 'undefined') saveGame.marunouchi = gameData.marunouchi;
			if (typeof saveGame.hibiya === 'undefined') saveGame.hibiya = gameData.hibiya;
			if (typeof saveGame.tozai === 'undefined') saveGame.tozai = gameData.tozai;
			if (typeof saveGame.chiyoda === 'undefined') saveGame.chiyoda = gameData.chiyoda;
			if (typeof saveGame.yurakucho === 'undefined') saveGame.yurakucho = gameData.yurakucho;
			if (typeof saveGame.hanzomon === 'undefined') saveGame.hanzomon = gameData.hanzomon;
			if (typeof saveGame.namboku === 'undefined') saveGame.namboku = gameData.namboku;
			if (typeof saveGame.fukutoshin === 'undefined') saveGame.fukutoshin = gameData.fukutoshin;
			
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
	clearInterval(autosaveLoop);
	if(confirm("This will delete your progress, are you sure?") === true) {
		localStorage.removeItem("mfiSave");
		console.log('Save Deleted!');
		location.reload();
	} else {
		console.log('Delete Cancelled.')
		location.reload();
	}
}




// General tools

function update(id, content) {
  document.getElementById(id).innerHTML = content;
}

function show(id) {
	document.getElementById(id).style.display = "inline-block"; 
}

function hide(id) {
	document.getElementById(id).style.display = "none"; 
}









// Defining refresh function to update page after loading game
function refresh() {
	// refreshing values from gameData
	update("money", gameData.money.toLocaleString("en-US"));
	update("ticketPrice", gameData.ticketPrice.toLocaleString("en-US"));
	update("passengers", gameData.passengers.toLocaleString("en-US"));

	// refreshing formulas dependent on gameData
	updatePps();
	updateMps();
	updateMaxPassengers();
	lineCost = calcLineCost();
	
	// making sure proper elements are displayed per line
	if(gameData.ginza.line < 1) {
		update("ginLineCost", lineCost.toLocaleString("en-US"));
	}
	if(gameData.ginza.line > 0) {
		show("ginzaBody"); hide("ginzaHead");
		update("ginStations", gameData.ginza.stations.toLocaleString("en-US"));
		ginStationCost = calcStationCost(gameData.ginza.stations);
		update("ginStationCost", ginStationCost.toLocaleString("en-US"));
		update("ginLocomotives", gameData.ginza.locomotives.toLocaleString("en-US"));
		ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
		update("ginLocomotiveCost", ginLocomotiveCost.toLocaleString("en-US"));
		update("ginCars", gameData.ginza.cars.toLocaleString("en-US"));
		ginCarCost = calcCarCost(gameData.ginza.cars);
		update("ginCarCost", ginCarCost.toLocaleString("en-US"));
		show("marunouchiHead");
		update("maruLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.marunouchi.line > 0) {
		show("marunouchiBody"); hide("marunouchiHead");
		update("maruStations", gameData.marunouchi.stations.toLocaleString("en-US"));
		maruStationCost = calcStationCost(gameData.marunouchi.stations);
		update("maruStationCost", maruStationCost.toLocaleString("en-US"));
		update("maruLocomotives", gameData.marunouchi.locomotives.toLocaleString("en-US"));
		maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
		update("maruLocomotiveCost", maruLocomotiveCost.toLocaleString("en-US"));
		update("maruCars", gameData.marunouchi.cars.toLocaleString("en-US"));
		maruCarCost = calcCarCost(gameData.marunouchi.cars);
		update("maruCarCost", maruCarCost.toLocaleString("en-US"));
		show("hibiyaHead");
		update("hibiLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.hibiya.line > 0) {
		show("hibiyaBody"); hide("hibiyaHead");
		update("hibiStations", gameData.hibiya.stations.toLocaleString("en-US"));
		hibiStationCost = calcStationCost(gameData.hibiya.stations);
		update("hibiStationCost", hibiStationCost.toLocaleString("en-US"));
		update("hibiLocomotives", gameData.hibiya.locomotives.toLocaleString("en-US"));
		hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
		update("hibiLocomotiveCost", hibiLocomotiveCost.toLocaleString("en-US"));
		update("hibiCars", gameData.hibiya.cars.toLocaleString("en-US"));
		hibiCarCost = calcCarCost(gameData.hibiya.cars);
		update("hibiCarCost", hibiCarCost.toLocaleString("en-US"));
		show("tozaiHead");
		update("tozaLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.tozai.line > 0) {
		show("tozaiBody"); hide("tozaiHead");
		update("tozaStations", gameData.tozai.stations.toLocaleString("en-US"));
		tozaStationCost = calcStationCost(gameData.tozai.stations);
		update("tozaStationCost", tozaStationCost.toLocaleString("en-US"));
		update("tozaLocomotives", gameData.tozai.locomotives.toLocaleString("en-US"));
		tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
		update("tozaLocomotiveCost", tozaLocomotiveCost.toLocaleString("en-US"));
		update("tozaCars", gameData.tozai.cars.toLocaleString("en-US"));
		tozaCarCost = calcCarCost(gameData.tozai.cars);
		update("tozaCarCost", tozaCarCost.toLocaleString("en-US"));
		show("chiyodaHead");
		update("chiyoLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.chiyoda.line > 0) {
		show("chiyodaBody"); hide("chiyodaHead");
		update("chiyoStations", gameData.chiyoda.stations.toLocaleString("en-US"));
		chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
		update("chiyoStationCost", chiyoStationCost.toLocaleString("en-US"));
		update("chiyoLocomotives", gameData.chiyoda.locomotives.toLocaleString("en-US"));
		chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
		update("chiyoLocomotiveCost", chiyoLocomotiveCost.toLocaleString("en-US"));
		update("chiyoCars", gameData.chiyoda.cars.toLocaleString("en-US"));
		chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
		update("chiyoCarCost", chiyoCarCost.toLocaleString("en-US"));
		show("yurakuchoHead");
		update("yuraLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.yurakucho.line > 0) {
		show("yurakuchoBody"); hide("yurakuchoHead");
		update("yuraStations", gameData.yurakucho.stations.toLocaleString("en-US"));
		yuraStationCost = calcStationCost(gameData.yurakucho.stations);
		update("yuraStationCost", yuraStationCost.toLocaleString("en-US"));
		update("yuraLocomotives", gameData.yurakucho.locomotives.toLocaleString("en-US"));
		yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
		update("yuraLocomotiveCost", yuraLocomotiveCost.toLocaleString("en-US"));
		update("yuraCars", gameData.yurakucho.cars.toLocaleString("en-US"));
		yuraCarCost = calcCarCost(gameData.yurakucho.cars);
		update("yuraCarCost", yuraCarCost.toLocaleString("en-US"));
		show("hanzomonHead");
		update("hanLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.hanzomon.line > 0) {
		show("hanzomonBody"); hide("hanzomonHead");
		update("hanStations", gameData.hanzomon.stations.toLocaleString("en-US"));
		hanStationCost = calcStationCost(gameData.hanzomon.stations);
		update("hanStationCost", hanStationCost.toLocaleString("en-US"));
		update("hanLocomotives", gameData.hanzomon.locomotives.toLocaleString("en-US"));
		hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
		update("hanLocomotiveCost", hanLocomotiveCost.toLocaleString("en-US"));
		update("hanCars", gameData.hanzomon.cars.toLocaleString("en-US"));
		hanCarCost = calcCarCost(gameData.hanzomon.cars);
		update("hanCarCost", hanCarCost.toLocaleString("en-US"));
		show("nambokuHead");
		update("namLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.namboku.line > 0) {
		show("nambokuBody"); hide("nambokuHead");
		update("namStations", gameData.namboku.stations.toLocaleString("en-US"));
		namStationCost = calcStationCost(gameData.namboku.stations);
		update("namStationCost", namStationCost.toLocaleString("en-US"));
		update("namLocomotives", gameData.namboku.locomotives.toLocaleString("en-US"));
		namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
		update("namLocomotiveCost", namLocomotiveCost.toLocaleString("en-US"));
		update("namCars", gameData.namboku.cars.toLocaleString("en-US"));
		namCarCost = calcCarCost(gameData.namboku.cars);
		update("namCarCost", namCarCost.toLocaleString("en-US"));
		show("fukutoshinHead");
		update("fukuLineCost", lineCost.toLocaleString("en-US"));
	}
		if(gameData.fukutoshin.line > 0) {
		show("fukutoshinBody"); hide("fukutoshinHead");
		update("fukuStations", gameData.fukutoshin.stations.toLocaleString("en-US"));
		fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
		update("fukuStationCost", fukuStationCost.toLocaleString("en-US"));
		update("fukuLocomotives", gameData.fukutoshin.locomotives.toLocaleString("en-US"));
		fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
		update("fukuLocomotiveCost", fukuLocomotiveCost.toLocaleString("en-US"));
		update("fukuCars", gameData.fukutoshin.cars.toLocaleString("en-US"));
		fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
		update("fukuCarCost", fukuCarCost.toLocaleString("en-US"));
	}
	
	
	
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
	if (gameData.passengers >= calcTotalCars() * 100) {
		gameData.passengers = calcTotalCars() * 100;
	}
	// Prevents passengers from going below zero
	if (gameData.passengers < 0) {
		gameData.passengers = 0;
	}
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	updateMps();
	updatePps();
}




function setTicketPrice() {
	let userPrice = prompt("Set Price ( 1 - 1,000 )","100");
	if(userPrice === null || isNaN(userPrice)) { return;}
	if(userPrice < 1 || userPrice > 1000) {
		alert("Please enter a number between 1 and 1,000."); return;
	}
	gameData.ticketPrice = Math.round(userPrice);
	update("ticketPrice", gameData.ticketPrice);
	updatePps();					// because pps is dependent on ticket price
}

function toggleBuyMax() {
	buyMax = !buyMax;
	if(buyMax) {update("buyMaxToggle", "ON"); }
	if(!buyMax) {update("buyMaxToggle", "OFF"); }
}





// equilibrium is ¥200 price

function updatePps() {
	// pps = gameData.ginza.stations * 2;
	pps = Math.ceil( (( 200 - gameData.ticketPrice ) / 200 ) * ( calcTotalStations() * 5 ) );
	// prevents errors from dividing by zero
	if(!pps) {
		pps = 0;
	}
	// prevents stalling at 0 passengers once game has started
	if(gameData.passengers === 0 && gameData.ginza.line > 0) {
		gameData.passengers = 1;
	}
	update("pps", `(${pps.toLocaleString("en-US")}/s)`)
}

function updateMps() {
	mps = gameData.passengers * gameData.ticketPrice;
	update("mps", `(¥${mps.toLocaleString("en-US")}/s)`)
}

function updateMaxPassengers() {
	maxPassengers = calcTotalCars() * 100;
	update("maxPassengers", `/${maxPassengers.toLocaleString("en-US")}`)
}








// functions that return values

function calcTotalLines() {
	return gameData.ginza.line + gameData.marunouchi.line + gameData.hibiya.line + gameData.tozai.line + gameData.chiyoda.line + gameData.yurakucho.line + gameData.hanzomon.line + gameData.namboku.line + gameData.fukutoshin.line;
}
function calcTotalStations() {
	return gameData.ginza.stations + gameData.marunouchi.stations + gameData.hibiya.stations + gameData.tozai.stations + gameData.chiyoda.stations + gameData.yurakucho.stations + gameData.hanzomon.stations + gameData.namboku.stations + gameData.fukutoshin.stations
}
function calcTotalCars() {
	return gameData.ginza.cars + gameData.marunouchi.cars + gameData.hibiya.cars + gameData.tozai.cars + gameData.chiyoda.cars + gameData.yurakucho.cars + gameData.hanzomon.cars + gameData.namboku.cars + gameData.fukutoshin.cars
}


function calcLineCost() {
	return Math.floor(50000 * (24 ** calcTotalLines()));
}

function calcStationCost(stations) {
	return Math.floor(10000 * (4	** stations ));
}

function calcLocomotiveCost(locomotives) {
	return Math.floor(10000 * (2 ** locomotives ));
}

function calcCarCost(cars) {
	return Math.floor(5000 * (1.06 ** cars ));
}






// buying functions

// ginza buying functions
function buyGinLine() {
	if(gameData.money >= lineCost) {
		gameData.ginza.line = 1;
		gameData.money -= lineCost;		
		gameData.ginza.stations += 2;
		gameData.ginza.locomotives += 1;
		gameData.ginza.cars += 1;
		show("ginzaBody");
		hide("ginzaHead");
		show("marunouchiHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("maruLineCost", lineCost.toLocaleString("en-US"));
		update("ginStations", gameData.ginza.stations.toLocaleString("en-US"));
		ginStationCost = calcStationCost(gameData.ginza.stations);
		update("ginStationCost", ginStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("ginLocomotives", gameData.ginza.locomotives.toLocaleString("en-US"));
		ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
		update("ginLocomotiveCost", ginLocomotiveCost.toLocaleString("en-US"));
		update("ginCars", gameData.ginza.cars.toLocaleString("en-US"));
		ginCarCost = calcCarCost(gameData.ginza.cars);
		update("ginCarCost", ginCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyGinStation(number) {
	if(gameData.money >= ginStationCost) {
		gameData.ginza.stations += number;
		gameData.money -= ginStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("ginStations", gameData.ginza.stations.toLocaleString("en-US"));
		ginStationCost = calcStationCost(gameData.ginza.stations);
		update("ginStationCost", ginStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyGinLocomotive(number) {
	if(gameData.ginza.locomotives < gameData.ginza.stations * 2 && gameData.money >= ginLocomotiveCost) {
		gameData.ginza.locomotives += number;
		gameData.money -= ginLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("ginLocomotives", gameData.ginza.locomotives.toLocaleString("en-US"));
		ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
		update("ginLocomotiveCost", ginLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyGinCar(number) {
	if(gameData.ginza.cars < gameData.ginza.locomotives * 12 && gameData.money >= ginCarCost) {
		gameData.ginza.cars += number;
		gameData.money -= ginCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("ginCars", gameData.ginza.cars.toLocaleString("en-US"));
		ginCarCost = calcCarCost(gameData.ginza.cars);
		update("ginCarCost", ginCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
		if(buyMax && gameData.money >= ginCarCost) {
			buyGinCar(1);
		}
	}
}
// end of ginza buying functions



// marunouchi buying functions
function buyMaruLine() {
	if(gameData.money >= lineCost) {
		gameData.marunouchi.line = 1;
		gameData.money -= lineCost;		
		gameData.marunouchi.stations += 2;
		gameData.marunouchi.locomotives += 1;
		gameData.marunouchi.cars += 1;
		show("marunouchiBody");
		hide("marunouchiHead");
		show("hibiyaHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("hibiLineCost", lineCost.toLocaleString("en-US"));
		update("maruStations", gameData.marunouchi.stations.toLocaleString("en-US"));
		maruStationCost = calcStationCost(gameData.marunouchi.stations);
		update("maruStationCost", maruStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("maruLocomotives", gameData.marunouchi.locomotives.toLocaleString("en-US"));
		maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
		update("maruLocomotiveCost", maruLocomotiveCost.toLocaleString("en-US"));
		update("maruCars", gameData.marunouchi.cars.toLocaleString("en-US"));
		maruCarCost = calcCarCost(gameData.marunouchi.cars);
		update("maruCarCost", maruCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyMaruStation(number) {
	if(gameData.money >= maruStationCost) {
		gameData.marunouchi.stations += number;
		gameData.money -= maruStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("maruStations", gameData.marunouchi.stations.toLocaleString("en-US"));
		maruStationCost = calcStationCost(gameData.marunouchi.stations);
		update("maruStationCost", maruStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyMaruLocomotive(number) {
	if(gameData.marunouchi.locomotives < gameData.marunouchi.stations * 2 && gameData.money >= maruLocomotiveCost) {
		gameData.marunouchi.locomotives += number;
		gameData.money -= maruLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("maruLocomotives", gameData.marunouchi.locomotives.toLocaleString("en-US"));
		maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
		update("maruLocomotiveCost", maruLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyMaruCar(number) {
	if(gameData.marunouchi.cars < gameData.marunouchi.locomotives * 12 && gameData.money >= maruCarCost) {
		gameData.marunouchi.cars += number;
		gameData.money -= maruCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("maruCars", gameData.marunouchi.cars.toLocaleString("en-US"));
		maruCarCost = calcCarCost(gameData.marunouchi.cars);
		update("maruCarCost", maruCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of marunouchi buying functions



// hibiya buying functions
function buyHibiLine() {
	if(gameData.money >= lineCost) {
		gameData.hibiya.line = 1;
		gameData.money -= lineCost;		
		gameData.hibiya.stations += 2;
		gameData.hibiya.locomotives += 1;
		gameData.hibiya.cars += 1;
		show("hibiyaBody");
		hide("hibiyaHead");
		show("tozaiHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("tozaLineCost", lineCost.toLocaleString("en-US"));
		update("hibiStations", gameData.hibiya.stations.toLocaleString("en-US"));
		hibiStationCost = calcStationCost(gameData.hibiya.stations);
		update("hibiStationCost", hibiStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("hibiLocomotives", gameData.hibiya.locomotives.toLocaleString("en-US"));
		hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
		update("hibiLocomotiveCost", hibiLocomotiveCost.toLocaleString("en-US"));
		update("hibiCars", gameData.hibiya.cars.toLocaleString("en-US"));
		hibiCarCost = calcCarCost(gameData.hibiya.cars);
		update("hibiCarCost", hibiCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyHibiStation(number) {
	if(gameData.money >= hibiStationCost) {
		gameData.hibiya.stations += number;
		gameData.money -= hibiStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hibiStations", gameData.hibiya.stations.toLocaleString("en-US"));
		hibiStationCost = calcStationCost(gameData.hibiya.stations);
		update("hibiStationCost", hibiStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyHibiLocomotive(number) {
	if(gameData.hibiya.locomotives < gameData.hibiya.stations * 2 && gameData.money >= hibiLocomotiveCost) {
		gameData.hibiya.locomotives += number;
		gameData.money -= hibiLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hibiLocomotives", gameData.hibiya.locomotives.toLocaleString("en-US"));
		hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
		update("hibiLocomotiveCost", hibiLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyHibiCar(number) {
	if(gameData.hibiya.cars < gameData.hibiya.locomotives * 12 && gameData.money >= hibiCarCost) {
		gameData.hibiya.cars += number;
		gameData.money -= hibiCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hibiCars", gameData.hibiya.cars.toLocaleString("en-US"));
		hibiCarCost = calcCarCost(gameData.hibiya.cars);
		update("hibiCarCost", hibiCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of hibiya buying functions



// tozai buying functions
function buyTozaLine() {
	if(gameData.money >= lineCost) {
		gameData.tozai.line = 1;
		gameData.money -= lineCost;		
		gameData.tozai.stations += 2;
		gameData.tozai.locomotives += 1;
		gameData.tozai.cars += 1;
		show("tozaiBody");
		hide("tozaiHead");
		show("chiyodaHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("chiyoLineCost", lineCost.toLocaleString("en-US"));
		update("tozaStations", gameData.tozai.stations.toLocaleString("en-US"));
		tozaStationCost = calcStationCost(gameData.tozai.stations);
		update("tozaStationCost", tozaStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("tozaLocomotives", gameData.tozai.locomotives.toLocaleString("en-US"));
		tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
		update("tozaLocomotiveCost", tozaLocomotiveCost.toLocaleString("en-US"));
		update("tozaCars", gameData.tozai.cars.toLocaleString("en-US"));
		tozaCarCost = calcCarCost(gameData.tozai.cars);
		update("tozaCarCost", tozaCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyTozaStation(number) {
	if(gameData.money >= tozaStationCost) {
		gameData.tozai.stations += number;
		gameData.money -= tozaStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("tozaStations", gameData.tozai.stations.toLocaleString("en-US"));
		tozaStationCost = calcStationCost(gameData.tozai.stations);
		update("tozaStationCost", tozaStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyTozaLocomotive(number) {
	if(gameData.tozai.locomotives < gameData.tozai.stations * 2 && gameData.money >= tozaLocomotiveCost) {
		gameData.tozai.locomotives += number;
		gameData.money -= tozaLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("tozaLocomotives", gameData.tozai.locomotives.toLocaleString("en-US"));
		tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
		update("tozaLocomotiveCost", tozaLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyTozaCar(number) {
	if(gameData.tozai.cars < gameData.tozai.locomotives * 12 && gameData.money >= tozaCarCost) {
		gameData.tozai.cars += number;
		gameData.money -= tozaCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("tozaCars", gameData.tozai.cars.toLocaleString("en-US"));
		tozaCarCost = calcCarCost(gameData.tozai.cars);
		update("tozaCarCost", tozaCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of tozai buying functions



// chiyoda buying functions
function buyChiyoLine() {
	if(gameData.money >= lineCost) {
		gameData.chiyoda.line = 1;
		gameData.money -= lineCost;		
		gameData.chiyoda.stations += 2;
		gameData.chiyoda.locomotives += 1;
		gameData.chiyoda.cars += 1;
		show("chiyodaBody");
		hide("chiyodaHead");
		show("yurakuchoHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("yuraLineCost", lineCost.toLocaleString("en-US"));
		update("chiyoStations", gameData.chiyoda.stations.toLocaleString("en-US"));
		chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
		update("chiyoStationCost", chiyoStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("chiyoLocomotives", gameData.chiyoda.locomotives.toLocaleString("en-US"));
		chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
		update("chiyoLocomotiveCost", chiyoLocomotiveCost.toLocaleString("en-US"));
		update("chiyoCars", gameData.chiyoda.cars.toLocaleString("en-US"));
		chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
		update("chiyoCarCost", chiyoCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyChiyoStation(number) {
	if(gameData.money >= chiyoStationCost) {
		gameData.chiyoda.stations += number;
		gameData.money -= chiyoStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("chiyoStations", gameData.chiyoda.stations.toLocaleString("en-US"));
		chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
		update("chiyoStationCost", chiyoStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyChiyoLocomotive(number) {
	if(gameData.chiyoda.locomotives < gameData.chiyoda.stations * 2 && gameData.money >= chiyoLocomotiveCost) {
		gameData.chiyoda.locomotives += number;
		gameData.money -= chiyoLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("chiyoLocomotives", gameData.chiyoda.locomotives.toLocaleString("en-US"));
		chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
		update("chiyoLocomotiveCost", chiyoLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyChiyoCar(number) {
	if(gameData.chiyoda.cars < gameData.chiyoda.locomotives * 12 && gameData.money >= chiyoCarCost) {
		gameData.chiyoda.cars += number;
		gameData.money -= chiyoCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("chiyoCars", gameData.chiyoda.cars.toLocaleString("en-US"));
		chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
		update("chiyoCarCost", chiyoCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of chiyoda buying functions



// yurakucho buying functions
function buyYuraLine() {
	if(gameData.money >= lineCost) {
		gameData.yurakucho.line = 1;
		gameData.money -= lineCost;		
		gameData.yurakucho.stations += 2;
		gameData.yurakucho.locomotives += 1;
		gameData.yurakucho.cars += 1;
		show("yurakuchoBody");
		hide("yurakuchoHead");
		show("hanzomonHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("hanLineCost", lineCost.toLocaleString("en-US"));
		update("yuraStations", gameData.yurakucho.stations.toLocaleString("en-US"));
		yuraStationCost = calcStationCost(gameData.yurakucho.stations);
		update("yuraStationCost", yuraStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("yuraLocomotives", gameData.yurakucho.locomotives.toLocaleString("en-US"));
		yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
		update("yuraLocomotiveCost", yuraLocomotiveCost.toLocaleString("en-US"));
		update("yuraCars", gameData.yurakucho.cars.toLocaleString("en-US"));
		yuraCarCost = calcCarCost(gameData.yurakucho.cars);
		update("yuraCarCost", yuraCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyYuraStation(number) {
	if(gameData.money >= yuraStationCost) {
		gameData.yurakucho.stations += number;
		gameData.money -= yuraStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("yuraStations", gameData.yurakucho.stations.toLocaleString("en-US"));
		yuraStationCost = calcStationCost(gameData.yurakucho.stations);
		update("yuraStationCost", yuraStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyYuraLocomotive(number) {
	if(gameData.yurakucho.locomotives < gameData.yurakucho.stations * 2 && gameData.money >= yuraLocomotiveCost) {
		gameData.yurakucho.locomotives += number;
		gameData.money -= yuraLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("yuraLocomotives", gameData.yurakucho.locomotives.toLocaleString("en-US"));
		yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
		update("yuraLocomotiveCost", yuraLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyYuraCar(number) {
	if(gameData.yurakucho.cars < gameData.yurakucho.locomotives * 12 && gameData.money >= yuraCarCost) {
		gameData.yurakucho.cars += number;
		gameData.money -= yuraCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("yuraCars", gameData.yurakucho.cars.toLocaleString("en-US"));
		yuraCarCost = calcCarCost(gameData.yurakucho.cars);
		update("yuraCarCost", yuraCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of yurakucho buying functions



// hanzomon buying functions
function buyHanLine() {
	if(gameData.money >= lineCost) {
		gameData.hanzomon.line = 1;
		gameData.money -= lineCost;		
		gameData.hanzomon.stations += 2;
		gameData.hanzomon.locomotives += 1;
		gameData.hanzomon.cars += 1;
		show("hanzomonBody");
		hide("hanzomonHead");
		show("nambokuHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("namLineCost", lineCost.toLocaleString("en-US"));
		update("hanStations", gameData.hanzomon.stations.toLocaleString("en-US"));
		hanStationCost = calcStationCost(gameData.hanzomon.stations);
		update("hanStationCost", hanStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("hanLocomotives", gameData.hanzomon.locomotives.toLocaleString("en-US"));
		hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
		update("hanLocomotiveCost", hanLocomotiveCost.toLocaleString("en-US"));
		update("hanCars", gameData.hanzomon.cars.toLocaleString("en-US"));
		hanCarCost = calcCarCost(gameData.hanzomon.cars);
		update("hanCarCost", hanCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyHanStation(number) {
	if(gameData.money >= hanStationCost) {
		gameData.hanzomon.stations += number;
		gameData.money -= hanStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hanStations", gameData.hanzomon.stations.toLocaleString("en-US"));
		hanStationCost = calcStationCost(gameData.hanzomon.stations);
		update("hanStationCost", hanStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyHanLocomotive(number) {
	if(gameData.hanzomon.locomotives < gameData.hanzomon.stations * 2 && gameData.money >= hanLocomotiveCost) {
		gameData.hanzomon.locomotives += number;
		gameData.money -= hanLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hanLocomotives", gameData.hanzomon.locomotives.toLocaleString("en-US"));
		hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
		update("hanLocomotiveCost", hanLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyHanCar(number) {
	if(gameData.hanzomon.cars < gameData.hanzomon.locomotives * 12 && gameData.money >= hanCarCost) {
		gameData.hanzomon.cars += number;
		gameData.money -= hanCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("hanCars", gameData.hanzomon.cars.toLocaleString("en-US"));
		hanCarCost = calcCarCost(gameData.hanzomon.cars);
		update("hanCarCost", hanCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of hanzomon buying functions



// namboku buying functions
function buyNamLine() {
	if(gameData.money >= lineCost) {
		gameData.namboku.line = 1;
		gameData.money -= lineCost;		
		gameData.namboku.stations += 2;
		gameData.namboku.locomotives += 1;
		gameData.namboku.cars += 1;
		show("nambokuBody");
		hide("nambokuHead");
		show("fukutoshinHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("fukuLineCost", lineCost.toLocaleString("en-US"));
		update("namStations", gameData.namboku.stations.toLocaleString("en-US"));
		namStationCost = calcStationCost(gameData.namboku.stations);
		update("namStationCost", namStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("namLocomotives", gameData.namboku.locomotives.toLocaleString("en-US"));
		namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
		update("namLocomotiveCost", namLocomotiveCost.toLocaleString("en-US"));
		update("namCars", gameData.namboku.cars.toLocaleString("en-US"));
		namCarCost = calcCarCost(gameData.namboku.cars);
		update("namCarCost", namCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyNamStation(number) {
	if(gameData.money >= namStationCost) {
		gameData.namboku.stations += number;
		gameData.money -= namStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("namStations", gameData.namboku.stations.toLocaleString("en-US"));
		namStationCost = calcStationCost(gameData.namboku.stations);
		update("namStationCost", namStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyNamLocomotive(number) {
	if(gameData.namboku.locomotives < gameData.namboku.stations * 2 && gameData.money >= namLocomotiveCost) {
		gameData.namboku.locomotives += number;
		gameData.money -= namLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("namLocomotives", gameData.namboku.locomotives.toLocaleString("en-US"));
		namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
		update("namLocomotiveCost", namLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyNamCar(number) {
	if(gameData.namboku.cars < gameData.namboku.locomotives * 12 && gameData.money >= namCarCost) {
		gameData.namboku.cars += number;
		gameData.money -= namCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("namCars", gameData.namboku.cars.toLocaleString("en-US"));
		namCarCost = calcCarCost(gameData.namboku.cars);
		update("namCarCost", namCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of namboku buying functions



// fukutoshin buying functions
function buyFukuLine() {
	if(gameData.money >= lineCost) {
		gameData.fukutoshin.line = 1;
		gameData.money -= lineCost;		
		gameData.fukutoshin.stations += 2;
		gameData.fukutoshin.locomotives += 1;
		gameData.fukutoshin.cars += 1;
		show("fukutoshinBody");
		hide("fukutoshinHead");
		update("money", gameData.money.toLocaleString("en-US"));
		lineCost = calcLineCost();
		update("fukuStations", gameData.fukutoshin.stations.toLocaleString("en-US"));
		fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
		update("fukuStationCost", fukuStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
		update("fukuLocomotives", gameData.fukutoshin.locomotives.toLocaleString("en-US"));
		fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
		update("fukuLocomotiveCost", fukuLocomotiveCost.toLocaleString("en-US"));
		update("fukuCars", gameData.fukutoshin.cars.toLocaleString("en-US"));
		fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
		update("fukuCarCost", fukuCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}


function buyFukuStation(number) {
	if(gameData.money >= fukuStationCost) {
		gameData.fukutoshin.stations += number;
		gameData.money -= fukuStationCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("fukuStations", gameData.fukutoshin.stations.toLocaleString("en-US"));
		fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
		update("fukuStationCost", fukuStationCost.toLocaleString("en-US"));
		updatePps();					// because pps is dependent on station number
	}
}


function buyFukuLocomotive(number) {
	if(gameData.fukutoshin.locomotives < gameData.fukutoshin.stations * 2 && gameData.money >= fukuLocomotiveCost) {
		gameData.fukutoshin.locomotives += number;
		gameData.money -= fukuLocomotiveCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("fukuLocomotives", gameData.fukutoshin.locomotives.toLocaleString("en-US"));
		fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
		update("fukuLocomotiveCost", fukuLocomotiveCost.toLocaleString("en-US"));
	}
}


function buyFukuCar(number) {
	if(gameData.fukutoshin.cars < gameData.fukutoshin.locomotives * 12 && gameData.money >= fukuCarCost) {
		gameData.fukutoshin.cars += number;
		gameData.money -= fukuCarCost * number;
		update("money", gameData.money.toLocaleString("en-US"));
		update("fukuCars", gameData.fukutoshin.cars.toLocaleString("en-US"));
		fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
		update("fukuCarCost", fukuCarCost.toLocaleString("en-US"));
		updateMaxPassengers();	// because max is dependent on car number
	}
}
// end of fukutoshin buying functions




































































// Game Loop
window.setInterval(function() {
	makeMoney(gameData.passengers * gameData.ticketPrice);
	generatePassengers(pps);
	
	
}, 1000);



// Autosave Loop
autosaveLoop = window.setInterval(function() {
	save();
	
	
}, 1000);
