'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from '@/components/PromptInput';
import DataUpload from '@/components/DataUpload';
import SqiResults from '@/components/SqiResults';
import { isAuthenticated } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [sqiData, setSqiData] = useState<any>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const handleCompute = (data: any) => {
    setSqiData(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isAuth === null) return null;

  return (
    <div className="p-4">
      <h1>Admin Console</h1>
      <PromptInput />
      <DataUpload onCompute={handleCompute} />
      {sqiData && <SqiResults data={sqiData} />}
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2"
      >
        Logout
      </button>
    </div>
  );
}
