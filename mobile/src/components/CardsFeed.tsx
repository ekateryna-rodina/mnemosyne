import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {cards} from '../../data';
import ActionsHeader from './ActionsHeader';
import Card from './Card';
import Filters from './Filters';

const CardsFeed = () => {
  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchHandler = () => {
    console.error('search');
  };
  const data = Object.keys(cards).map((item) => cards[item]);
  return (
    <View>
      <ActionsHeader
        {...{
          isFilterShown,
          setIsFilterShown,
          setSearchTerm,
          searchTerm,
          handleSeach: searchHandler,
        }}
      />
      {isFilterShown && <Filters {...{showFavorites, setShowFavorites}} />}
      <FlatList
        testID="cardsFeed"
        data={data}
        keyExtractor={(key, index) => index.toString()}
        renderItem={({item}) => {
          return <Card item={item} />;
        }}
      />
    </View>
  );
};

export default CardsFeed;
