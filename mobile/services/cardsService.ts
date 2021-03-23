import axios from 'axios';
import {ICard} from '../src/models/CardsModel';

export const getUserCards = async () => {
  const cards = await axios.get('http://mnemosyne.com/cards/');
  return cards.data;
};

export const createCard = async (card: ICard) => {
  const newCard = await axios.post('http://mnemosyne.com/cards/create', card);
  return newCard.data;
};
