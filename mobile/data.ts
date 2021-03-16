import moment from 'moment';
import {ICards} from './src/models/CardsModel';

export const cards: ICards = {
  '1': {
    category: 'Art',
    question: 'What is the name of this painting?',
    content:
      '{The Mona Lisa} is a {half-lenght} {oil portrait} by {Italian} artist {Leonardo Da Vinci}',
    tags: ['History', 'Art', '1600th'],
    image: require('./assets/images/Medusa-Caravaggio.jpg'),
    isFavorite: false,
    options: [
      'A starry Night',
      'The Mona Lisa',
      'The Persistence of Memory',
      'Son of Man',
    ],
  },
  '2': {
    category: 'Art',
    question: 'Who is this famous snake-headed lady?',
    content:
      'In {Greek} mythology, {Medusa} was one of {three} monstrous {Gorgons}. She is also called {Gorgo}',
    tags: ['History', 'Myth', 'Greek'],
    image: require('./assets/images/MonaLisa.jpg'),
    isFavorite: true,
    trainInfo: {
      progress: {
        total: 5,
        success: 3,
      },
      status: 'active',
      lastUpdate: moment().toDate(),
      nextActivityScheduledDate: moment().add(2, 'd').toDate(),
    },
  },
};
