
import { useState } from "react";
import { VoucherContext } from "./VoucherContext";

export const VoucherProvider = ({ children }) => {
  const [vouchers, setVouchers] = useState([]);

  return (
    <VoucherContext.Provider value={{ vouchers, setVouchers }}>
      {children}
    </VoucherContext.Provider>
  );
};

