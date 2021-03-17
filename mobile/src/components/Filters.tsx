import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {Text, TextInput, View} from 'react-native';

interface IFiltersProps {
  showFavorites: boolean;
  setShowFavorites: (showFavorites: boolean) => void;
}
const Filters = (props: IFiltersProps) => {
  const {showFavorites, setShowFavorites} = props;
  const setSelection = (value: boolean) => {
    setShowFavorites(value);
  };
  return (
    <View testID="filtersContainer" style={{flex: 1, backgroundColor: 'red'}}>
      <TextInput style={{flex: 1}} testID="tagsInput" />
      <View>
        <CheckBox
          testID="favoritesCheckBox"
          value={showFavorites}
          onValueChange={(value) => setSelection(value)}
        />
        <Text>Do you want to see favorites only?</Text>
      </View>
    </View>
  );
};

export default Filters;
