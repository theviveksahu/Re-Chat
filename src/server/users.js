const users = [];

const addUser = ({ id, username, selectedChannel }) => {
  username = username.trim().toLowerCase();
  const user = { id, username, selectedChannel };
  users.push(user);
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (selectedChannel) => users.filter((user) => user.selectedChannel === selectedChannel);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };