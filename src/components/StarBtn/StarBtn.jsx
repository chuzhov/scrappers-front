import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import css from './StarBtn.module.css';
import sprite from '../../img/sprites.svg';
import { updateContactOp } from 'redux/operations/phonebookOps';

const StarBtn = ({ id, isFavorite }) => {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className={css['favorite-button']}
      onClick={e => dispatch(updateContactOp({ id, isFavorite }))}
    >
      <svg
        className={isFavorite ? css['svg-icon is-starred'] : css['svg-icon']}
        width="20"
        height="20"
      >
        <use href={sprite + `#icon-star`}></use>
      </svg>
    </button>
  );
};
export default StarBtn;

StarBtn.propTypes = {
  id: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};
