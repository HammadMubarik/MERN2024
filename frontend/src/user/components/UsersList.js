import React from 'react';
import './UserList.css';
import UserItem from './UsersItem';
import Card from '../../shared/components/UIElements/Card';

const UsersList = (props) => {
  // Ensure props.items exists and is an array
  if (!props.items || props.items.length === 0) {
    return (
      <div className="center">
        <h2>No users found</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
