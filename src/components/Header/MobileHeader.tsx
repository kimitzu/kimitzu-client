import {
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
    <IonHeader>
      <IonToolbar color="primary">
        {showBackBtn ? (
          <IonButtons slot="start">
            <IonButton
              onClick={e => {
                e.stopPropagation()
                window.history.back()
              }}
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        ) : null}
        {title ? <IonTitle className="uk-text-center">{title}</IonTitle> : null}
      </IonToolbar>
    </IonHeader>
  )
}

export default MobileHeader
