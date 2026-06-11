import { useMemo, useState } from 'react';

type Gender = 'male' | 'female';

type Diagnosis = {
  rank: number;
  name: string;
  score: number;
  confidence: number;
  urgency: string;
};

const symptomOptions = [
  'Халуурах',
  'Ханиалгах',
  'Хоолой өвдөх',
  'Амьсгал давчдах',
  'Толгой өвдөх',
  'Бие шартах',
  'Бөөлжих',
  'Гэдэс өвдөх',
  'Бие сулрах',
  'Хэвлийдээ шөрмөс татах',
  'Арьсны тууралт',
  'Хөлрөх',
  'Цус алдах (цөөн биш)'
];

const conditionDataset = [
  {
    name: 'Ханиад/Томуу',
    symptoms: ['Халуурах', 'Ханиалгах', 'Хоолой өвдөх', 'Бие шартах', 'Хөлрөх'],
    keywords: ['ханиалгах', 'халуурах', 'гөвдөх', 'талийх']
  },
  {
    name: 'Хоолойн үрэвсэл',
    symptoms: ['Ханиалгах', 'Хоолой өвдөх', 'Халуун шарлах'],
    keywords: ['хоолой', 'хоолойн', 'харшил', 'хоолой өвдөх']
  },
  {
    name: 'Гастроэнтерит',
    symptoms: ['Гэдэс өвдөх', 'Бөөлжих', 'Хэвлийдээ шөрмөс татах'],
    keywords: ['гэдэс', 'бөөлжих', 'хордлого', 'дотор муухай']
  },
  {
    name: 'Астма/Амьсгалын замын асуудал',
    symptoms: ['Амьсгал давчдах', 'Ханиалгах'],
    keywords: ['амьсгал', 'дуусах', 'давчдах', 'богино']
  },
  {
    name: 'Арьсны албархаг нөхцөл',
    symptoms: ['Арьсны тууралт'],
    keywords: ['арьс', 'туралт', 'улайх', 'хавдах']
  },
  {
    name: 'Хоолны хордлого',
    symptoms: ['Бөөлжих', 'Гэдэс өвдөх', 'Хэвлийдээ шөрмөс татах'],
    keywords: ['хордлого', 'хордсон', 'хоолноос', 'дотор муухай']
  },
  {
    name: 'Сэтгэл зүйн ядаргаа',
    symptoms: ['Толгой өвдөх', 'Бие сулрах', 'Бие шартах'],
    keywords: ['стресс', 'тайван биш', 'сэтгэл', 'уурлах']
  },
  {
    name: 'Аллерги',
    symptoms: ['Ханиалгах', 'Арьсны тууралт'],
    keywords: ['харшил', 'харшилж', 'цагаан', 'цэцэг']
  },
  {
    name: 'Мигрень',
    symptoms: ['Толгой өвдөх', 'Бие сулрах'],
    keywords: ['толгой', 'мигрень', 'дунд', 'бүдгэр']
  }
];

const urgencyText = (confidence: number) => {
  if (confidence > 80) return 'Түргэн үзлэг хийх шаардлагатай.';
  if (confidence > 55) return 'Эмчид хандах нь зүгээр.';
  return 'Мэдээлэлд тулгуурласан ерөнхий таамаг.';
};

