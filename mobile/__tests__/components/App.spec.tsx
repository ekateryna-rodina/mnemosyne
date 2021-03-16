import {shallow, ShallowWrapper} from 'enzyme';
import React from 'react';
import {View} from 'react-native';
import App from '../../src/App';

const createTestProps = (props: Object) => ({
  ...props,
});

describe('App', () => {
  describe('rendering', () => {
    let wrapper: ShallowWrapper;
    beforeEach(() => {
      wrapper = shallow(<App />);
    });

    it('should render a <View />', () => {
      expect(wrapper.find(View)).toHaveLength(1);
    });
  });
});
