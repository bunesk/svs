export const validate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (
    event instanceof KeyboardEvent &&
    !input.classList.contains('invalid-border')
  ) {
    return;
  }
  if (input && !input.checkValidity()) {
    input.classList.add('invalid-border');
  } else {
    input.classList.remove('invalid-border');
  }
};
