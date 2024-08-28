interface DescriptionCardProps {
  Icon: JSX.Element;
  title: React.ReactElement;
  description: string;
}

export default function DescriptionCard({
  description,
  Icon,
  title,
}: DescriptionCardProps) {
  return (
    <section className="p-6 rounded-2xl bg-black-3">
      <div className="mb-3">{Icon}</div>
      <h3 className="text-purple-500 font-bold mb-1">{title}</h3>
      <p className="p1">{description}</p>
    </section>
  );
}
