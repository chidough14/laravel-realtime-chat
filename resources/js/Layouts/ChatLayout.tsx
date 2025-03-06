import { usePage } from "@inertiajs/react"
import Echo from "laravel-echo"
import { useEffect } from "react"
// import AuthenticatedLayout from "./AuthenticatedLayout"


const ChatLayout = ({ children }: any) => {
  const page = usePage()
  const conversations = page.props.conversations
  const selectedConversation = page.props.selectedConversation

  useEffect(() => {
    window.Echo.join('online')
      .here((users: any) => {
        console.log("here", users)
      })
      .joining((user: any) => {
        console.log("joining", user)
      })
      .leaving((user: any) => {
        console.log("leaving", user)
      })
      .error((error: any) => {
        console.log("error", error)
      })

      return () => {
        window.Echo.leave('online')
      }
  }, [])

  return (
    <>
      ChatLayout
      { children }
    </>
  )
}

export default ChatLayout