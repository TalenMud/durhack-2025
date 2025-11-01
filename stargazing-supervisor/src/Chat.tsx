'use client';
import { Chatbox, type SendMessageEvent } from '@talkjs/react-components';
import '@talkjs/react-components/default.css';
import { getTalkSession } from '@talkjs/core';
import { useEffect, useCallback, useState } from 'react';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
import { markdownToContent } from "./toContent.ts"
import { contentToMarkdown } from "./toMarkdown.ts"
import { getRandomPersonaPrompt } from './randomGuy.ts';

const [personPrompt, setPersonPrompt] = useState('');


function Chat() {
  const appId = 'tY7b9ysM'; // Your Durhack App ID
  const humanId = 'me';
  const botId = 'bot';
  const conversationId = 'human-vs-bot';



  


  // --- Setup Users and Conversation ---
  useEffect(() => {
    const session = getTalkSession({
      // @ts-ignore
      host: 'durhack.talkjs.com',
      appId,
      userId: humanId
    });
    session.currentUser.createIfNotExists({ name: 'Me' });
    session.user(botId).createIfNotExists({ name: 'Chatbot', photoUrl: 'https://talkjs.com/images/logo-gears.svg' });

    const conversation = session.conversation(conversationId);
    conversation.createIfNotExists();
    conversation.participant(botId).createIfNotExists();
  }, []);

  // --- The Magic Bit ---
  const handleSendMessage = useCallback(async (event: SendMessageEvent) => {
    // event.message is the message the human just sent
    const userMessage = contentToMarkdown(event.message.content);

    // 1. Send the user's message to your chatbot API
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey, // The API key is sent with the request
        },
        body: JSON.stringify({
          
          "system_instruction": {
      "parts": [
        {
          "text": JSON.stringify(prompt)
        }
      ]
    },
          
          "contents": [
      {
        "parts": [
          {
            "text": userMessage
          }
        ]
      }
    ]}),
      });

      const botResponse = await response.json();
      const botMessage = botResponse.candidates[0].content.parts[0].text; // Adjust based on your API response structure
      // 2. Send the chatbot's reply back to the conversation
      // We need a session for the BOT to send a message as the bot
      const botSession = getTalkSession({
        // @ts-ignore
        host: 'durhack.talkjs.com',
        appId,
        userId: botId
      });


      const botContent = markdownToContent(botMessage);
      const conversation = botSession.conversation(conversationId);
      await conversation.send({content: botContent as any});

    } catch (error) {
      console.error('Failed to get bot response:', error);
      // maybe send an error message back to the user
    }

  }, [appId, conversationId]);

  return (
    <Chatbox
      style={{ width: '100%', height: '500px' }}
      // @ts-ignore
      host="durhack.talkjs.com"
      appId={appId}
      userId={humanId}
      conversationId={conversationId}
      onSendMessage={handleSendMessage}
    />
  );
}

export default Chat;
