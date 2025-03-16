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

export const isImage = (attachment: any) => {
  let mime = attachment.mime || attachment.type
  mime = mime.split("/")

  return mime[0].toLowerCase() === "image"
}

export const isVideo = (attachment: any) => {
  let mime = attachment.mime || attachment.type
  mime = mime.split("/")

  return mime[0].toLowerCase() === "video"
}

export const isAudio = (attachment: any) => {
  let mime = attachment.mime || attachment.type
  mime = mime.split("/")

  return mime[0].toLowerCase() === "audio"
}

export const isPDF = (attachment: any) => {
  let mime = attachment.mime || attachment.type

  return mime === "application/pdf"
}

export const isPreviewable = (attachment: any) => {
  return (isImage(attachment) || isVideo(attachment) || isAudio(attachment) || isPDF(attachment))
}

export const formatBytes = (bytes: any, decimal = 2) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimal < 0 ? 0 : decimal
  const sizes = ["Bytes", "KB", "MB", "GB"]

  let i = 0
  let size = bytes

  while (size >= k) {
    size /= k
    i++
  }

  return parseFloat(size.toFixed(dm)) + " " + sizes[i]
}