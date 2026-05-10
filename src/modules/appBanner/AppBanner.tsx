
// 'use client'
// import { useEffect, useState } from 'react'
// import { openApp } from '@/lib/openApp'

// export function AppBanner() {
//   const [show, setShow] = useState(false)

//   useEffect(() => {
//     const ua = navigator.userAgent
//     const isMobileOrWindows = /Android|Windows/.test(ua)
//     if (isMobileOrWindows) setShow(true)
//   }, [])

//   if (!show) return null

//   return (
//     <div className="app-banner">
//       <img src="/app-icon.png" alt="App" />
//       <div className="app-banner__info">
//         <span className="app-banner__title">Название приложения</span>
//         <span className="app-banner__sub">Открыть в приложении</span>
//       </div>
//       <button onClick={openApp}>Открыть</button>
//       <button onClick={() => setShow(false)}>✕</button>
//     </div>
//   )
// }