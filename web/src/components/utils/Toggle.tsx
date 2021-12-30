import React from "react";
export default function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback((val) => {
    setValue(val);
  }, []);
  return [value, toggle];
}
