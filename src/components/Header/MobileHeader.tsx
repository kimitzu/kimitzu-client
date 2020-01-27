import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React from 'react'

interface Props {
  defaultHref?: string
  title?: string
  showBackBtn?: boolean
}

const MobileHeader = ({ defaultHref, showBackBtn, title }: Props) => {
  if (!isPlatform('mobile')) {
    return null
  }
  return (
    <IonHeader translate>
      <IonToolbar translate color="primary">
        {showBackBtn ? (
          <IonButtons translate slot="start">
            <IonButton
              translate
              onClick={e => {
                e.stopPropagation()
                window.history.back()
              }}
            >
              <IonIcon translate icon={arrowBack} />
            </IonButton>
          </IonButtons>
        ) : null}
        {title ? (
          <IonTitle translate className="uk-text-center">
            {title}
          </IonTitle>
        ) : null}
      </IonToolbar>
    </IonHeader>
  )
}

export default MobileHeader
