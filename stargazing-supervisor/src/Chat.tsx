'use client';
import { Chatbox, type SendMessageEvent } from '@talkjs/react-components';
import '@talkjs/react-components/default.css';
import { getTalkSession } from '@talkjs/core';
import { useEffect, useCallback, useState } from 'react';
import './chatbox.css';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
import { markdownToContent } from "./toContent.ts";
import { contentToMarkdown } from "./toMarkdown.ts";
import { getPersonaSystemInstruction } from './personaStore.ts';
import './app.css'; 

interface ChatProps {
  currentConversationId: string;
  isUserCorrect: boolean | null;
  setIsUserCorrect: (value: boolean | null) => void;
}



function Chat(props: ChatProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  
  const appId = 'tY7b9ysM'; // Your Durhack App ID
  const humanId = 'me';
  const botId = 'bot';
  const conversationId = props.currentConversationId;
  const generalInstructions = 
    `Constraints & Tone:
    1. Maintain Character: Speak strictly in the voice, dialect, and persona of your assigned character.
    2. Length: Keep every response concise, between 1 and 3 sentences. Treat this as a casual, brief chat while keeping it interesting
    3. Anonymity: You must NEVER reveal your character's name, title, or provide hints that would make the guess immediately obvious (e.g., "I wear armor").
    4. Goal: Prompt the user to guess. Conclude your turns with a question or comment that continues the dialogue and encourages them to make a guess when they feel ready. `;

    useEffect(() => {
      if (!props.isUserCorrect) {
        triggerTheChaos();
        // Reset the flag after triggering
        setTimeout(() => props.setIsUserCorrect(null), 1100);
      }
    }, [props.isUserCorrect]);
  
    const triggerTheChaos = () => {
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 1000);
    };


  // --- Setup Users and Conversation ---
  useEffect(() => {
    const session = getTalkSession({
      // @ts-ignore
      host: 'durhack.talkjs.com',
      appId,
      userId: humanId
    });
    session.currentUser.createIfNotExists({ name: 'Me' });
    session.user(botId).createIfNotExists({ name: 'Historical Person', photoUrl: 'https://talkjs.com/images/logo-gears.svg' });

    const conversation = session.conversation(conversationId);
    conversation.createIfNotExists();
    conversation.participant(botId).createIfNotExists();
  }, [props.currentConversationId]);

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
          "text": JSON.stringify(generalInstructions + getPersonaSystemInstruction() + 
            " Do not give obvious hints and do not mention your identity or the dates.")
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
    <div className={isSpinning ? 'chaotic-spin-animation' : ''}>
    <Chatbox
      style={{ width: '100%', height: '500px',
        "fontFamily": "EB Garamond, serif",
        "background": "#f8f1e4",
        "borderRadius": 4,
        "accentColor": "#7b1113",
       }}
      className='medievalChatBox'
      // @ts-ignore
      host="durhack.talkjs.com"
      appId={appId}
      userId={humanId}
      conversationId={conversationId}
      onSendMessage={handleSendMessage}
    />
    </div>
  );
}

export default Chat;
