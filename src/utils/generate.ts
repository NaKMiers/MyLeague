export const generateRandomString = (length: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const generatePassword = (length: number) => {
  if (length < 6) {
    throw new Error('Length must be at least 6')
  }

  const lowerCaseCharacters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numericCharacters = '0123456789'
  const allCharacters = lowerCaseCharacters + upperCaseCharacters + numericCharacters

  let result = ''
  result += lowerCaseCharacters.charAt(Math.floor(Math.random() * lowerCaseCharacters.length))
  result += upperCaseCharacters.charAt(Math.floor(Math.random() * upperCaseCharacters.length))
  result += numericCharacters.charAt(Math.floor(Math.random() * numericCharacters.length))

  for (let i = 3; i < length; i++) {
    result += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length))
  }

  return result
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}
