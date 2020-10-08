import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import { BasePageHeader } from "../BasePageHeader";
import { useBasePageWithInputCardsStyles } from "./BasePageWithInputCards.styles";

export interface IBasePageWithInputCardsProps {
  title: string;
  pathname: string;
}

export const BasePageWithInputCards: React.FC<IBasePageWithInputCardsProps> = (props) => {
  const { pathname, title } = props;

  const classes = useBasePageWithInputCardsStyles();

  return (
    <IonPage>
      <BasePageHeader title={title} pathname={pathname} />
      <IonContent className={classes.root}>{props.children}</IonContent>
    </IonPage>
  );
};