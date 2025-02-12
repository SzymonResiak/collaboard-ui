export default function GroupPage({ params }: { params: { name: string } }) {
  return (
    <div>
      <h1>Group: {params.name}</h1>
    </div>
  );
}
