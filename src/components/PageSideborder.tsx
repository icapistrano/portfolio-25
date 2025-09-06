export const PageSideborder: React.FC<{}> = () => {
  return (
    <div className="pointer-events-none fixed inset-0">
      {/* This inner container matches your page width & padding */}
      <div className="h-full container mx-auto border-grey/80 px-4 border-x border-dashed" />
    </div>
  );
};
