var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {}; //Obiekt cache służy do przechowywania buforowanych plików
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

//error 404
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: plik nie został znaleziony.');
  response.end();
}

//sending html file
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

//check buffer
function serveStatic(response, cache, absPath) { // Sprawdzenie, czy plik jest buforowany w pamięci. 
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]); // Udostępnienie pliku z pamięci. 
	} else {
		fs.exists(absPath, function(exists) { // Sprawdzenie, czy plik istnieje. 
			if (exists) {
		    	fs.readFile(absPath, function(err, data) { // Odczyt pliku z dysku. 
					if (err) {
					    send404(response);
					} else {
					    cache[absPath] = data;
					    sendFile(response, absPath, data); // Udostępnienie pliku odczytanego z dysku. 
					}
		    	});
			} else {send404(response); }// Wysłanie odpowiedzi HTTP 404. 
		});
	}
}

var server = http.createServer(function(request, response) {  //Utworzenie serwera HTTP za pomocą funkcji anonimowej definiującej zachowanie w poszczególnych żądaniach. 
	var filePath = false;
	if (request.url == '/') {  //Wskazanie pliku HTML, który ma być domyślnie udostępniany. 
		filePath = 'public/index.html';
	} else {
	  filePath = 'public' + request.url;  //Zamiana adresu URL na względną ścieżkę dostępu do pliku. 
	}
	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);  //Udostępnienie pliku statycznego. 
});

server.listen(3000, function() {
	console.log("Serwer nasłuchuje na porcie 3000.");
});

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
  
  
  
  

