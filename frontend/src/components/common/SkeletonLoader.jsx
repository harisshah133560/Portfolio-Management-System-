export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-slate-200 animate-pulse" />
        <div className="w-20 h-4 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="w-16 h-8 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

export function SkeletonProjectCard() {
  return (
    <div className="card overflow-hidden">
      <div className="w-full h-48 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="w-3/4 h-5 rounded bg-slate-200 animate-pulse" />
        <div className="w-full h-3 rounded bg-slate-200 animate-pulse" />
        <div className="w-2/3 h-3 rounded bg-slate-200 animate-pulse" />
        <div className="flex gap-2">
          <div className="w-16 h-6 rounded-full bg-slate-200 animate-pulse" />
          <div className="w-16 h-6 rounded-full bg-slate-200 animate-pulse" />
          <div className="w-16 h-6 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable(props) {
  var rows = props.rows || 5;
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map(function (_, i) {
        return (
          <div key={i} className="flex items-center gap-4 py-3 px-3 border-b border-slate-50">
            <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-1/3 h-4 rounded bg-slate-200 animate-pulse" />
              <div className="w-2/3 h-3 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="w-20 h-6 rounded-full bg-slate-200 animate-pulse" />
          </div>
        );
      })}
    </div>
  );
}