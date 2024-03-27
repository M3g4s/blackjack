// components/Card.tsx

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
 card: {
    code: string;
    image: string;
    value: number;
 };
}

const Card: React.FC<CardProps> = ({ card }) => {
 return (
    <div className={styles.card}>
      <img src={card.image} alt={card.code} className={styles.cardImage} />
      <p className={styles.cardValue}>{card.value}</p>
    </div>
 );
};

export default Card;
