import { useEventBus } from '@/EventBus'
import { ModalProps, UserModalFormData } from '@/types'
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
import Checkbox from '../Checkbox'

const NewUserModal: React.FC<ModalProps> = ({ show = false, onClose = () => { } }) => {
  const { emit } = useEventBus()

  const { data, setData, processing, reset, post, errors } = useForm<UserModalFormData>({
    name: "",
    email: "",
    is_admin: false
  })

  const closeModal = () => {
    reset()
    onClose()
  }

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(route('user.store'), {
      onSuccess: () => {
        closeModal()
        emit('toast.show', `User "${data.name}" was created`)
      }
    })
  }



  return (
    <Modal
      show={show}
      onClose={closeModal}
    >
      <form
        onSubmit={submit}
        className='p-6 overflow-y-auto'
      >
        <h2 className='text-xl font-medium text-gray-900 dark:text-gray-100'>
          Create New User
        </h2>

        <div className='mt-8'>
          <InputLabel htmlFor='name' value='Name' />

          <TextInput
            id='name'
            className='mt-1 block w-full'
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
          />

          <InputError className='mt-2' message={errors.name} />
        </div>

        <div className='mt-4'>
          <InputLabel htmlFor='email' value='Email' />

          <TextInput
            id='email'
            className='mt-1 block w-full'
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            type='email'
          />

          <InputError className='mt-2' message={errors.email} />
        </div>

        <div className='mt-4'>
          <label className="flex items-center">
            <Checkbox
              name="is_admin"
              checked={data.is_admin}
              onChange={(e) =>
                setData(
                  'is_admin',
                  (e.target.checked || false) as false,
                )
              }
            />
            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
              Admin User
            </span>
          </label>

          <InputError className='mt-2' message={errors.is_admin} />
        </div>

        <div className='mt-6 flex justify-end'>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <PrimaryButton className='ms-3' disabled={processing}>
           Create
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default NewUserModal