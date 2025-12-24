import { FaUser } from 'react-icons/fa'

export const ChatAreaEmpty = () => {
  return (
    <div className='flex-1 flex items-center justify-center bg-white'>
      <div className='text-center text-gray-500'>
        <FaUser className='w-16 h-16 mx-auto mb-4 opacity-50' />
        <h3 className='text-xl font-semibold mb-2'>Select a contact</h3>
        <p>Choose a user from the list to start chatting</p>
      </div>
    </div>
  )
}
