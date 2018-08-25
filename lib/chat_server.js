var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
	io = socketio.listen(server); //Uruchomienie serwera Socket.IO i umożliwienie mu współpracy z istniejącym serwerem HTTP. 
	io.set('log level', 1);
	io.sockets.on('connection', function (socket) {  //Zdefiniowanie sposobu obsłu
		guestNumber = assignGuestName(socket, guestNumber,     nickNames, namesUsed);//  Przypisanie użytkownikowi nazwy gościa podczas nawiązywania połączenia. 
		joinRoom(socket, 'Lobby');  //Umieszczenie użytkownika w pokoju Lobby, gdy próbuje on nawiązać połączenie. 
		handleMessageBroadcasting(socket, nickNames); // Obsługa wiadomości użytkownika, prób zmiany nazwy użytkownika, a także tworzenia lub zmiany pokoju czatu. 
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);
		socket.on('rooms', function() { // Wyświetlenie użytkownika wraz z listą pokoi, w których prowadzi czat. 
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		handleClientDisconnection(socket, nickNames, namesUsed); // Zdefiniowanie logiki wykonywanej podczas rozłączania użytkownika. 
	});
}; 

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Gość' + guestNumber;//  Wygenerowanie nowej nazwy gościa .
	nickNames[socket.id] = name;  //Powiązanie nazwy gościa z identyfikatorem połączenia klienta.   
	socket.emit('nameResult', { // Podanie użytkownikowi wygenerowanej dla niego nazwy. 
		success: true,
		name: name
	});
	namesUsed.push(name); // Zwróć uwagę na użycie nazwy gościa. 
	return guestNumber + 1; // Inkrementacja licznika używanego podczas generowania nazw gości. 
}
