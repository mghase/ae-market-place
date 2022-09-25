import { Spinner } from "@chakra-ui/react";

const Loader = () => (
  <div className="flexCenter">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xs"
    />
  </div>
);

export default Loader;
