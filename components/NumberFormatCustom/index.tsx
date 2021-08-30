import React from 'react';
import NumberFormat from 'react-number-format';

const NumberFormatCustom = (props: any) => {
    const { inputRef, onChange, unit, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
};

export default NumberFormatCustom;
