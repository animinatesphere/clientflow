import { useState } from "react";

export function usePlan(store) {
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const gate = (feature, reason) => {
    if (store.canAdd[feature]) return true;
    setUpgradeReason(reason || `You've reached the free plan limit.`);
    setUpgradeModal(true);
    return false;
  };

  return { upgradeModal, upgradeReason, setUpgradeModal, gate };
}
