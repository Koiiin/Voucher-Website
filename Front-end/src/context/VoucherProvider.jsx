<<<<<<< HEAD
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
=======
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
>>>>>>> 14fd7dee0989f6389f8eb859f968216a0fcec654
