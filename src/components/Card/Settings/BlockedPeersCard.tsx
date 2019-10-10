import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Profile from '../../../models/Profile'
import Settings from '../../../models/Settings'

interface BlockedPeersCardProps {
  settings: Settings
}

const BlockedPeersCard = (props: BlockedPeersCardProps) => {
  const profiles: Profile[] = []
  const [blockedPeersInformation, setBlockedPeersInformation] = useState(profiles)

  useEffect(() => {
    ;(async () => {
      const peerInformationRequest = props.settings.blockedNodes.map(nodeID => {
        return Profile.retrieve(nodeID)
      })
      const peerInformationResponse = await Promise.all(peerInformationRequest)

      setBlockedPeersInformation(peerInformationResponse)
    })()
  }, [])

  if (blockedPeersInformation.length <= 0) {
    return <div>No blocked peers.</div>
  }

  return (
    <div>
      {props.settings.blockedNodes.map((nodeID, index) => {
        return (
          <div className="uk-card uk-card-default uk-card-body uk-margin-small-bottom" key={nodeID}>
            <div className="uk-flex uk-flex-row">
              <div className="uk-flex uk-flex-column uk-margin-right">
                <Link to={`/profile/${nodeID}`}>{nodeID}</Link>
                <div>{blockedPeersInformation[index]!.name}</div>
              </div>
              <button
                className="uk-button uk-button-primary"
                onClick={async () => {
                  await Settings.unblockANode(nodeID)
                  const blockedPeersInfoCopy = [...blockedPeersInformation]
                  blockedPeersInfoCopy.splice(index, 1)
                  setBlockedPeersInformation(blockedPeersInfoCopy)
                  window.UIkit.notification('Peer unblocked successfully!', { status: 'success' })
                }}
              >
                Unblock
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BlockedPeersCard
