const users=[]

const addUser= ({id, name, room})=>{
    // checking whether a user already exists or not
    // if exists return error else add new user to list of users and return user
    name= name.trim().toLowerCase();
    room= room.trim().toLowerCase();
    const existingUser = users.find((user)=> user.room === room && user.name === name);
    if(existingUser){
        return {error: 'Username is taken'}
    }
    const user = {id, name, room};
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];
}
  

// return the user with id
const getUser = (id) => users.find((user) => user.id === id);

// return all the users present in the same room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);


module.exports = {addUser, removeUser, getUser, getUsersInRoom};