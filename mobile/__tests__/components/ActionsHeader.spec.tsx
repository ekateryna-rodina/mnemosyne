import {shallow, ShallowWrapper} from 'enzyme';
import React from 'react';
import ActionsHeader from '../../src/components/ActionsHeader';

describe('Actions Header', () => {
  const searchTerm = 'Mona';
  const handleSeach = jest.fn();
  const setSearchTerm = jest.fn();
  const setIsFilterShown = jest.fn();
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ActionsHeader
        isFilterShown={false}
        setIsFilterShown={setIsFilterShown}
        handleSeach={handleSeach}
        setSearchTerm={setSearchTerm}
        searchTerm={''}
      />,
    );
  });
  it('calls search with entered text', () => {
    wrapper
      .findWhere((cmp) => cmp.props().testID === 'searchInput')
      .simulate('changeText', searchTerm);
    expect(setSearchTerm).toBeCalledWith(searchTerm);
    wrapper
      .findWhere((cmp) => cmp.props().testID === 'searchButton')
      .simulate('press');
    expect(handleSeach).toBeCalledTimes(1);
  });
  it('clears output on clear', () => {
    wrapper
      .findWhere((cmp) => cmp.props().testID === 'searchInput')
      .simulate('changeText', searchTerm);
    wrapper
      .findWhere((cmp) => cmp.props().testID === 'clearSearch')
      .simulate('press');
    expect(setSearchTerm).toBeCalledWith('');
  });
});
