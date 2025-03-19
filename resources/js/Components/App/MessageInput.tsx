// import {
//   FaceSmileIcon,
//   HandThumbUpIcon,
//   PaperAirplaneIcon,
//   PaperClipIcon,
//   PhotoIcon
// } from '@heroicons/react/24/solid'
// import { EventHandler, FormEvent, FormEventHandler, Fragment, useState } from 'react'
// import NewMessageInput from './NewMessageInput'
// import axios from 'axios'
// import EmojiPicker from 'emoji-picker-react'
// import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
// import { url } from 'inspector'
// import { XCircleIcon } from '@heroicons/react/16/solid'
// import { isAudio, isImage } from '@/helpers'
// import AttachmentPreview from './AttachmentPreview'
// import CustomAudioPlayer from './CustomAudioPlayer'
// import AudioRecorder from './AudioRecorder'
// import { MessageInputProps } from '@/types'

// const MessageInput = ({ conversation = null }: any) => {
//   const [newMessage, setNewMesaage] = useState("")
//   const [inputErrorMessage, setInputErrorMessage] = useState("")
//   const [messageSending, setMessageSending] = useState(false)
//   const [chosenFiles, setChosenFiles] = useState<any>([])
//   const [uploadProgress, setUploadProgress] = useState(0)

//   const onFileChange = (e: any) => {
//     const files = e.target.files

//     const updatedFiles = [...files].map((file) => {
//       return {
//         file,
//         url: URL.createObjectURL(file)
//       }
//     })

//     setChosenFiles((prev: any) => {
//       return [...prev, ...updatedFiles]
//     })
//   }

//   const onSendClick = () => {
//     if (messageSending) {
//       return
//     }

//     if (newMessage.trim() === "" && chosenFiles.length === 0) {
//       setInputErrorMessage("Please enter a message or upload attachments")

//       setTimeout(() => {
//         setInputErrorMessage("")
//       }, 3000);
//       return
//     }

//     const formData = new FormData()

//     chosenFiles.forEach((file: any) => {
//       formData.append("attachments[]", file.file)
//     })

//     formData.append("message", newMessage)

//     if (conversation.is_user) {
//       formData.append("receiver_id", conversation.id)
//     } else if (conversation.is_group) {
//       formData.append("group_id", conversation.id)
//     }

//     setMessageSending(true)

//     axios.post(route('message.store'), formData, {
//       onUploadProgress: (progressEvent: any) => {
//         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
//         setUploadProgress(progress)
//       }
//     })
//       .then((res) => {
//         setNewMesaage("")
//         setMessageSending(false)
//         setUploadProgress(0)
//         setChosenFiles([])
//       })
//       .catch((err) => {
//         setMessageSending(false)
//         setChosenFiles([])
//         const message = err?.response?.data?.message

//         setInputErrorMessage(message || "An error occured while sending message")
//       })
//   }

//   const onLikeClick = () => {
//     if (messageSending) {
//       return
//     }

//     const data: any = {
//       message: "👍"
//     }

//     if (conversation.is_user) {
//       data['receiver_id'] = conversation.id
//     } else if (conversation.is_group) {
//       data['group_id'] = conversation.id
//     }

//     axios.post(route('message.store'), data)

//   }

//   const recordedAudioReady = (file: File, url: string) => {
//     setChosenFiles((prev: {file: File, url: string}[]) => {
//       return [
//         ...prev,
//         {
//           file,
//           url
//         }
//       ]
//     })
//   }

//   return (
//     <div className='flex flex-wrap items-start border-t border-slate-700 py-3'>
//       <div className='order-2 flex-1 xs:flex-none xs:order-1 p-2'>
//         <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
//           <PaperClipIcon className='w-6' />

//           <input
//             type='file'
//             onChange={onFileChange}
//             multiple
//             className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer'
//           />
//         </button>

//         <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
//           <PhotoIcon className='w-6' />
//           <input
//             type='file'
//             onChange={onFileChange}
//             multiple
//             accept='image/*'
//             className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer'
//           />
//         </button>

