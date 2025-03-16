import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEventBus } from '@/EventBus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/16/solid';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function Home({ selectedConversation = null, messages = null }: any) {
  const [localMessages, setLocalMessages] = useState<any>([])
  const [noMoreMessages, setNoMoreMessages] = useState<boolean>(false)
  const [scrollFromBottom, setScrollFromBottom] = useState<number>(0)
  const [showAttachmentPreview, setShowAttachmentPreview] = useState<boolean>(false)
  const [previewAttachment, setPreviewAttachment] = useState<any>({})
  const messagesCtrRef = useRef<HTMLDivElement | any>(null)
  const loadMoreIntersect = useRef<HTMLDivElement | any>(null)
  const { on }: any = useEventBus()

  const loadMoreMessages = useCallback(() => {
    if (noMoreMessages) {
      return
    }
    // Find first message object
    const firstMessage = localMessages[0]

    axios.get(route('message.loadOlder', firstMessage.id))
    .then(({ data }) => {
      if (data.data.length === 0) {
        setNoMoreMessages(true)
        return
      }

      // Calculate how much is scrolled from bottom and scroll to the same 
      // position from bottom after messages are loaded

      const scrollHeight = messagesCtrRef.current.scrollHeight
      const scrollTop = messagesCtrRef.current.scrollTop
      const clientHeight = messagesCtrRef.current.clientHeight

      const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight

      console.log("tmpScrollFromBottom", tmpScrollFromBottom)
      setScrollFromBottom(tmpScrollFromBottom)

      setLocalMessages((prev: any) => {
        return [...data.data.reverse(), ...prev]
      })
    })

    // if (firstMessage) {
    //   axios.get(route('message.loadOlder', firstMessage.id))
    //     .then(({ data }) => {
    //       if (data.data.length === 0) {
    //         setNoMoreMessages(true)
    //         return
    //       }

    //       // Calculate how much is scrolled from bottom and scroll to the same 
    //       // position from bottom after messages are loaded

    //       const scrollHeight = messagesCtrRef.current.scrollHeight
    //       const scrollTop = messagesCtrRef.current.scrollTop
    //       const clientHeight = messagesCtrRef.current.clientHeight

    //       const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight

    //       console.log("tmpScrollFromBottom", tmpScrollFromBottom)
    //       setScrollFromBottom(tmpScrollFromBottom)

    //       setLocalMessages((prev: any) => {
    //         return [...data.data.reverse(), ...prev]
    //       })
    //     })
    // }
  }, [localMessages, noMoreMessages])

  const onAttachmentClick = (attachments: any, index: number) => {
    setPreviewAttachment({
      attachments,
      index
    })

    setShowAttachmentPreview(true)
  }

  const messageCreated = (message: any) => {
    if (selectedConversation &&
      selectedConversation.is_group &&
      selectedConversation.id == message.group_id) {
      setLocalMessages((prev: any) => [...prev, message])
    }

    if (selectedConversation &&
      selectedConversation.is_user &&
      (selectedConversation.id == message.sender_id ||
        selectedConversation.id == message.receiver_id)) {
      setLocalMessages((prev: any) => [...prev, message])
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (messagesCtrRef.current) {
        messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight
      }
    }, 10)

    const offCreated = on('message.created', messageCreated)

    setScrollFromBottom(0)
    setNoMoreMessages(false)

    return () => {
      offCreated()
    }
  }, [selectedConversation])

  useEffect(() => {
    setLocalMessages(messages ? messages.data.reverse() : [])
  }, [messages])

  useEffect(() => {
    if (messagesCtrRef.current && scrollFromBottom !== null) {
      messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight - messagesCtrRef.current.offsetHeight - scrollFromBottom
    }

    if (noMoreMessages) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && loadMoreMessages()),
      {
        rootMargin: "0px 0px 250px 0px"
      }
    )

    if (loadMoreIntersect.current) {
      setTimeout(() => {
        observer.observe(loadMoreIntersect.current)
      }, 100)
    }

    return () => {
      observer.disconnect()
    }
  }, [localMessages])

  return (
    <>
      {
        !messages && (
          <div className='flex flex-col gap-8 justify-center items-center text-center h-full opacity-35'>
            <div className='text-2xl md:text-4xl p-16 text-slate-200'>
              Please select conversation to see messages
            </div>
            <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
          </div>
        )
      }

      {
        messages && (
          <>
            <ConversationHeader selectedConversation={selectedConversation} />

            <div ref={messagesCtrRef} className='flex-1 overflow-y-auto p-5'>
              {
                localMessages.length === 0 && (
                  <div className='flex justify-center items-center h-full'>
                    <div className='text-lg text-slate-200'>
                      No messages found
                    </div>
                  </div>
                )
              }

              {
                localMessages.length > 0 && (
                  <div className='flex flex-1 flex-col'>
                    <div ref={loadMoreIntersect}></div>
                    {
                      localMessages.map((message: any) => (
                        <MessageItem 
                          key={message.id} 
                          message={message} 
                          attachmentClick={onAttachmentClick}
                        />
                      ))
                    }
                  </div>
                )
              }
            </div>

            <MessageInput conversation={selectedConversation} />
          </>
        )
      }

      {
        previewAttachment.attachments && (
          <AttachmentPreviewModal 
            attachments={previewAttachment.attachments}  
            index={previewAttachment.index}
            show={showAttachmentPreview}
            onClose={() => setShowAttachmentPreview(false)}
          />
        )
      }
    </>
  );
}

Home.layout = (page: any) => {
  return (
    <AuthenticatedLayout>
      <ChatLayout children={page} />
    </AuthenticatedLayout>
  )
}

export default Home
