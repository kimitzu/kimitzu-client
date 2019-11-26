import React from 'react'

import config from '../../config'
import { localeInstance } from '../../i18n'

const ListingExpiredOrNotFound = () => {
  const { notFoundComponent } = localeInstance.get.localizations.listingPage
  return (
    <div className="uk-flex uk-flex-row uk-flex-center">
      <div className="uk-margin-top uk-text-center">
        <img src={`${config.host}/images/warning.png`} alt="error" height="100" width="100" />
        <h1 className="uk-text-danger uk-margin-top">{notFoundComponent.header}</h1>
        <p>{notFoundComponent.paragraph}</p>

        <div className="uk-margin-top uk-text-left">
          <p>{notFoundComponent.suggestionsText}:</p>
          <ul className="uk-margin-left">
            {notFoundComponent.suggestions.map((suggestion, index) => (
              <li key={`${suggestion}-${index}`}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ListingExpiredOrNotFound
