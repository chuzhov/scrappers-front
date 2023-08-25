import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import css from './AddContact.module.css';
import sprite from '../../img/sprites.svg';
import { addContactOp } from 'redux/operations/phonebookOps';

const AddContact = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const tenders = useSelector(state => state.phonebook.tenders.items);

  const dispatch = useDispatch();

  const onSubmitHandler = event => {
    event.preventDefault();

    if (tenders.find(contact => contact.name === name)) {
      alert('This contact is already exist in your contact list');
      return null;
    }
    const isNumberSaved = tenders.find(contact => contact.number === number);
    if (isNumberSaved) {
      alert(
        `This number is already saved in your contact list to ${isNumberSaved.name}`
      );
      return null;
    }

    dispatch(addContactOp({ name, number, isFavorite: false }));

    setName('');
    setNumber('');
  };

  return (
    <form className={css['form']} onSubmit={onSubmitHandler}>
      <label className={css['label']}>
        <span> Name: </span>
        <div className={css['input-wrapper']}>
          <input
            className={css['input']}
            name="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
            title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
            required
            // autoComplete="off"
          />
          {name && (
            <button
              type="button"
              className={css['inline-btn']}
              onClick={() => setName('')}
            >
              <svg className={css['svg-icon']} width="20" height="20">
                <use href={sprite + `#icon-close`}></use>
              </svg>
            </button>
          )}
        </div>
      </label>
      <label className={css['label']}>
        <span> Number: </span>
        <div className={css['input-wrapper']}>
          <input
            className={css['input']}
            type="tel"
            name="number"
            value={number}
            pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
            title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
            required
            onChange={e => setNumber(e.target.value)}
          />
          {number && (
            <button
              type="button"
              className={css['inline-btn']}
              onClick={() => setNumber('')}
            >
              <svg className={css['svg-icon']} width="20" height="20">
                <use href={sprite + `#icon-close`}></use>
              </svg>
            </button>
          )}
        </div>
      </label>
      <button className={css['btn']} type="submit">
        <svg className={css['svg-icon']} width="24" height="24">
          <use href={sprite + `#icon-person_add`}></use>
        </svg>
      </button>
    </form>
  );
};

export default AddContact;
