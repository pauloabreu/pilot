import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { mapObjIndexed } from 'ramda'
import {
  Col,
  Row,
} from 'former-kit'

import Property from '../Property'

const renderProperty = (title, value) => (
  <Property
    title={title}
    value={value}
  />
)

const fields = (labels, contents) => mapObjIndexed((label, key) =>
  renderProperty(label, contents[key]),
labels)

const CaptureDetails = ({
  contents, labels,
}) => {
  const {
    cardBrand,
    cardNumber,
    customerEmail,
    customerName,
    installments,
  } = fields(labels, contents)

  return (
    <Fragment>
      { (contents.customerName || contents.customerEmail) &&
        <Row>
          <Col palm={12} tablet={8} desk={8} tv={8}>
            {customerName}
          </Col>
          <Col palm={12} tablet={4} desk={4} tv={4}>
            {customerEmail}
          </Col>
        </Row>
      }
      { contents.cardNumber &&
        <Row>
          <Col palm={12} tablet={4} desk={4} tv={4}>
            {cardNumber}
          </Col>
          <Col palm={12} tablet={4} desk={4} tv={4}>
            {cardBrand}
          </Col>
          <Col palm={12} tablet={4} desk={4} tv={4}>
            {installments}
          </Col>
        </Row>
      }
    </Fragment>
  )
}

CaptureDetails.propTypes = {
  labels: PropTypes.shape({
    cardBrand: PropTypes.string,
    cardNumber: PropTypes.string,
    customerEmail: PropTypes.string,
    customerName: PropTypes.string,
    installments: PropTypes.string,
  }).isRequired,
  contents: PropTypes.shape({
    cardBrand: PropTypes.node,
    cardNumber: PropTypes.node,
    customerEmail: PropTypes.node,
    customerName: PropTypes.node,
    installments: PropTypes.node,
  }).isRequired,
}

export default CaptureDetails
