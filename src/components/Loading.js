import { Image, Spinner, VStack } from "native-base";

import logo from "../assets/icon.png";

export default function Loading() {
  return (
    <VStack flex={1} alignItems="center" justifyContent="center" bg={"#581c87"}>
      <Image alt="logo" source={logo} size={150} borderRadius="full" mb={16} />
      <Spinner size={36} color={"#FFF"} />
    </VStack>
  );
}
