interface OVDepositPopupState {
  nextPopupDate: number;
  popupInterval: 1 | 7 | 30;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const calculateNextDate = (days: number): number => {
  return Date.now() + days * DAY_IN_MS;
};

const updatePopupState = (state: OVDepositPopupState): OVDepositPopupState => {
  let { nextPopupDate, popupInterval } = state;

  switch (popupInterval) {
    case 1:
      nextPopupDate = calculateNextDate(7);
      popupInterval = 7;
      break;
    case 7:
      nextPopupDate = calculateNextDate(30);
      popupInterval = 30;
      break;
  }

  return { nextPopupDate, popupInterval };
};

export const OVDepositPopupState = () => {
  let shouldShowPopup = false;
  const _popupState = localStorage.getItem('popupState');

  const popupState = _popupState
    ? (JSON.parse(_popupState) as OVDepositPopupState)
    : undefined;

  if (!popupState) {
    shouldShowPopup = true;

    localStorage.setItem(
      'popupState',
      JSON.stringify({
        nextPopupDate: calculateNextDate(1),
        popupInterval: 1,
      }),
    );
  } else if (popupState.nextPopupDate <= Date.now()) {
    shouldShowPopup = true;
    const newPopupState = updatePopupState(popupState);
    localStorage.setItem('popupState', JSON.stringify(newPopupState));
  }

  return { shouldShowPopup };
};
