// import React from 'react';
// import {FlatList, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
// import CardsFeed from './components/CardsFeed';

// declare const global: {HermesInternal: null | {}};

// const App = () => {
//   return (
//     <View>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         {/* <CardsFeed testID={'cardsFeedComponent'} /> */}
//         <FlatList
//         testID="cardsFeed"
//         data={[]}
//         renderItem={({item}) => {
//           return <View></View>;
//         }}
//       />
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({});

// export default App;

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import CardsFeed from './components/CardsFeed';

declare const global: {HermesInternal: null | {}};

const App = () => {
  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <CardsFeed />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
