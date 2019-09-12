import React from 'react'

import './TagsCard.css'

interface TagsCardInterface {
  data: string[]
  name: string
}

const TagsCard = (props: TagsCardInterface) => {
  const { data, name } = props
  return (
    <div id="profile-tags" className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-tags" className="uk-card-title">
          {name}
        </h3>
        <div id="tag-content">
          {data.map((d, i) => (
            <span key={`tagid${i}`} className="tag-container uk-box-shadow-small">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TagsCard
