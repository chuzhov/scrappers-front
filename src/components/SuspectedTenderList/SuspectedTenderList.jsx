import { useSelector } from 'react-redux';
import DeleteContactBtn from 'components/DeleteContactBtn/DeleteContactBtn';
import css from './SuspectedTenderList.module.css';
import {
  getSuspectedTenders,
  getIsSuspectedTendersLoading,
} from 'redux/selectors/suspectedTendersSelectors';

const SuspectedTenderList = () => {
  const tenders = useSelector(getSuspectedTenders);
  const isLoading = useSelector(getIsSuspectedTendersLoading);

  const tenderItems = items => {
    if (items.length === 0) return;
    const tenderItems = items.map((item, index) => {
      // In this example, we are generating a list item for each element in the dataArray
      return (
        <li key={index}>
          {item?.description} {item?.unit?.name} {item?.quantity}
        </li>
      );
    });
    return tenderItems;
  };

  console.dir(tenders);

  return isLoading ? (
    'Loading...'
  ) : tenders.length ? (
    <ul className={css['list']}>
      {tenders.map(tender => (
        <li key={'li' + tender._id} className={css['item']}>
          <div>
            <ul>{tenderItems(tender.items)}</ul>
            <p>{tender.procuringEntity.name}</p>
            <a
              href={'https://prozorro.gov.ua/tender/' + tender.tenderID}
              rel="noreferrer"
              target="_blank"
            >
              {tender.tenderID}
            </a>
          </div>
          <DeleteContactBtn id={tender._id} />
        </li>
      ))}
    </ul>
  ) : tenders.length === 0 ? (
    <p>Your contact list is empty</p>
  ) : (
    <p>There aren't tenders matching Your query</p>
  );
};

export default SuspectedTenderList;
