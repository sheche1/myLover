import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function ChatPage({ myEmail, friendEmail }) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const stompClientRef = useRef(null);

  const createRoomId = (email1, email2) => {
    return (email1 < email2)
      ? email1 + '_' + email2
      : email2 + '_' + email1;
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      console.log('Conectado a STOMP');
      setConnected(true);

      const roomId = createRoomId(myEmail, friendEmail);
      stompClient.subscribe(`/topic/chat/${roomId}`, (frame) => {
        const chatMessage = JSON.parse(frame.body);
        setMessages(prev => [...prev, chatMessage]);
      });
    }, (error) => {
      console.error('Error al conectar STOMP', error);
    });

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("Desconectado de STOMP");
        });
      }
    };
  }, [myEmail, friendEmail]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    if (!connected || !stompClientRef.current) return;

    const roomId = createRoomId(myEmail, friendEmail);
    const chatMessage = {
      sender: myEmail,
      receiver: friendEmail,
      content: newMsg.trim()
    };

    stompClientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });

    setNewMsg('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 6 }}>
      <h3>Chat con {friendEmail}</h3>
      <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '1rem', padding: '0.5rem' }}>
        {messages.map((msg, i) => {
          const isMine = (msg.sender === myEmail);
          return (
            <div key={i} style={{ textAlign: isMine ? 'right' : 'left', margin: '0.5rem 0' }}>
              <strong>{isMine ? 'Yo' : msg.sender}:</strong> {msg.content}
              <div style={{ fontSize: '0.8rem', color: '#999' }}>
                {msg.timestamp || ''}
              </div>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Escribe tu mensaje"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        style={{ width: '75%', marginRight: '0.5rem' }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default ChatPage;
