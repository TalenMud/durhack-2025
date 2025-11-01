import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Talk?: any;
  }
}

function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let session: any;

    function createChat() {
      const Talk = (window as any).Talk;
      if (!Talk) return;

      // Minimal demo users. Replace with real user data in production.
      const me = new Talk.User({
        id: "sample_user_alice",
        name: "Alice",
        email: "alice@example.com",
      });
      const other = new Talk.User({
        id: "sample_user_bob",
        name: "Bob",
        email: "bob@example.com",
      });

      session = new Talk.Session({ appId: "tsMik3Ko", me });

      const conversation = session.getOrCreateConversation(Talk.oneOnOneId(me, other));
      conversation.setParticipant(me);
      conversation.setParticipant(other);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);

      if (containerRef.current) {
        chatbox.mount(containerRef.current);
      }
    }

    // Load TalkJS if it's not already on the page
    if (!(window as any).Talk) {
      const script = document.createElement("script");
      script.src = "https://cdn.talkjs.com/talk.js";
      script.async = true;
      script.onload = createChat;
      document.head.appendChild(script);
    } else {
      createChat();
    }

    return () => {
      try {
        (session as any)?.destroy();
      } catch {
        // ignore
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: 400, height: 800 }} />;
}

export default Chat;
