import { useWindowDimensions } from "react-native";
import { BREAKPOINT_TABLET } from "../utils/constants";

export function useResponsive() {
  const { width } = useWindowDimensions();
  return { isTablet: width >= BREAKPOINT_TABLET, width };
}
