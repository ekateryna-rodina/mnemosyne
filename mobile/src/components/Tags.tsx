import React from 'react';
import {Text, View} from 'react-native';

interface ITagsProps {
  tags: string[];
}
const Tags = (props: ITagsProps) => {
  const {tags} = props;
  return (
    <View testID="tagsPreview">
      {tags.map((tag: string, index: number) => (
        <Text key={index.toString()}>{tag}</Text>
      ))}
    </View>
  );
};

export default Tags;
