import { ChatArea, ChatSidebar } from '@/features/chat/ui'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <ChatSidebar />
      {/* Chat Area */}
      <ChatArea selectedUserId={id} />
    </div>
  )
}
