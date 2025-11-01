import { Chatbox } from "@talkjs/react-components";

function Chat() {
  return (
    <div style={{ width: '400px', height: '800px' }}>
      <Chatbox
        appId="tsMik3Ko"
        userId="sample_user_alice"
        conversationId="sample_conversation"
      />
    </div>
  );
}

export default Chat;
