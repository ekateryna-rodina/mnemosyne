import React from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
FontAwesomeIcon.loadFont();
EntypoIcon.loadFont();
EvilIcon.loadFont();

interface IActionsHeaderProps {
  isFilterShown: boolean;
  setIsFilterShown: (isShown: boolean) => void;
  handleSeach: () => void;
  setSearchTerm: (value: string) => void;
  searchTerm: string;
}
const ActionsHeader = (props: IActionsHeaderProps) => {
  const {
    isFilterShown,
    setIsFilterShown,
    handleSeach,
    setSearchTerm,
    searchTerm,
  } = props;
  return (
    <View
      style={{
        height: 50,
        top: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
        marginHorizontal: 15,
      }}>
      <TextInput
        style={{flex: 2}}
        testID="searchInput"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <Text testID="email"></Text>
      {searchTerm !== '' && (
        <Pressable
          style={{flex: 1}}
          testID="clearSearch"
          onPress={() => setSearchTerm('')}>
          <Text>X</Text>
        </Pressable>
      )}
      <Pressable
        style={{flex: 1}}
        testID="searchButton"
        onPress={() => handleSeach()}>
        <EvilIcon name="search" color="black" size={22} />
      </Pressable>
      <Pressable
        style={{flex: 1}}
        testID="showFilterButton"
        onPress={() => setIsFilterShown(!isFilterShown)}>
        <FontAwesomeIcon name="filter" color="black" size={20} />
      </Pressable>
      <Pressable
        style={{flex: 1}}
        testID="showSortButton"
        onPress={() => console.error()}>
        <FontAwesomeIcon name="sort" color="black" size={20} />
      </Pressable>
      <Pressable
        style={{flex: 1}}
        testID="showAddCardButton"
        onPress={() => console.error()}>
        <EntypoIcon name="add-to-list" color="black" size={20} />
      </Pressable>
    </View>
  );
};

export default ActionsHeader;
