import React from "react";
import { BasePage } from "../../Components/BasePage";
import { IonList, IonSearchbar, IonIcon, IonAlert } from "@ionic/react";
import { addCircleOutline, filterOutline } from "ionicons/icons";
import { InventoryItem } from "../../Components/InventoryItem";
import { QuantityChangeDirection, Domains, SearchParams } from "../../Utils";
import { useInventoryStyles } from "./Inventory.styles";
import { Link } from "react-router-dom";
import { InventoryFilterPopover } from "../../Components/Popovers/InventoryFilterPopover";
import * as queryString from "query-string";
import { connect, useDispatch, ConnectedProps } from "react-redux";
import { RootState } from "../../Redux/Store/index";
import { Beer } from "../../Interfaces/Beer.types";

import { decrementBeerQuantity, fetchAllBeer, incrementBeerQuantity } from "../../Redux/Store/Beer/Actions";
import { getCurrentBeer } from "../../Redux/Store/Beer/Selectors";
import { fetchAllBreweries } from "../../Redux/Store/Breweries/Actions";

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.beer.isLoading && state.breweries.isLoading,
    // beer: state.beer.inventory,
    currentBeer: getCurrentBeer(state),
  };
};

export interface IInventory extends PropsFromRedux {}

const InventoryComponent: React.FC<IInventory> = (props) => {
  const domain = queryString.parse(window.location.search)[SearchParams.Domain];
  const dispatch = useDispatch();

  const [searchBarText, setSearchBarText] = React.useState<string>("");
  const [beers, setBeers] = React.useState<Beer[]>();
  const [showFilterPopover, setShowFilterPopover] = React.useState<boolean>(false);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [alertText, setAlertText] = React.useState<string>("");

  React.useEffect(() => {
    dispatch(fetchAllBeer());
    dispatch(fetchAllBreweries());
  }, [dispatch]);

  React.useEffect(() => {
    if (!props.isLoading) {
      setBeers(props.currentBeer);
    }
  }, [props]);

  const handleQuantityChange = (id: string, dir: QuantityChangeDirection) => {
    try {
      if (dir === QuantityChangeDirection.Up) {
        dispatch(incrementBeerQuantity(id));
      } else {
        dispatch(decrementBeerQuantity(id));
      }
    } catch (error) {
      setAlertText(error);
      setShowAlert(true);
    }
  };

  const closeFilterPopover = () => {
    setShowFilterPopover(false);
  };

  const classes = useInventoryStyles();

  const toolbarHeaderContent = (
    <div className={classes.headerContentContainer}>
      <IonIcon icon={filterOutline} className={classes.filterIcon} onClick={() => setShowFilterPopover(true)} />
      <IonSearchbar onIonChange={(event) => console.log(event.detail.value)}></IonSearchbar>
      <Link
        to={{
          pathname: "/inventory/add",
          search: window.location.search,
        }}
        className={classes.addItemLink}
      >
        <IonIcon icon={addCircleOutline} className={classes.addItemIcon} />
      </Link>
    </div>
  );

  return (
    <>
      <BasePage headerContent={toolbarHeaderContent}>
        <IonAlert isOpen={showAlert} buttons={["Ok"]} message={alertText} onDidDismiss={() => setShowAlert(false)} />
        <IonList>
          {beers &&
            beers.map((beer) => (
              <InventoryItem
                key={beer._id}
                onQuantityChange={(dir: QuantityChangeDirection) => handleQuantityChange(beer._id, dir)}
                id={beer._id}
                domain={(domain as Domains) || Domains.Beer} // this is done because domain can be an array--this should be fixed
              />
            ))}
          {!beers && <div>loading</div>}
        </IonList>
      </BasePage>
      <InventoryFilterPopover isOpen={showFilterPopover} onClose={() => closeFilterPopover()} />
    </>
  );
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const Inventory = connector(InventoryComponent);