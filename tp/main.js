var seleccion = {

    init: function () {
        this.getCache();
        this.showSelector();
        this.getUserCase();
    },

    getCache: function () {
        this.body = document.getElementsByTagName("body");
        this.selector = document.getElementById("selectorParent");
        this.buttonParent = document.getElementById("start");
    },

    hideSelector: function () {
        this.selector.style.display = "none";
    },

    showSelector: function () {
        this.selector.style.display = "flex";
    },

    getUserCase: function () {
        this.selector.addEventListener("click", this.getEvent);
    },

    getEvent: function (e) {
        if (e.target.className == "start-game") {
            seleccion.hideSelector();
            var p1 = document.getElementById("player1");
            var p2 = document.getElementById("player2");
            p1.setAttribute("name", "O");
            p1.setAttribute("number", 1);
            p2.setAttribute("name", "X");
            p2.setAttribute("number", 2);
            game.init(p1, p2);
        }
    }

}

var game = {

    player1: "",
    player2: "",
    player: "",

    cacheGame: {
        player1Moves: [],
        player2Moves: [],
        playerMoves: [],
        win: false,
        generatedDashboard: false
    }

    , winColumn: [["0", "3", "6"], ["1", "4", "7"], ["2", "5", "8"]]

    , winRow: [["0", "1", "2"], ["3", "4", "5"], ["6", "7", "8"]]

    , winDiagonal: [["0", "4", "8"], ["2", "4", "6"]]


    , init: function (p1, p2) {
        this.mapDom();
        this.generateBoard();
        this.addListeners();
        this.player1 = p1;
        this.player2 = p2;
        document.getElementById("indicator-p1").innerHTML = game.player1.value;
        document.getElementById("indicator-p2").innerHTML = game.player2.value;
        document.getElementById("p1").classList.replace("player", "player-turn");
        this.player = this.player1;
    }

    , $: function (id) {
        return doc.getElementById(id)
    }

    , forEach: function (list, iterator) {
        return Array.prototype.forEach.call(list, iterator);
    }

    , mapDom: function () {
        this.ingame = document.getElementById('in-game')
        this.board = document.getElementById('board');
        this.marker = document.getElementById('turn');
        this.indicator = document.getElementById('indicator');

        return this;
    }

    , generateBoard: function () {

        this.ingame.style.display = "flex";
        if(game.cacheGame.generatedDashboard===false){
            this.generateTable();
        }
        var columna = 0;
        for (var i = 0; i < 3; i++) {
            this.generateFila();
            for (var j = 0; j < 3; j++) {
                this.generateCol(columna);
                columna++;
            }
        }
    }

    , generateTable: function () {
        var parentBox = document.createElement("div");
        parentBox.className = "container-box";
        parentBox.id = "container-box";
        var parentBase = document.createElement("div");
        parentBase.className = "container";
        parentBase.id = "container";
        parentBox.appendChild(parentBase);
        document.getElementById("board").appendChild(parentBox);
        this.parentBase = document.getElementById("container");
    }
    , generateFila: function () {
        let rowElement = document.createElement("DIV");
        rowElement.className = "fila";
        this.parentBase.appendChild(rowElement);
    }
    , generateCol(block) {
        let colElemnt = document.createElement("p");
        colElemnt.className = "block";
        colElemnt.setAttribute("id", block);
        this.parentBase.appendChild(colElemnt);
    }

    , addListeners: function () {
        this.parentBase.addEventListener("click", this.playerTurn);
        document.getElementById("surrender").addEventListener("click", this.surrender);
        document.getElementById("restart").addEventListener("click", restart.restart);
        game.cacheGame.generatedDashboard = true;
    }

    , endGame: function (winner) {
        document.getElementById("turn").style.display = "none";
        document.getElementById("container").style.display = "none";
        var parentBase = document.createElement("div");
        parentBase.className = "end-game-container";
        parentBase.id = "end-game";
        var parentBox = document.getElementById("container-box");
        parentBox.appendChild(parentBase);
        document.getElementById("surrender").style.display = "none";
        document.getElementById("in-game").style.height = "690px";
        document.getElementById("restart-box").style.display = "flex";

        if (winner === null) {
            document.getElementById("end-game").innerHTML = "Tie";

        } else {
            document.getElementById("end-game").innerHTML = winner.value;
        }

    }

    , surrender: function () {
        var winner = game.player1;
        if (game.player.name == "O") {
            winner = game.player2;
        }
        game.endGame(winner);
    }

    , playerTurn: function (e) {
        if (e.target && e.target.className === "block" && e.target.innerHTML === "") {

            var coords = e.target.id;
            game.updateTable(coords, game.player);

            if (game.player.name === "O") {
                game.cacheGame.player1Moves.push(coords);
                game.checkWin(game.cacheGame.player1Moves);
            } else {
                game.cacheGame.player2Moves.push(coords);
                game.checkWin(game.cacheGame.player2Moves);
            }

            if (game.cacheGame.win) {
                game.endGame(game.player);
            } else if (game.player.name === "O" && game.cacheGame.player1Moves.length === 5 && !game.cacheGame.win) {
                game.endGame(null)
            } else {
                game.changeTurn();
            }

        }

    }

    , changeTurn: function () {
        if (game.player.name === "O") {
            game.player = game.player2;
            document.getElementById("p1").classList.replace("player-turn", "player");
            document.getElementById("p2").classList.replace("player", "player-turn");
        } else {
            game.player = game.player1;
            document.getElementById("p2").classList.replace("player-turn", "player");
            document.getElementById("p1").classList.replace("player", "player-turn");
        }
    }

    , updateTable: function (coords) {
        document.getElementById(coords).innerHTML = this.player.name;
        document.getElementById(coords).classList.replace("block", "block-2");

    }

    , checkWin: function (player) {

        game.check(player, game.winRow);
        game.check(player, game.winColumn);
        game.check(player, game.winDiagonal);
    }

    , check(player, wins) {

        var i = 0;
        while (i < wins.length && game.cacheGame.win === false) {

            var assert = 0;
            var combination = wins[i];
            for (var j = 0; j < 3; j++) {
                var element = combination[j];
                for (let k = 0; k < player.length; k++) {
                    var val = player[k];
                    if (element === val) {
                        assert++;
                    }
                }
            }
            game.cacheGame.win = assert === 3;
            i++;
        }
    }
}

var restart = {
    restart: function () {
        game.ingame.style.display = "none";
        seleccion.init();
    }

};


window.onload = function () {
    seleccion.init();
}