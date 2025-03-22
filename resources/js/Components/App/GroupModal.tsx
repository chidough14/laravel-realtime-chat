import { useEventBus } from '@/EventBus'
import { Conversation, GroupModalFormData, GroupModalProps } from '@/types'
import { useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import SecondaryButton from '../SecondaryButton'
import PrimaryButton from '../PrimaryButton'
import InputLabel from '../InputLabel'
import TextInput from '../TextInput'
import InputError from '../InputError'
import TextAreaInput from '../TextAreaInput'
import UserPicker from './UserPicker'

const GroupModal: React.FC<GroupModalProps> = ({ show = false, onClose = () => { } }) => {
  const page = usePage()
  const conversations = page.props.conversations
  const { on, emit } = useEventBus()

  const [group, setGroup] = useState<any>()

  const { data, setData, processing, reset, post, put, errors } = useForm<GroupModalFormData>({
    id: "",
    name: "",
    description: "",
    user_ids: []
  })

  const users = conversations.filter((conversation) => !conversation.is_group)

  const closeModal = () => {
    reset()
    onClose()
  }

  const createOrUpdateGroup = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (group?.id) {
      put(route('group.update', group.id), {
        onSuccess: () => {
          closeModal()
          emit('toast.show', `Group "${data.name}" was updated`)
        }
      })

      return
    }

    post(route('group.store'), {
      onSuccess: () => {
        closeModal()
        emit('toast.show', `Group "${data.name}" was created`)
      }
    })
  }

  useEffect(() => {
    return on('GroupModal.show', (group) => {
      setData({
        id: group.id,
        name: group.name,
        description: group.description,
        user_ids: group.users.filter((u: any) => group.owner_id !== u.id).map((a: any) => a.id),
      })

      setGroup(group)
    })
  }, [on])

  return (
    <Modal
      show={show}
      onClose={closeModal}
    >
      <form
        onSubmit={createOrUpdateGroup}
        className='p-6 overflow-y-auto'
      >
        <h2 className='text-xl font-medium text-gray-900 dark:text-gray-100'>
          {
            group?.id ? `Edit Group ${group?.name}` : "Create New Group"
          }
        </h2>

        <div className='mt-8'>
          <InputLabel htmlFor='name' value='Name' />

          <TextInput
            id='name'
            className='mt-1 block w-full'
            value={data.name}
            disabled={!!group?.id}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
          />

          <InputError className='mt-2' message={errors.name} />
        </div>

        <div className='mt-4'>
          <InputLabel htmlFor='description' value='Description' />

          <TextAreaInput
            id='description'
            rows={3}
            className='mt-1 block w-full'
            value={data.description || ""}
            onChange={(e) => setData("description", e.target.value)}
          />

          <InputError className='mt-2' message={errors.description} />
        </div>

        <div className='mt-4'>
          <InputLabel value='Select Users' />

          <UserPicker
            value={
              users.filter((u) => group?.owner_id !== u.id && data.user_ids.includes(u.id)) || []
            }
            options={users}
            onSelect={(users) => setData("user_ids", users.map((u) => u.id))}
          />

          <InputError className='mt-2' message={errors.user_ids} />
        </div>

        <div className='mt-6 flex justify-end'>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <PrimaryButton className='ms-3' disabled={processing}>
            {group?.id ? "Update" : "Create"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default GroupModal