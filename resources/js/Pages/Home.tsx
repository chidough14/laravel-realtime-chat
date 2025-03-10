import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEventBus } from '@/EventBus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/16/solid';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function Home({ selectedConversation = null, messages = null }: any) {
  const [localMessages, setLocalMessages] = useState<any>([])
  const messagesCtrRef = useRef<HTMLDivElement | any>(null)
  const { on }: any = useEventBus()

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

    return () => {
      offCreated()
    }
  }, [selectedConversation])

  useEffect(() => {
    setLocalMessages(messages ? messages.data.reverse() : [])
  }, [messages])

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
                    {
                      localMessages.map((message: any) => (
                        <MessageItem key={message.id} message={message} />
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
