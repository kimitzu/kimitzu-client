import { IonItem, IonLabel, IonSkeletonText } from '@ionic/react'
import React from 'react'

import config from '../../config'
import './ListingCard.css'

const ListingCardSkeleton = () => (
  <div className="listing-container">
    <img className="listing-header" src={`${config.host}/images/Logo/square-black-white.png`} />
    <div className="uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
      <div className="uk-margin-bottom">
        <h4>
          <IonSkeletonText animated width="40%" />
        </h4>
      </div>
      <div className="uk-margin-small-bottom">
        <p>
          <IonSkeletonText animated width="95%" />
        </p>
      </div>
      <div className="uk-margin-small-bottom">
        <p>
          <IonSkeletonText animated width="90%" />
        </p>
      </div>
      <div className="uk-margin-small-bottom">
        <p>
          <IonSkeletonText animated width="65%" />
        </p>
      </div>
      <div className="uk-margin-small-bottom">
        <p>
          <IonSkeletonText animated width="30%" />
        </p>
      </div>
    </div>
  </div>
)

export default ListingCardSkeleton
