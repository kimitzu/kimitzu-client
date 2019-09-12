import React from 'react'
import { Link } from 'react-router-dom'
import './BreadCrumb.css'

interface BreadHistory {
  link: string
  name: string
}

interface BreadCrumbProps {
  history: BreadHistory[]
}

const BreadCrumb = ({ history }: BreadCrumbProps) => {
  return (
    <div id="bread-cont">
      <ul className="uk-breadcrumb">
        {history.map((h, i) => (
          <li key={`breaded${i}`}>
            <Link to={`${i !== 0 ? '/' : ''}${h.link}`} className="uk-text-capitalize">
              {h.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BreadCrumb
