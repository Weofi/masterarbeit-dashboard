import './Card.css';
import {Person} from "../dashboard/dashboard.tsx";
import * as React from "react";


interface CardProps {
  person: Person;
}

const Card: React.FC<CardProps> = ({ person }) => {
  const getImageSrc = () => {
    switch (person.gender) {
      case "Male":
        return `profileIconMale.png?name=${person.id}`;
      case "Female":
        return `profileIconFemale.png?name=${person.id}`;
      default:
        return `profileIconDefault.png?name=${person.id}`;
    }
  };

  return (
    <div className="card">
      <img src={getImageSrc()} alt={`${person.first_name} ${person.last_name} Avatar`} width="256" height="256" />
      <div id={`person_${person.id}`} className="person-info">
        <p><strong>{person.id}: {person.first_name} {person.last_name}</strong></p>
        <p>{person.email}</p>
        <p>{person.gender}</p>
        <p className="balance">{person.balance}</p>
      </div>
    </div>
  );
};

export default Card;
