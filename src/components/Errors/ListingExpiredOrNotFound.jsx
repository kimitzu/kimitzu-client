import React from 'react'
import config from '../../config'

const ListingExpiredOrNotFound = () => {
  return (
    <div className="uk-flex uk-flex-row uk-flex-center">
      <div className="uk-margin-top uk-text-center">
        <img src={`${config.host}/images/warning.png`} alt="error" height="100" width="100" />
        <h1 className="uk-text-danger uk-margin-top">Unable to Retrieve Listing.</h1>
        <p>The listing you requested has either expired on the Djali network or does not exist.</p>

        <div className="uk-margin-top uk-text-left">
          <p>Suggestions:</p>
          <ul className="uk-margin-left">
            <li>Browse other listings.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ListingExpiredOrNotFound
