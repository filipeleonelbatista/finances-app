import { useContext } from "react";
import { ListsContext } from "../context/ListsContext";

export function useLists() {
  const value = useContext(ListsContext);
  return value;
}
