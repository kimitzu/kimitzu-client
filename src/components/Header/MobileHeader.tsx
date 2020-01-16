import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar, isPlatform } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React, { Component } from 'react'

interface Props {
  defaultHref?: string
}

const MobileHeader = ({ defaultHref }: Props) => {
  if (!isPlatform('mobile')) {
    return null
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => window.history.back()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}

export default MobileHeader