//         <AudioRecorder fileReady={recordedAudioReady} />
//       </div>

//       <div className='order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative'>
//         <div className='flex'>
//           <NewMessageInput
//             value={newMessage}
//             onSend={onSendClick}
//             onChange={(e: any) => setNewMesaage(e.target.value)}
//           />

//           <button className='btn btn-info rounded-l-none' onClick={onSendClick} disabled={messageSending}>
//             {/* {
//               messageSending && (
//                 <span className='loading loading-spinner loading-xs'></span>
//               )
//             } */}
//             <PaperAirplaneIcon className='w-6' />
//             <span className='hidden sm:inline'>Send</span>
//           </button>
//         </div>
//         {
//           !!uploadProgress && (
//             <progress className='progress progress-info w-full' value={uploadProgress} max={100}></progress>
//           )
//         }

//         {
//           inputErrorMessage && (
//             <p className='text-xs text-red-400'>{inputErrorMessage}</p>
//           )
//         }

//         <div className='flex flex-wrap gap-1 mt-2'>
//           {
//             chosenFiles.map((file: any) => (
//               <div 
//                 className={
//                   `relative flex justify-between cursor-pointer ${!isImage(file.file) ? "w-[240px]" : ""}`
//                 }
//                 key={file.file.name}
//               >
//                 {
//                   isImage(file.file) && (
//                     <img 
//                       src={file.url} 
//                       alt="" 
//                       className='w-16 h-16 object-cover'
//                     />
//                   )
//                 }

//                 {
//                   isAudio(file.file) && (
//                     <CustomAudioPlayer
//                       file={file}
//                       showVolume={false}
//                     />
//                   )
//                 }

//                 {
//                   !isAudio(file.file) && !isImage(file.file) && (
//                     <AttachmentPreview file={file} />
//                   )
//                 }

//                 <button 
//                   onClick={() => setChosenFiles(chosenFiles.filter((f: any) => f.file.name !== file.file.name))} 
//                   className='absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10'
//                 >
//                   <XCircleIcon className='w-6' />
//                 </button>
//               </div>
//             ))
//           }
//         </div>
//       </div>

//       <div className='order-3 xs:order-3 p-2 flex'>
//         <Popover className='relative'>
//           <PopoverButton className='p-1 text-gray-400 hover:text-gray-300'>
//             <FaceSmileIcon className='w-6 h-6' />
//           </PopoverButton>

//           <PopoverPanel className='absolute z-10 right-0 bottom-full'>
//             <EmojiPicker 
//               theme='dark' 
//               onEmojiClick={(e: any) => setNewMesaage(newMessage + e.emoji)}
//             >

//             </EmojiPicker>
//           </PopoverPanel>
//         </Popover>

//         <button className='p-1 text-gray-400 hover:text-gray-300' onClick={onLikeClick}>
//           <HandThumbUpIcon className='w-6 h-6' />
//         </button>
//       </div>
//     </div>
//   )
// }

import { useState } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  HandThumbUpIcon,
  FaceSmileIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import axios from "axios";
import AudioRecorder from "./AudioRecorder";
import EmojiPicker from "emoji-picker-react";
import CustomAudioPlayer from "./CustomAudioPlayer";
import AttachmentPreview from "./AttachmentPreview";
import { ChosenFile, MessageInputProps } from "@/types";
import NewMessageInput from "./NewMessageInput";

