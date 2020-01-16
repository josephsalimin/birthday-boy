
export function isValidName(name: string): boolean {
  // First check for the pattern
  const regexName = /^\[a-zA-Z]{3,}$/;
  
  if (!regexName.test(name)) {
    return false;
  }
  
  return true;
}