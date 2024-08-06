import React from "react";

interface Message {
  senderId: string;
  message: string;
  receiverId?: string;
  groupId?: string;
}

interface Props {
  messages: Message[];
  currentUserId: string;
  currentChat: { id: string; type: "user" | "group" } | null;
}

const ChatWindow: React.FC<Props> = ({
  messages,
  currentUserId,
  currentChat,
}) => {
  const filteredMessages = messages.filter(
    (message) =>
      (currentChat?.type === "user" &&
        ((message.senderId === currentUserId &&
          message.receiverId === currentChat.id) ||
          (message.senderId === currentChat.id &&
            message.receiverId === currentUserId))) ||
      (currentChat?.type === "group" && message.groupId === currentChat.id)
  );

  return (
    <div
      style={{
        height: "400px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      {filteredMessages.map((message, index) => (
        <div
          key={index}
          style={{
            textAlign: message.senderId === currentUserId ? "right" : "left",
            margin: "10px 0",

            backgroundColor:
              message.senderId === currentUserId ? "#dcf8c6" : "#f0f0f0",
            padding: "5px 10px",

            borderRadius: "10px",

            // maxWidth: "70%",
            // alignSelf:
            //   message.senderId === currentUserId ? "flex-end" : "flex-start",
            // display: "inline-block",
          }}
        >
          <strong>{message.senderId}: </strong>

          {message.message}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
