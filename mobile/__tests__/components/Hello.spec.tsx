import {render} from '@testing-library/react-native';
import React from 'react';
import Hello from '../../src/Hello';

describe('Hello', () => {
  it('renders the correct message', () => {
    const {queryByText} = render(<Hello />);
    expect(queryByText('Hello, world!')).not.toBeNull();
  });
});
