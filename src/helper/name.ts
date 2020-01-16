
export function isValidName(name: string): boolean {
  // First check for the pattern
  const regexName = /^[a-zA-Z]{3,}$/;
  
  return regexName.test(name);
}