export const Feature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-black px-5 py-10 text-center rounded-xl sm:flex-1 border border-[#FF6B00]">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="w-10 h-px bg-white/30 mx-auto my-4" />
      <p className="text-white/70">{description}</p>
    </div>
  );
};
