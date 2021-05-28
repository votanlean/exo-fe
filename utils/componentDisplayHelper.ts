export function shouldComponentDisplay(conditionFlag, component, replacementComponent = null) {
  if (conditionFlag) {
    return component;
  }

  return replacementComponent;
}