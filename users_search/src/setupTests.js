// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SearchUsers from './SearchUsers';

jest.mock('axios');

describe('SearchUsers', () => {
  it('should search for users and display them', async () => {
    const data = {
      items: [
        { id: 1, login: 'user1', html_url: 'https://github.com/user1' },
        { id: 2, login: 'user2', html_url: 'https://github.com/user2' },
      ],
      total_count: 2,
    };
    axios.get.mockResolvedValue({ data });

    const { getByLabelText, getByText } = render(<SearchUsers />);

    const queryInput = getByLabelText('Search Users:');
    fireEvent.change(queryInput, { target: { value: 'test' } });

    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(axios.get).toHaveBeenCalledWith('https://api.github.com/search/users', {
      params: {
        q: 'test',
        sort: 'followers',
        order: 'desc',
        per_page: 10,
        page: 1,
      },
    });

    const user1 = getByText('user1');
    const user2 = getByText('user2');

    expect(user1).toBeInTheDocument();
    expect(user2).toBeInTheDocument();
  });
});



jest.mock('axios');

describe('SearchUsers', () => {
  it('should sort users by repositories and display them', async () => {
    const data = {
      items: [
        { id: 1, login: 'user1', html_url: 'https://github.com/user1', public_repos: 10 },
        { id: 2, login: 'user2', html_url: 'https://github.com/user2', public_repos: 5 },
      ],
      total_count: 2,
    };
    axios.get.mockResolvedValue({ data });

    const { getByLabelText, getByText } = render(<SearchUsers />);

    const sortBySelect = getByLabelText('Sort By:');
    fireEvent.change(sortBySelect, { target: { value: 'repositories' } });

    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(axios.get).toHaveBeenCalledWith('https://api.github.com/search/users', {
      params: {
        q: '',
        sort: 'repositories',
        order: 'desc',
        per_page: 10,
        page: 1,
      },
    });

    const user1 = getByText('user1');
    const user2 = getByText('user2');

    expect(user1).toBeInTheDocument();
    expect(user2).toBeInTheDocument();

    expect(user1).toBeBefore(user2);
  });
});


