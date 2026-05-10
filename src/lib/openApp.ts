const APP_SCHEME = 'myapp://home'
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.myapp'

export function openApp() {
  const ua = navigator.userAgent
  const isAndroid = /Android/.test(ua)
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isWindows = /Windows/.test(ua)

  if (isAndroid) {
    // Пробуем открыть приложение
    window.location.href = APP_SCHEME

    // Если не открылось — на страницу скачивания
    setTimeout(() => {
      window.location.href = PLAY_STORE
    }, 1500)

  } else if (isWindows) {
    // Сразу на Google Play в браузере
    window.open(PLAY_STORE, '_blank')

  } else if (isIOS) {
    // Ничего / можно показать сообщение
  }
}


// const APP_SCHEME = 'myapp://home'

// export function openApp() {
//   const ua = navigator.userAgent
//   const isAndroid = /Android/.test(ua)
//   const isWindows = /Windows/.test(ua)

//   if (isAndroid) {
//     window.location.href = APP_SCHEME
//   } else if (isWindows) {
//     window.location.href = APP_SCHEME
//   }
// }