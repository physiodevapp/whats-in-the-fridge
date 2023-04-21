const isValidUrl = (url) => {
  if (url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  } else {
    return false
  }
}

const isValidEmail = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

module.exports = {
  isValidUrl,
  isValidEmail
}