const MessageInput: React.FC<MessageInputProps> = ({ conversation = null }) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [inputErrorMessage, setInputErrorMessage] = useState<string>("");
  const [messageSending, setMessageSending] = useState<boolean>(false);
  const [chosenFiles, setChosenFiles] = useState<ChosenFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const updatedFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setChosenFiles((prev) => [...prev, ...updatedFiles]);
  };

  const onSendClick = () => {
    if (messageSending) return;
    if (newMessage.trim() === "" && chosenFiles.length === 0) {
      setInputErrorMessage("Please enter a message or upload attachments");
      setTimeout(() => setInputErrorMessage(""), 3000);
      return;
    }

    const formData = new FormData();
    chosenFiles.forEach((file) => formData.append("attachments[]", file.file));
    formData.append("message", newMessage);

    if (conversation?.is_user) {
      formData.append("receiver_id", conversation.id.toString());
    } else if (conversation?.is_group) {
      formData.append("group_id", conversation.id.toString());
    }

    setMessageSending(true);

    axios.post(route("message.store"), formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      },
    })
      .then(() => {
        setNewMessage("");
        setMessageSending(false);
        setUploadProgress(0);
        setChosenFiles([]);
      })
      .catch((err) => {
        setMessageSending(false);
        setChosenFiles([]);
        setInputErrorMessage(err?.response?.data?.message || "An error occurred while sending the message");
      });
  };

  const onLikeClick = () => {
    if (messageSending) return;

    const data: Record<string, string | number> = { message: "👍" };

    if (conversation?.is_user) {
      data["receiver_id"] = conversation.id;
    } else if (conversation?.is_group) {
      data["group_id"] = conversation.id;
    }

    axios.post(route("message.store"), data);
  };

  const recordedAudioReady = (file: File, url: string) => {
    setChosenFiles((prev) => [...prev, { file, url }]);
  };

  return (
    <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
      {/* File and Audio Attachments */}
      <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
        <button className="p-1 text-gray-400 hover:text-gray-300 relative">
          <PaperClipIcon className="w-6" />
          <input type="file" onChange={onFileChange} multiple className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
        </button>

        <button className="p-1 text-gray-400 hover:text-gray-300 relative">
          <PhotoIcon className="w-6" />
          <input type="file" onChange={onFileChange} multiple accept="image/*" className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
        </button>

        <AudioRecorder fileReady={recordedAudioReady} />
      </div>

      {/* Message Input Field */}
      <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
        <div className="flex">
          <NewMessageInput
            value={newMessage}
            onSend={onSendClick}
            onChange={(e: any) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-info rounded-l-none" onClick={onSendClick} disabled={messageSending}>
            <PaperAirplaneIcon className="w-6" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {uploadProgress > 0 && (
          <progress className="progress progress-info w-full" value={uploadProgress} max={100}></progress>
        )}

        {inputErrorMessage && <p className="text-xs text-red-400">{inputErrorMessage}</p>}

        {/* File Previews */}
        <div className="flex flex-wrap gap-1 mt-2">
          {chosenFiles.map((file) => (
            <div className="relative flex justify-between cursor-pointer" key={file.file.name}>
              {/* Image Preview */}
              {file.file.type.startsWith("image/") && (
              <img src={file.url} alt="" className="w-16 h-16 object-cover" />
              )}

              {/* Audio Preview */}
              {file.file.type.startsWith("audio/") && (
                <CustomAudioPlayer file={file} showVolume={false} />
              )}

              {/* Other Attachments */}
              {!file.file.type.startsWith("image/") && !file.file.type.startsWith("audio/") && (
                <AttachmentPreview file={file} />
              )}

              {/* Remove File Button */}
              <button
                onClick={() => setChosenFiles(chosenFiles.filter((f) => f.file.name !== file.file.name))}
                className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
              >
                <XCircleIcon className="w-6" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emoji & Like Buttons */}
      <div className="order-3 xs:order-3 p-2 flex">
        <Popover className="relative">
          <PopoverButton className="p-1 text-gray-400 hover:text-gray-300">
            <FaceSmileIcon className="w-6 h-6" />
          </PopoverButton>
          <PopoverPanel className="absolute z-10 right-0 bottom-full">
            <EmojiPicker theme="dark" onEmojiClick={(e) => setNewMessage(newMessage + e.emoji)} />
          </PopoverPanel>
        </Popover>

        <button className="p-1 text-gray-400 hover:text-gray-300" onClick={onLikeClick}>
          <HandThumbUpIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;