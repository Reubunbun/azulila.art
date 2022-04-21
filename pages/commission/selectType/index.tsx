import { Page } from '../../../interfaces/index';
import { useAppContext } from '../../../context/AppContext';
import RadioButtons from '../../../components/RadioButtons/RadioButtons';
import styles from './SelectType.module.css';

const CommissionSelectType: Page = () => {
  const {
    priceTotal,
    setPriceTotal,
    baseTypes,
    selectedBaseType,
    setSelectedBaseType,
  } = useAppContext('commissionData');

  return (
    <>
      <h2>Select Type - {priceTotal}</h2>
      <div className={styles.containerSelectType}>
        <div className={styles.containerOptions}>
          <RadioButtons
            groupName='baseTypes'
            options={
              baseTypes.map(commType => ({
                display: `${commType.display} ($${commType.price})`,
                value: commType.id,
              }))
            }
            selected={selectedBaseType?.id}
            onValueSelected={value => {
              const newBaseType = baseTypes.find(commType => commType.id === value);
              console.log({newBaseType});
              if (!newBaseType) {
                return;
              }

              setSelectedBaseType(newBaseType);
            }}
          />
        </div>
        <div className={styles.containerExample}>
          {selectedBaseType?.exampleImage &&
            <img
              src={selectedBaseType.exampleImage}
              alt={`Example image for ${selectedBaseType.display}`}
            />
          }
        </div>
      </div>
    </>
  );
};

CommissionSelectType.title = 'Select Commission Type';

export default CommissionSelectType;
