'use client';

import { PageContainer } from '@/components/ui/page-container';
import { useParams } from 'next/navigation';
import { getMockGroup } from '@/mocks/groups';

export default function GroupPage() {
  const params = useParams();
  const group = getMockGroup(params.name as string);

  if (!group) return null;

  return (
    <PageContainer
      title={group.name}
      description={group.description}
      showBackButton
      backButtonHref="/groups"
    >
      <div className="p-4">
        <h1>Group</h1>
      </div>
    </PageContainer>
  );
}
