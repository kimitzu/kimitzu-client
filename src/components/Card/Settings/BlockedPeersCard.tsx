import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { CircleSpinner } from '../../Spinner'

import Profile from '../../../models/Profile'
import Settings from '../../../models/Settings'

import './BlockedPeersCard.css'

interface BlockedPeersCardProps {
  settings: Settings
}

const BlockedPeersCard = ({ settings }: BlockedPeersCardProps) => {
  const profiles: Profile[] = []
  const [blockedPeersInformation, setBlockedPeersInformation] = useState(profiles)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  useEffect(() => {
    ;(async () => {
      const peersInformation = await Promise.all(
        settings.blockedNodes.map(async nodeID => {
          try {
            const profile = await Profile.retrieve(nodeID)
            return profile
          } catch (error) {
            return new Profile()
          }
        })
      )
      setIsFetching(false)
      setBlockedPeersInformation(peersInformation)
    })()
  }, [])
  if (isFetching) {
    return (
      <div className="uk-flex uk-flex-center uk-flex-middle">
        <CircleSpinner />
      </div>
    )
  } else if (blockedPeersInformation.length === 0) {
    return <div>No blocked peers.</div>
  }
  const handleUnblock = async (nodeID, index) => {
    try {
      await Settings.unblockANode(nodeID)
      settings.blockedNodes.splice(index, 1)
      const blockedPeersInfoCopy = [...blockedPeersInformation]
      blockedPeersInfoCopy.splice(index, 1)
      setBlockedPeersInformation(blockedPeersInfoCopy)
      window.UIkit.notification('Peer unblocked successfully!', { status: 'success' })
    } catch (error) {
      window.UIkit.notification('Something went wrong. Please try again later.', {
        status: 'error',
      })
    }
  }
  return (
    <div>
      {settings.blockedNodes.map((nodeID, index) => {
        return (
          <div
            className="uk-card uk-card-default uk-card-body uk-margin-small-bottom uk-flex uk-flex-row uk-padding-small uk-flex-middle"
            key={nodeID}
          >
            <div className="uk-flex uk-flex-row uk-width-1-1">
              <div>
                <img
                  className="uk-border-circle"
                  id="blocked-peer-thumbnail"
                  src={blockedPeersInformation[index]!.getAvatarSrc('small')}
                />
              </div>
              <div className="uk-padding-small uk-padding-remove-vertical uk-width-4-5 uk-text-truncate">
                <Link to={`/profile/${nodeID}`}>{nodeID}</Link>
                <div>{blockedPeersInformation[index]!.name}</div>
              </div>
            </div>
            <a
              className="uk-text-right"
              data-uk-icon="icon: close"
              onClick={() => handleUnblock(nodeID, index)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default BlockedPeersCard
