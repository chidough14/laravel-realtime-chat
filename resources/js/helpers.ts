export const formatMessageDate = (date: any, long: boolean) => {
  const now = new Date()
  const inputDate = new Date(date)

  if (isToday(inputDate)) {
    return inputDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  } else if (isYesterday(inputDate)) {
    return (
      'Yesterday ' +
      (long ? inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }) : "")
    )
  } else if (inputDate.getFullYear() === now.getFullYear()) {
    return inputDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short"
    })
  } else {
    inputDate.toLocaleDateString()
  }
}

// export const formatMessageDateShort = (date: any) => {
//     const now = new Date()
//     const inputDate = new Date(date)

//     if (isToday(inputDate)) {
//         return inputDate.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit"
//         })
//     } else if (isYesterday(inputDate)) {
//         return 'Yesterday' 
//     } else if (inputDate.getFullYear() === now.getFullYear()) {
//         return inputDate.toLocaleDateString([], {
//             day: "2-digit",
//             month: "short"
//         })
//     } else {
//         inputDate.toLocaleDateString()
//     }
// }

export const isToday = (date: Date) => {
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isYesterday = (date: Date) => {
  const yesterday = new Date()

  yesterday.setDate(yesterday.getDate() - 1)

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear() 
  )

}