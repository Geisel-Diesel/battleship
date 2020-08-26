var model = {
    boardsize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        {locations: ["00", "00", "00"], hits: ["", "", ""] },
        {locations: ["00", "00", "00"], hits: ["", "", ""] },
        {locations: ["00", "00", "00"], hits: ["", "", ""] }
    ],

    fire: function(guess) {
        for (var i=0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if(ship.hits[index] === "hit") { 
                view.displayMessage("YOU HAVE ALREADY HIT THIS LOCATION!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT");

                if(this.isSunk(ship)) {
                    view.displayMessage("YOU SANK MY BATTLESHIP!");
                    this.shipsSunk++;
                }

                return true;
            }

        }

        view.displayMiss(guess);
        view.displayMessage("YOU MISSED!");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if(ship.hits[i] !== "hit") {
                return false;
            }
        }

        return true;
    },

    generateShipLocations: function() {
        var locations;
        for(var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while(this.collision(locations));

            this.ships[i].locations = locations;
        }

        console.log("Ships Array: ");
        console.log(this.ships);
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if(direction === 1) {
            row = Math.floor(Math.random() * this.boardsize);
            col = Math.floor(Math.random() * (this.boardsize - this.shipLength + 1));
        }
        else {
            col = Math.floor(Math.random() * this.boardsize);
            row = Math.floor(Math.random() * (this.boardsize - this.shipLength + 1));
        }

        var newShipLocations = [];
        for(var i = 0; i < this.shipLength; i++) {
            if(direction = 1) {
                newShipLocations.push(row + "" + (col + i));
            }
            else {
                newShipLocations.push((row + i) + "" + col);
            }
        }

        return newShipLocations;

    },

    collision: function(locations) {
        for(var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for(var j = 0; j < locations.length; j++) {
                if(ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
                
            }
        }

        return false;
    }
};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if(location) {
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all the battleships in " + this.guesses + " guesses");
            }
        }
    }

};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !== 2) {
        alert("Please enter a valid guess. Must be a letter and a number");
    }
    else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)) {
            alert("Not a valid input");
        }
        else if(row < 0 || row >= model.boardsize || column < 0 || column >= model.boardsize) {
            alert("Input is not located on this board");
        }
        else {
            return row + column;
        }
    }

    return null;
};

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();

    controller.processGuess(guess);

    guessInput.value = "";
};

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");

    e=e || window.event;
    if(e.keycode === 13) {
        fireButton.click();
        return false;
    }
};

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;


};

window.onload = init;