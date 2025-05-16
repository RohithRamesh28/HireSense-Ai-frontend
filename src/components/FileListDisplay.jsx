import React from 'react';

export default function FileListDisplay({ files }) {
  if (!files || files.length === 0) return null;
  const fileArray = Array.from(files);
  const visibleFiles = fileArray.slice(0, 5);
  const hiddenFiles = fileArray.slice(5);
  const tooltip = hiddenFiles.map(f => f.name).join('\n');

  return (
    <div className="file-list-box" title={tooltip}>
  {visibleFiles.map((f, idx) => (
    <span key={idx}>{f.name}{idx < visibleFiles.length - 1 ? ', ' : ''}</span>
  ))}
  {hiddenFiles.length > 0 && <span className="extra-count"> +{hiddenFiles.length} more</span>}
</div>
  );
}
