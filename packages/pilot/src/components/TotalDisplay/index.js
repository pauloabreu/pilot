import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import DataDisplay from '../DataDisplay'
import currency from '../../formatters/currency'
import style from './style.css'

const renderSymbol = (value) => {
  if (value < 0) {
    return '-'
  }

  if (value > 0) {
    return '+'
  }

  return null
}

const renderValue = (amount, amountSize, color) => {
  const formattedValue = currency(Math.abs(amount))

  return (
    <div className={style.amount}>
      <small style={{ color }}>
        {renderSymbol(amount)}
      </small>
      {
        formattedValue === 'NaN'
        ? <div className={style.empty} />
        : (
          <span className={
            classNames({
              [style[amountSize]]: amountSize,
            })}
          >
            {formattedValue}
          </span>
        )
      }
    </div>
  )
}

const renderTitle = (title, titleColor, color, titleSize) => (
  <span
    className={
      classNames({
        [style[titleSize]]: titleSize,
    })}
    style={{
      color: titleColor || color,
     }}
  >
    {title}
  </span>
)

const TotalDisplay = ({
  align,
  amount,
  amountSize,
  color,
  subtitle,
  title,
  titleColor,
  titleSize,
  valueSize,
}) => (
  <DataDisplay
    align={align}
    color={color}
    subtitle={subtitle}
    title={renderTitle(title, titleColor, color, titleSize)}
    titleSize={titleSize}
    valueSize={valueSize}
  >
    {renderValue(amount, amountSize, color)}
  </DataDisplay>
)

const sizePropType = PropTypes.oneOf(['small', 'medium', 'large', 'huge'])

TotalDisplay.propTypes = {
  align: PropTypes.oneOf([
    'center',
    'end',
    'start',
  ]),
  amount: PropTypes.number.isRequired,
  amountSize: (sizePropType),
  color: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  title: PropTypes.node.isRequired,
  titleColor: PropTypes.string,
  titleSize: (sizePropType),
  valueSize: (sizePropType),
}

TotalDisplay.defaultProps = {
  align: 'center',
  amountSize: 'large',
  subtitle: null,
  titleColor: null,
  titleSize: 'small',
  valueSize: 'medium',
}

export default TotalDisplay
