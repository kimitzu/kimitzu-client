import React from 'react'

import { localeInstance } from '../../i18n'

import config from '../../config'

interface Props {
  avatar: string
  name: string
  amount: string
  note?: string
}

const DisputePayoutSegment = ({ avatar, name, amount, note }: Props) => {
  const { disputeViewPage } = localeInstance.get.localizations

  return (
    <div className="uk-flex uk-flex-row">
      <div>
        <img
          src={
            avatar
              ? `${config.kimitzuHost}/kimitzu/media?id=${avatar}`
              : `${process.env.PUBLIC_URL}/images/user.svg`
          }
          height={40}
          width={40}
        />
      </div>
      <div className="uk-flex uk-flex-column uk-margin-small-left">
        <p className="uk-text-bold">{name}</p>
        <p className="color-secondary">{amount}</p>
        {note ? (
          <p className="color-secondary">
            {disputeViewPage.moderatorNoteParagraph} {note}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default DisputePayoutSegment
