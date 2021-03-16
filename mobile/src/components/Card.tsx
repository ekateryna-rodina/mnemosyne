import React from 'react';
import {Image, Text, View} from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Fontisto';
import {ICard} from '../models/CardsModel';
import Tags from './Tags';
import TrainInfo from './TrainInfo';
Icon.loadFont();
interface ICardProps {
  item: ICard;
}
const Card = (props: ICardProps) => {
  const {item} = props;
  const {image, tags, isFavorite, trainInfo} = item;
  return (
    <View>
      <Tags tags={tags} />
      <Text testID="contentTextPreview"></Text>
      {image && <Image source={image} testID="imagePreview" />}
      {trainInfo && <TrainInfo trainInfo={trainInfo} />}
      {isFavorite && (
        <View>
          <Icon
            testID="favoriteIconPreview"
            name="favorite"
            color="black"
            size={20}
          />
        </View>
      )}
    </View>
  );
};

export default Card;
