import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//const BASE_URL = 'localhost:4000/api/1.0/tenders';
const BASE_URL = 'http://127.0.0.1:4000/api/1.0/tenders';

export const addContactOp = createAsyncThunk(
  'tenders/addContact',
  async (contact, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/tenders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchSuspectedTendersOP = createAsyncThunk(
  'tenders/fetchContacts',
  async (contact, thunkAPI) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/suspected`);
      return data.tenders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTenderOP = createAsyncThunk(
  'tenders/deleteContact',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/` + id);
      if ((data.message = 'Deleted: ')) {
        return { id: data.id };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateContactOp = createAsyncThunk(
  'tenders/udateContact(isFavorite)',
  async ({ id, isFavorite }, thunkAPI) => {
    const tenders = thunkAPI.getState().phonebook.tenders.items;
    const index = tenders.findIndex(contact => contact.id === id);

    try {
      const data = await fetch(`${BASE_URL}/contacts/` + id, {
        method: 'PUT', //mockip doesn't supports PATCH method
        body: JSON.stringify({
          ...tenders[index],
          isFavorite: !isFavorite,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await data.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
