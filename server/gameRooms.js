const { generateQuestion } = require('./questionGenerator');
const { calculateDamage } = require('./damageCalculator');

const rooms = {};

function initGameRooms(io) {
  io.on('connection', (socket) => {
    
    socket.on('createRoom', ({ playerName }) => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      rooms[roomCode] = {
        id: roomCode,
        status: 'waiting',
        players: {
          [socket.id]: {
            id: socket.id,
            name: playerName,
            hp: 100,
            streak: 0,
            ready: false
          }
        },
        currentQuestion: null,
        questionStartTime: 0
      };
      
      socket.join(roomCode);
      socket.emit('roomCreated', { roomCode, players: rooms[roomCode].players });
    });

    socket.on('joinRoom', ({ roomCode, playerName }) => {
      const room = rooms[roomCode];
      
      if (!room) {
        return socket.emit('errorMessage', 'Room not found');
      }
      
      if (Object.keys(room.players).length >= 2) {
        return socket.emit('errorMessage', 'Room is full');
      }
      
      if (room.status !== 'waiting') {
        return socket.emit('errorMessage', 'Battle already started');
      }
      
      room.players[socket.id] = {
        id: socket.id,
        name: playerName,
        hp: 100,
        streak: 0,
        ready: false
      };
      
      socket.join(roomCode);
      socket.emit('roomJoined', { roomCode, players: room.players });
      socket.to(roomCode).emit('playerJoined', { players: room.players });
    });

    socket.on('playerReady', ({ roomCode }) => {
      const room = rooms[roomCode];
      if (!room || !room.players[socket.id]) return;
      
      room.players[socket.id].ready = true;
      
      const allReady = Object.values(room.players).every(p => p.ready);
      if (allReady && Object.keys(room.players).length === 2) {
        room.status = 'battling';
        io.to(roomCode).emit('battleStart');
        
        setTimeout(() => {
          sendNewQuestion(io, roomCode);
        }, 1500);
      }
    });

    socket.on('submitAnswer', ({ roomCode, answer }) => {
      const room = rooms[roomCode];
      if (!room || room.status !== 'battling' || !room.currentQuestion) return;
      
      const player = room.players[socket.id];
      if (!player) return;
      
      const opponentId = Object.keys(room.players).find(id => id !== socket.id);
      const opponent = room.players[opponentId];
      
      // If answer matches
      if (Number(answer) === room.currentQuestion.correctAnswer) {
        const answerTimeMs = Date.now() - room.questionStartTime;
        player.streak += 1;
        
        const damage = calculateDamage(answerTimeMs, player.streak);
        opponent.hp = Math.max(0, opponent.hp - damage);
        
        io.to(roomCode).emit('answerResult', {
          correct: true,
          playerId: socket.id,
          playerName: player.name,
          damage: damage,
          streak: player.streak
        });
        
        io.to(roomCode).emit('hpUpdate', {
          players: room.players
        });
        
        io.to(roomCode).emit('battleLog', {
          message: `${player.name} answered correctly! ${opponent.name} takes ${damage} damage.`,
          type: 'damage'
        });
        
        // Disable answering for this question since someone got it
        room.currentQuestion = null;
        
        if (opponent.hp <= 0) {
          room.status = 'ended';
          io.to(roomCode).emit('battleEnd', { winnerId: socket.id, winnerName: player.name });
        } else {
          // Next question
          setTimeout(() => {
            sendNewQuestion(io, roomCode);
          }, 2000);
        }
      } else {
        // Wrong answer
        player.streak = 0;
        socket.emit('answerResult', {
          correct: false,
          playerId: socket.id,
          penaltyMs: 1000
        });
        
        io.to(roomCode).emit('battleLog', {
          message: `${player.name} answered incorrectly!`,
          type: 'wrong'
        });
      }
    });

    socket.on('leaveRoom', ({ roomCode }) => {
      handleDisconnect(io, socket, roomCode);
    });

    socket.on('disconnect', () => {
      // Find room user was in
      const roomCode = Object.keys(rooms).find(code => rooms[code].players[socket.id]);
      if (roomCode) {
        handleDisconnect(io, socket, roomCode);
      }
    });
  });
}

function sendNewQuestion(io, roomCode) {
  const room = rooms[roomCode];
  if (!room || room.status !== 'battling') return;
  
  room.currentQuestion = generateQuestion();
  room.questionStartTime = Date.now();
  
  io.to(roomCode).emit('newQuestion', {
    questionText: room.currentQuestion.questionText
  });
}

function handleDisconnect(io, socket, roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  
  if (room.players[socket.id]) {
    const playerName = room.players[socket.id].name;
    delete room.players[socket.id];
    
    socket.leave(roomCode);
    
    if (Object.keys(room.players).length === 0) {
      delete rooms[roomCode];
    } else {
      io.to(roomCode).emit('opponentDisconnected', { playerName });
      // End game if battling
      if (room.status === 'battling') {
        room.status = 'ended';
      }
    }
  }
}

module.exports = { initGameRooms };
