import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';

function Home() {
  return (
    <>Messages</>
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
