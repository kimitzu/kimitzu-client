import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react'
import { arrowBack, person } from 'ionicons/icons'
import React from 'react'

interface Props {
  title: string
  handleBackBtn: () => void
  peerID: string
}

const ChatHeader = ({ title, handleBackBtn, peerID }: Props) => (
  <IonToolbar color="primary">
    <IonButtons slot="start">
      <IonButton onClick={handleBackBtn}>
        <IonIcon icon={arrowBack} />
      </IonButton>
    </IonButtons>
    <IonTitle className="uk-text-center">{title}</IonTitle>
    <IonButtons slot="end">
      <IonButton routerLink={`/profile/${peerID}`}>
        <IonIcon icon={person} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
)

export default ChatHeader
