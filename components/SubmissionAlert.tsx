export default function SubmissionAlert({
  alertColor,
  children,
}: {
  alertColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${alertColor} py-2 px-4 text-slate-100 rounded-md`}>
      {children}
    </div>
  );
}
