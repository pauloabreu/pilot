import React from 'react'
import AutoSuggest from 'react-autosuggest'
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import PropTypes from 'prop-types'
import { FormInput } from 'former-kit'

import style from './style.css'

const getSuggestions = (data, value) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0 ? [] : data.filter(option =>
    option.name.toLowerCase().includes(inputValue)
  )
}

const getSuggestionValue = suggestion => suggestion.name

const renderSuggestion = (suggestion, { query }) => {
  const matches = AutosuggestHighlightMatch(suggestion.name, query)
  const parts = AutosuggestHighlightParse(suggestion.name, matches)

  const generateKey = (i, part) => `${part}-${i}`

  return (
    <div className={style.item}>
      {parts.map((part, index) => {
        const className = part.highlight ? style.match : null

        return (
          <span className={className} key={generateKey(index, part)}>
            {part.text}
          </span>
        )
      })}
    </div>
  )
}

class SuggestionInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value,
      suggestions: props.data,
    }

    this.onChange = this.onChange.bind(this)
    this.renderInput = this.renderInput.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
  }

  onChange (event, { newValue: value }) {
    this.setState({
      value,
    })

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  onSuggestionsFetchRequested ({ value }) {
    const { data } = this.props

    this.setState({
      suggestions: getSuggestions(data, value),
    })
  }

  onSuggestionsClearRequested () {
    this.setState({
      suggestions: [],
    })
  }

  renderInput (props) {
    const { renderer } = this.props

    if (renderer) {
      return renderer(props)
    }

    return <FormInput {...props} />
  }

  render () {
    const { placeholder, itemRenderer } = this.props
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
    }

    return (
      <AutoSuggest
        focusInputOnSuggestionClick={false}
        getSuggestionValue={getSuggestionValue}
        inputProps={inputProps}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        renderInputComponent={this.renderInput}
        renderSuggestion={itemRenderer || renderSuggestion}
        suggestions={suggestions}
        theme={{
          // container: style.container,
          // containerOpen: 'react-autosuggest__container--open',
          // input: 'react-autosuggest__input',
          // inputOpen: 'react-autosuggest__input--open',
          // inputFocused: 'react-autosuggest__input--focused',
          suggestionsContainer: style.container,
          // suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
          suggestionsList: style.containerList,
          suggestion: style.item,
          // suggestionFirst: 'react-autosuggest__suggestion--first',
          suggestionHighlighted: style.highlighted,
          // sectionContainer: 'react-autosuggest__section-container',
          // sectionContainerFirst: 'react-autosuggest__section-container--first',
          // sectionTitle: 'react-autosuggest__section-title',
        }}
      />
    )
  }
}

SuggestionInput.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  itemRenderer: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  renderer: PropTypes.node,
  value: PropTypes.string,
}

SuggestionInput.defaultProps = {
  itemRenderer: null,
  onChange: null,
  placeholder: '',
  renderer: null,
  value: '',
}

export default SuggestionInput
