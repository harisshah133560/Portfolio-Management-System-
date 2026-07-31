import { STATUSES } from '../../utils/constants';

export default function StatusBadge(props) {
  var status = props.status;
  var info = STATUSES.find(function (s) { return s.value === status; }) || STATUSES[2];
  var dotColor = status === 'completed' ? '#10B981' : status === 'in-progress' ? '#F59E0B' : '#94A3B8';

  return (
    <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ' + info.className}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
      {info.label}
    </span>
  );
}