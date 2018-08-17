import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import style from './style.css'

const DataDisplay = ({
  align,
  children,
  color,
  subtitle,
  title,
  titleSize,
  value,
  valueSize,
}) => (
  <div className={
      classNames(style.content, {
        [style[align]]: align,
      })
    }
  >
    <div className={
      classNames(style.title, {
        [style[titleSize]]: titleSize,
        })
      }
    >
      {
        typeof title === 'string'
          ? (
            <h2 style={{ color }}>
              {title}
            </h2>
          )
          : title
      }
    </div>

    {children || (
      <div className={
        classNames(style.value, {
          [style[valueSize]]: valueSize,
          })
        }
      >
        <h3>{value}</h3>
      </div>
    )}

    <div className={style.subtitle}>
      {subtitle}
    </div>
  </div>
)

const sizePropType = PropTypes.oneOf(['small', 'medium', 'large', 'huge'])

DataDisplay.propTypes = {
  align: PropTypes.oneOf([
    'center',
    'end',
    'start',
  ]),
  children: PropTypes.node,
  color: PropTypes.string,
  subtitle: PropTypes.node,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  titleSize: (sizePropType),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  valueSize: (sizePropType),
}

DataDisplay.defaultProps = {
  align: 'center',
  children: null,
  color: '#757575',
  subtitle: null,
  titleSize: 'small',
  value: '',
  valueSize: 'medium',
}

export default DataDisplay
