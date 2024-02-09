import 'regenerator-runtime/runtime';
import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { otherRoutes } from '../api/api';

const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [botResponses, setBotResponses] = useState([]);
  const chatRef = useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await otherRoutes.chatbot(userInput);
      setBotResponses([...botResponses, response.data]);
      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [botResponses]);

  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const renderBotResponses = () => {
    return botResponses.map((response, index) => (
      <div key={index} className="message">
        <strong><span className='bot'>Bot :</span> </strong>
        {response.split('.').map((sentence, sentenceIndex) => (
          <React.Fragment key={sentenceIndex}>
            {sentence.trim()}<br />
          </React.Fragment>
        ))}
      </div>
    ));
  };

  return (
    <div className='chat-container'>
      <div className="chat-messages" ref={chatRef}>
        {renderBotResponses()}
      </div>
      {/*<button onClick={handleSpeechRecognition} style={{ margin: "10px" }}>Start Speech Recognition</button>*/}
      <div className="chat-input">
        <input type="text" value={userInput} onChange={handleUserInput} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="buffer"></div>
    </div>
  );
};

export default Chat;
