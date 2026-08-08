export function ButtonChips({
  options,
  disabled,
  onSelect,
}: {
  options: string[];
  disabled: boolean;
  onSelect: (label: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="quick-replies">
      {options.map((label) => (
        <button
          key={label}
          disabled={disabled}
          onClick={() => onSelect(label)}
          className="quick-reply"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
