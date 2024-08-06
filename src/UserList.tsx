import React, { useState } from "react";

interface User {
  userId: string;
  socketId: string;
}

interface Group {
  groupId: string;
  groupName: string;
  members: string[];
}

interface Props {
  users: User[];
  groups: Group[];
  currentUserId: string;
  onUserSelect: (user: User) => void;
  onGroupSelect: (group: Group) => void;
  onCreateGroup: (groupName: string) => void;
  onJoinGroup: (groupId: string) => void;
}

const UserList: React.FC<Props> = ({
  users,
  groups,
  currentUserId,
  onUserSelect,
  onGroupSelect,
  onCreateGroup,
  onJoinGroup,
}) => {
  const [newGroupName, setNewGroupName] = useState("");

  return (
    <div
      style={{ width: "200px", borderRight: "1px solid #ccc", padding: "10px" }}
    >
      <h3>Users</h3>
      {users
        .filter((user) => user.userId !== currentUserId)
        .map((user) => (
          <div
            key={user.userId}
            onClick={() => onUserSelect(user)}
            style={{
              cursor: "pointer",
              padding: "5px",
              margin: "5px 0",
              backgroundColor: "#f0f0f0",
            }}
          >
            {user.userId}
          </div>
        ))}
      <h3>Groups</h3>
      {groups.map((group) => (
        <div
          key={group.groupId}
          style={{
            padding: "5px",
            margin: "5px 0",
            backgroundColor: "#e0e0e0",
          }}
        >
          <span
            onClick={() => onGroupSelect(group)}
            style={{ cursor: "pointer" }}
          >
            {group.groupName} ({group.members.length} members)
          </span>
          {!group.members.includes(currentUserId) && (
            <button
              onClick={() => onJoinGroup(group.groupId)}
              style={{ marginLeft: "10px" }}
            >
              Join
            </button>
          )}
        </div>
      ))}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
        />
        <button
          onClick={() => {
            if (newGroupName) {
              onCreateGroup(newGroupName);
              setNewGroupName("");
            }
          }}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default UserList;
