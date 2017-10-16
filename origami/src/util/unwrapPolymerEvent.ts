export function unwrapPolymerEvent<T>(value: T): T {
  if (value instanceof CustomEvent) {
    // TODO: Why do we do this again?
    return unwrapPolymerEvent(<T>value.detail.value);
  } else {
    return value;
  }
}
