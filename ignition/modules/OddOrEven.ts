import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("OddOrEvenModule", (m) => {
  const oddOrEven = m.contract("OddOrEven");

  return { oddOrEven };
});
