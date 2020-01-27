import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react'
import { arrowBack, person } from 'ionicons/icons'
import React from 'react'

interface Props {
  title: string
  handleBackBtn: () => void
  peerID?: string
}

const ChatHeader = ({ title, handleBackBtn, peerID }: Props) => (
  <IonToolbar translate color="primary">
    <IonButtons translate slot="start">
      <IonButton translate onClick={handleBackBtn}>
        <IonIcon translate icon={arrowBack} />
      </IonButton>
    </IonButtons>
    <IonTitle translate size="small" className="uk-text-center uk-text-truncate">
      {title}
    </IonTitle>
    <IonButtons translate slot="end">
      <IonButton translate disabled={peerID === undefined} routerLink={`/profile/${peerID}`}>
        <IonIcon translate icon={person} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
)

export default ChatHeader
