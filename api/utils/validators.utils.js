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

module.exports = {
  isValidUrl
}