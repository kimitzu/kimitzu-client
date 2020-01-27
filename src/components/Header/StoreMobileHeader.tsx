import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/react'
import { more } from 'ionicons/icons'
import React, { useState } from 'react'

interface Props {
  title?: string
}

const StoreMobileHeader = ({ title }: Props) => {
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [popoverEvent, setPopoverEvent] = useState()
  if (!isPlatform('mobile')) {
    return null
  }
  const handlePopover = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent)
    setShowPopover(true)
  }
  const dismiss = () => {
    setShowPopover(false)
  }
  return (
    <IonHeader translate>
      <IonToolbar translate color="primary">
        {title ? (
          <IonTitle translate className="uk-text-center">
            {title}
          </IonTitle>
        ) : null}
        <IonButtons translate slot="start">
          <div style={{ width: '46px' }} />
        </IonButtons>
        <IonButtons translate slot="end">
          <IonButton translate onClick={handlePopover}>
            <IonIcon translate size="large" icon={more} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonPopover event={popoverEvent} isOpen={showPopover} onDidDismiss={dismiss}>
        <IonList translate className="uk-padding-small uk-padding-remove-vertical">
          <IonItem
            translate
            button
            onClick={() => {
              window.location.hash = '/listing/create'
              dismiss()
            }}
          >
            <IonLabel translate>Create Listing</IonLabel>
          </IonItem>
          <IonItem
            translate
            button
            onClick={() => {
              window.location.hash = '/history/purchases'
              dismiss()
            }}
          >
            <IonLabel translate>Purchase History</IonLabel>
          </IonItem>
          <IonItem
            translate
            button
            onClick={() => {
              window.location.hash = '/history/sales'
              dismiss()
            }}
          >
            <IonLabel translate>Sales History</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </IonHeader>
  )
}

export default StoreMobileHeader
