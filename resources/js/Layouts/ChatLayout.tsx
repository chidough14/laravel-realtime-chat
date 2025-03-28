import ConversationItem from "@/Components/App/ConversationItem"
import GroupModal from "@/Components/App/GroupModal"
import TextInput from "@/Components/TextInput"
import { useEventBus } from "@/EventBus"
import { Conversation, Message } from "@/types"
import { PencilSquareIcon } from "@heroicons/react/16/solid"
import { router, usePage } from "@inertiajs/react"
import Echo from "laravel-echo"
import { useEffect, useState } from "react"
// import AuthenticatedLayout from "./AuthenticatedLayout"


const ChatLayout = ({ children }: any) => {
  const page = usePage()
  const conversations = page.props.conversations
  const selectedConversation = page.props.selectedConversation as Conversation

  const [localConversations, setLocalConversations] = useState<Conversation[]>([])
  const [sortedConversations, setSortedConversations] = useState<Conversation[]>([])

  const [onlineUsers, setOnlineUsers] = useState<Record<any, any>>({})
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false)

  const isUserOnline = (userId: any): boolean | undefined => onlineUsers[userId]

  const { on, emit } = useEventBus()

  // console.log(conversations)
  // console.log(conversations, sortedConversations)

  const onSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase()

    setLocalConversations(
      conversations.filter((conversation) => {
        return (
          conversation.name.toLowerCase().includes(search)
        )
      })
    )
  }

  const messageCreated = (message: Message) => {
    setLocalConversations((oldUsers: any) => {
      return oldUsers.map((u: any) => {
        // If the message is for user
        if (message.receiver_id && !u.is_group && 
          (u.id == message.sender_id || u.id == message.receiver_id)
        ) {
          u.last_message = message.message
          u.last_message_date = message.created_at
          return u
        }
         // If the message is for group
        if (message.group_id && u.is_group && 
          (u.id == message.group_id)
        ) {
          u.last_message = message.message
          u.last_message_date = message.created_at
          return u
        }

        return u
      })
    })
  }

  const messageDeleted = ({prevMessage}: {prevMessage: Message}) => {
    if (!prevMessage) {
      return
    }

    // Find the conversation and update its last_message_id and date
    setLocalConversations((oldUsers: any) => {
      return oldUsers.map((u: any) => {
        if (prevMessage.receiver_id && 
          !u.is_group && 
          (u.id == prevMessage.sender_id || u.id == prevMessage.receiver_id)) {
           u.last_message = prevMessage.message
           u.last_message_date = prevMessage.created_at
           return u
        }

        if (prevMessage.group_id && u.is_group && 
          (u.id == prevMessage.group_id)
        ) {
          u.last_message = prevMessage.message
          u.last_message_date = prevMessage.created_at
          return u
        }

        return u
      })
    })

  }

  useEffect(() => {
    const offCreated = on('message.created', messageCreated)
    const offDeleted = on('message.deleted', messageDeleted)
    const offModalShow = on('GroupModal.show', (group) => {
      setShowGroupModal(true)
    })

    const offGroupDelete = on('group.deleted', ({id, name}) => {
      setLocalConversations((oldConversations) => {
        return oldConversations.filter((convo) => convo.id != id)
      })

      emit('toast.show', `Group "${name}" deleted`)

      if (
        !selectedConversation ||
       ( selectedConversation.is_group && 
        selectedConversation.id == id)
      ) {
        router.visit(route('dashboard'))
      }
    })

    return () => {
      offCreated
      offDeleted
      offModalShow
      offGroupDelete
    }
  }, [on])

  useEffect(() => {
    setSortedConversations(
      localConversations.sort((a: any, b: any) => {
        if (a.blocked_at && b.blocked_at) {
          return a.blocked_at > b.blocked_at ? 1 : -1
        } else if (a.blocked_at) {
          return 1
        } else if (b.blocked_at) {
          return -1
        }

        if (a.last_message_date && b.last_message_date) {
          return b.last_message_date.localeCompare(a.last_message_date)
        } else if (a.last_message_date) {
          return -1
        } else if (b.last_message_date) {
          return 1
        } else {
          return 0
        }
      })
    )
  }, [localConversations])

  useEffect(() => {
    setLocalConversations(conversations)
  }, [conversations])


  useEffect(() => {
    window.Echo.join('online')
      .here((users: any) => {
        const onlineUsersObj = Object.fromEntries(users.map((user: any) => [user.id, user]))

        setOnlineUsers((prev) => {
          return { ...prev, ...onlineUsersObj }
        })
      })
      .joining((user: any) => {
        setOnlineUsers((prev) => {
          const updatedUsers: any = { ...prev }
          updatedUsers[user.id] = user
          return updatedUsers
        })
      })
      .leaving((user: any) => {
        setOnlineUsers((prev) => {
          const updatedUsers: any = { ...prev }
          delete updatedUsers[user.id]
          return updatedUsers
        })
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
      <div className="flex-1 w-full flex overflow-hidden">
        <div
          className={
            `transition-all w-full sm:w-[220px] md:w-[300px]
             bg-slate-800 flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`
          }>
          <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
            My Conversations
            <div className="tooltip tooltip-left" data-tip="Create new Group">
              <button className="text-gray-500 hover:text-gray-200" onClick={() => setShowGroupModal(true)}>
                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
              </button>
            </div>
          </div>

          <div className="p-3">
            <TextInput
              className="w-full"
              onKeyUp={onSearch}
              placeholder="Filter users and groups"
            />
          </div>

          <div className="flex-1 overflow-auto">
            {

              sortedConversations && sortedConversations.map((conversation: any) => (
                <ConversationItem
                  key={`${conversation?.is_group ? "group_" : "user_"}${conversation?.id}`}
                  conversation={conversation}
                  online={!!isUserOnline(conversation?.id)}
                  selectedConversation={selectedConversation}
                />
              ))
            }
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>

      <GroupModal 
        show={showGroupModal} 
        onClose={() => setShowGroupModal(false)} 
      />
    </>
  )
}

export default ChatLayout