// import { useEventBus } from '@/EventBus'
// import React, { useEffect, useState } from 'react' 
// import { v4 as uuidv4 } from 'uuid'

// const Toast = () => {
//   const [toasts, setToasts] = useState<any>([])
//   const { on }: any = useEventBus()

//   useEffect(() => {
//     on('toast.show', (message: any) => {
//       const uuid = uuidv4()

//       setToasts((oldToasts: any) => [...oldToasts, {message, uuid}])

//       setTimeout(() => {
//         setToasts((oldToasts: any) => oldToasts.filter((toast: any) => toast.uuid !== uuid))
//       }, 3000)
//     })
//   }, [on])

//   return (
//     <div className='toast min-w-[280px]'>
//       {
//         toasts.map((toast: any, index: number) => (
//           <div key={toast.uuid} className='alert alert-success py-3 px-4 text-gray-100 rounded-md'>
//             <span>{toast.message}</span>
//           </div>
//         ))
//       }
//     </div>
//   )
// }

// export default Toast

import { useEventBus } from '@/EventBus'
import { ToastMessage } from '@/types'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const { on } = useEventBus()

  useEffect(() => {
    const handleToast = (message: string) => {
      const uuid = uuidv4()

      setToasts((oldToasts) => [...oldToasts, { message, uuid }])

      setTimeout(() => {
        setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid))
      }, 3000)
    }

    on('toast.show', handleToast)

    return () => {
      // Clean up if your event bus supports off/unsubscribing
      // off('toast.show', handleToast)
    }
  }, [on])

  return (
    <div className="toast min-w-[280px]">
      {toasts.map((toast) => (
        <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

export default Toast