const scoreDiagnosis = (
  age: number | null,
  gender: Gender,
  selectedSymptoms: string[],
  duration: number,
  description: string
) => {
  const text = description.toLowerCase();
  const selectedSet = new Set(selectedSymptoms);
  const base = Math.min(duration, 12) * 2;

  const scored = conditionDataset.map((condition) => {
    let score = 18 + base;
    score += condition.symptoms.reduce(
      (sum, symptom) => sum + (selectedSet.has(symptom) ? 22 : 0),
      0
    );
    score += condition.keywords.reduce(
      (sum, keyword) => sum + (text.includes(keyword) ? 18 : 0),
      0
    );
    if (age && age >= 50 && /астма|хоолойн|арьсны|гэс|бөөлж/i.test(condition.name)) score += 6;
    if (gender === 'female' && /арьсны|сэтгэл/i.test(condition.name)) score += 4;
    return { name: condition.name, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
};

export default function Home() {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('male');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [resultCount, setResultCount] = useState(5);
  const [sensitivity, setSensitivity] = useState(1);
  const [results, setResults] = useState<Diagnosis[]>([]);

  const filteredSymptoms = useMemo(
    () =>
      symptomOptions.filter((symptom) =>
        symptom.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [searchTerm]
  );

  const toggleSymptom = (value: string) => {
    setSelectedSymptoms((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleAnalyze = () => {
    const normalizedAge = typeof age === 'number' ? age : null;
    const diagnosisScores = scoreDiagnosis(
      normalizedAge,
      gender,
      selectedSymptoms,
      Number(duration || 0),
      description
    );

    const top = diagnosisScores.slice(0, Math.max(3, Math.min(8, resultCount)));
    const total = top.reduce((sum, item) => sum + item.score, 0) || 1;

    const computed = top.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      score: item.score,
      confidence: Math.max(5, Math.round((item.score / total) * 100)),
      urgency: urgencyText(Math.max(5, Math.round((item.score / total) * 100)))
    }));

    setResults(computed);
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-brand">
            <span className="hero-icon">🩺</span>
            <div>
              <h1>Оношлогоо</h1>
              <p className="hero-subtitle">Шинж тэмдгээс боломжит шалтгааныг тодорхойлно</p>
            </div>
          </div>
          <p className="hero-lead">
            Өвчний зовиурыг сонгож эсвэл бичгээр тайлбарласнаар хамгийн магадлалтай нөхцлийг үзнэ.
          </p>
        </div>
      </section>

      <section className="layout-grid">
        <div className="panel glass-card">
          <div className="panel-group">
            <div className="field-group">
              <label>Нас</label>
              <input
                type="number"
                min={0}
                max={120}
                placeholder="Жишээ: 34"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="field-group">
              <label>Хүйс</label>
              <div className="radio-row">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                  />
                  Эрэгтэй
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                  />
                  Эмэгтэй
                </label>
              </div>
            </div>
          </div>

          <div className="field-block">
            <label>Шинж тэмдэг хайх</label>
            <input
              type="search"
              placeholder="Шинж тэмдгээ бичээрэй..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="symptom-grid">
            {filteredSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="panel-group">
            <div className="field-group">
              <label>Хугацаа</label>
              <input
                type="number"
                min={0}
                placeholder="Хоног"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="field-group">
              <label>Нэгж</label>
              <select
                value="days"
                onChange={() => null}
                disabled
                className="disabled-select"
              >
                <option value="days">хоног</option>
              </select>
            </div>
          </div>

          <div className="field-block">
            <label>Тайлбар</label>
            <textarea
              rows={4}
              placeholder="Жишээ: Хөл давчдаж, ханиалгах, халуурахгүй мэт"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="action-block">
            <button className="primary-btn" onClick={handleAnalyze}>
              ШИНЖЛЭХ
            </button>
            <p className="note-text">Энэ нь эмнэлгийн онош биш, зөвхөн магадлал болно.</p>
          </div>
        </div>

        <aside className="panel glass-card warning-card">
          <h2>Анхаар</h2>
          <p>Систем нь локал оношилгооны алгоритм ашиглан магадлалыг авч үзнэ. Асуудал гарвал эмчид хандаарай.</p>
          <div className="settings-card">
            <div>
              <label>Үр дүнгийн тоо</label>
              <select value={resultCount} onChange={(e) => setResultCount(Number(e.target.value))}>
                {[3, 4, 5, 6, 7, 8].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Магадлалын хүч</label>
              <input
                type="range"
                min={0.75}
                max={1.8}
                step={0.05}
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
              />
              <span className="range-value">{sensitivity.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="results-panel">
        <div className="results-header">
          <h2>Үр дүн</h2>
          <p>Оролт өгсөн шинж тэмдгийн үндсэн дээр хамгийн магадлалтай өвчнийг харуулна.</p>
        </div>

        <div className="results-grid">
          {results.length === 0 ? (
            <div className="empty-card glass-card">
              <p>Шинж тэмдгийг сонгож эсвэл тайлбар бичээд "ШИНЖЛЭХ" дарна уу.</p>
            </div>
          ) : (
            results.map((result) => (
              <article key={result.rank} className="result-card glass-card">
                <span className="result-badge">#{result.rank}</span>
                <h3>{result.name}</h3>
                <div className="confidence-row">
                  <span>Итгэл:</span>
                  <strong>{result.confidence}%</strong>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${result.confidence}%` }} />
                </div>
                <p className="urgency-note">{result.urgency}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
