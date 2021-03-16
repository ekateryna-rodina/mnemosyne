import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {cards} from '../../data';
import ActionsHeader from './ActionsHeader';
import Card from './Card';
import Filters from './Filters';

const CardsFeed = () => {
  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);
  const data = Object.keys(cards).map((item) => cards[item]);
  return (
    <View>
      <ActionsHeader {...{isFilterShown, setIsFilterShown}} />
      {/* <Filters /> */}
      {isFilterShown && <Filters />}
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
