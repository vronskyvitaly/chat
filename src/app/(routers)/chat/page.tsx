import { ChatAreaEmpty, ChatSidebar } from '@/features/chat/ui'

export default function ChatPage() {
  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <ChatSidebar />
      {/* Chat Area */}
      <ChatAreaEmpty />
    </div>
  )
}
