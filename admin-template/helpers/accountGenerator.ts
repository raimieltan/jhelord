export const accountGenerator = {
  userNameGenerate: (): string => {
    // Static part of the username
    const staticPart = 'jhelordtaxi'
    // Dynamic part of the username: Generate a random number between 100 and 999
    const dynamicPart = Math.floor(Math.random() * 900 + 100).toString()
    // Combine the static and dynamic parts
    const username = staticPart + dynamicPart
    return username
  },
  passwordGenerate: (): string => {
    const numbers = '0123456789'
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseLetters = lowerCaseLetters.toUpperCase()

    // Combine all character sets
    const allCharacters =
      numbers + lowerCaseLetters + upperCaseLetters + numbers

    // Generate random characters from the combined set
    let password = 'jhelord'
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length)
      password += allCharacters[randomIndex]
    }

    return password;
  },
}
