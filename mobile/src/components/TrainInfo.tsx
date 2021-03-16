import React from 'react';
import {Text, View} from 'react-native';
import {ITrainInfo} from '../models/CardsModel';

interface ITrainInfoProps {
  trainInfo: ITrainInfo;
}
const TrainInfo = (props: ITrainInfoProps) => {
  const {trainInfo} = props;
  const {
    progress: {total, success},
    status,
  } = trainInfo;
  return (
    <View>
      <Text testID="trainInfoPreview">
        {success} of {total}
      </Text>
    </View>
  );
};

export default TrainInfo;
