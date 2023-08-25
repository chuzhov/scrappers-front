import { fetchSuspectedTendersOP } from 'redux/operations/phonebookOps';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Init = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSuspectedTendersOP());
  }, [dispatch]);

  return <></>;
};

export default Init;
