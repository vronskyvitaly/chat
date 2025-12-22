import { FaSearch } from 'react-icons/fa'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

export const ChatSidebarSearchUserInput = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div className='p-3 border-b border-gray-200'>
      <div className='relative'>
        <FaSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Search contacts...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-black focus:border-blue-500 focus:outline-none'
        />
      </div>
    </div>
  )
}
