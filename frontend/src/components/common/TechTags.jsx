export default function TechTags(props) {
  var technologies = props.technologies || [];
  var max = props.max || 4;
  var onRemove = props.onRemove;
  var visible = technologies.slice(0, max);
  var remaining = technologies.length - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map(function (tech) {
        return (
          <span key={tech} className="tech-tag">
            {tech}
            {onRemove && (
              <button
                type="button"
                onClick={function () { onRemove(tech); }}
                className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            )}
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="tech-tag">+{remaining}</span>
      )}
    </div>
  );
}