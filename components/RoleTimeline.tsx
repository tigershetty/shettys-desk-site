interface Role {
  title: string;
  period: string;
  location: string;
  lesson: string;
}

export default function RoleTimeline({ roles }: { roles: Role[] }) {
  return (
    <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-brand-border">
      {roles.map((role) => (
        <div key={role.title} className="relative">
          <div className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-brand-accent bg-brand-dark" />
          <h3 className="font-medium text-brand-white">{role.title}</h3>
          <p className="text-sm text-brand-muted">
            {role.period} &middot; {role.location}
          </p>
          <p className="mt-1 text-sm text-brand-accent/80 italic">
            {role.lesson}
          </p>
        </div>
      ))}
    </div>
  );
}
