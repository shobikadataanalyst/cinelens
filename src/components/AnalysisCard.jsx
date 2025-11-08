
export default function AnalysisCard({ a }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">{a.title} {a.year ? `(${a.year})` : ''}</div>
          <div className="opacity-70 text-sm">Source: {a.inputType?.toUpperCase?.() || a.inputType}</div>
        </div>
        <div className={`badge ${a.result?.pass ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'}`}>
          {a.result?.pass ? 'PASS' : 'FAIL'}
        </div>
      </div>
      <p className="mt-3 leading-relaxed">{a.result?.explanation}</p>
      <div className="mt-3 text-sm opacity-80">
        <span className="mr-3">Named women: {a.result?.criteria?.namedWomen ? '✔' : '✘'}</span>
        <span className="mr-3">Women talk: {a.result?.criteria?.womenTalk ? '✔' : '✘'}</span>
        <span>Not about men: {a.result?.criteria?.talkNotAboutMen ? '✔' : '✘'}</span>
      </div>
    </div>
  );
}
