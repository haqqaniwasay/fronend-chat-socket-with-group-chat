import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import MessageInput from "./MessageInput";

const SOCKET_SERVER_URL = "http://localhost:3001";

interface User {
  userId: string;
  socketId: string;
}

interface Group {
  groupId: string;
  groupName: string;
  members: string[];
}

interface Message {
  senderId: string;
  message: string;
  receiverId?: string;
  groupId?: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<{
    id: string;
    type: "user" | "group";
  } | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      const randomUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(randomUserId);
      newSocket.emit("addUser", { userId: randomUserId });
      newSocket.emit("getGroups");
    });

    newSocket.on("userList", ({ users }) => {
      console.log("Received userList:", users);
      setUsers(users);
    });

    newSocket.on("groupList", ({ groups }) => {
      console.log("Received groupList:", groups);
      setGroups(groups);
    });

    newSocket.on("message", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("groupCreated", (group: Group) => {
      console.log("Group created:", group);
      setGroups((prevGroups) => [...prevGroups, group]);
    });

    newSocket.on("groupUpdated", (updatedGroup: Group) => {
      console.log("Group updated:", updatedGroup);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === updatedGroup.groupId ? updatedGroup : group
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && currentChat) {
      const messageData: Message = {
        senderId: userId,
        message,
        ...(currentChat.type === "user"
          ? { receiverId: currentChat.id }
          : { groupId: currentChat.id }),
      };
      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);
    }
  };

  const createGroup = (groupName: string) => {
    if (socket) {
      const groupId = `group_${Math.random().toString(36).substr(2, 9)}`;
      console.log("Creating group:", { groupId, groupName, userId });
      socket.emit("createGroup", { groupId, groupName, userId });
    }
  };

  const joinGroup = (groupId: string) => {
    if (socket) {
      console.log("Joining group:", { userId, groupId });
      socket.emit("joinGroup", { userId, groupId });
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div style={{ display: "flex" }}>
        <UserList
          users={users}
          groups={groups}
          currentUserId={userId}
          onUserSelect={(user) =>
            setCurrentChat({ id: user.userId, type: "user" })
          }
          onGroupSelect={(group) =>
            setCurrentChat({ id: group.groupId, type: "group" })
          }
          onCreateGroup={createGroup}
          onJoinGroup={joinGroup}
        />
        <div style={{ flex: 1 }}>
          {currentChat ? (
            <>
              <h2>
                {currentChat.type === "user" ? "Private Chat" : "Group Chat"}:{" "}
                {currentChat.id}
              </h2>
              <ChatWindow
                messages={messages}
                currentUserId={userId}
                currentChat={currentChat}
              />
              <MessageInput onSendMessage={sendMessage} />
            </>
          ) : (
            <p>Select a user or group to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
