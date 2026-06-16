// Программын үндсэн логик
// Энэ сайт локал dataset дээр тулгуурлан шинж тэмдгээс магадлалыг харуулна.
const symptoms = [
  'Халуурах', 'Ханиалгах', 'Хоолой өвдөх', 'Амьсгал давчдах', 'Толгой өвдөх',
  'Бие шартах', 'Бөөлжих', 'Гэдэс өвдөх', 'Бие сулрах', 'Хэвлийдээ шөрмөс татах',
  'Арьсны тууралт', 'Хөлрөх', 'Цус алдах (цөөн биш)'
];

const conditionDataset = [
  { name:'Ханиад/Томуу', symptoms:['Халуурах','Ханиалгах','Хоолой өвдөх','Бие шартах','Хөлрөх'], keywords:['ханиалгах','халуурах','салхи','талийх','гагнах'] },
  { name:'Хоолойн үрэвсэл', symptoms:['Ханиалгах','Хоолой өвдөх','Халуун шарлах'], keywords:['хоолой','хоолойн','харшил','хоолой өвдөх'] },
  { name:'Гастроэнтерит', symptoms:['Гэдэс өвдөх','Бөөлжих','Хэвлийдээ шөрмөс татах'], keywords:['гэдэс','бөөлжих','хордлого','дотор муухай'] },
  { name:'Астма/Амьсгалын замын асуудал', symptoms:['Амьсгал давчдах','Ханиалгах','Толгой өвдөх'], keywords:['амьсгал','дуусах','давчдах','богиносох'] },
  { name:'Арьсны албархаг нөхцөл', symptoms:['Арьсны тууралт','Арьс хуурайших'], keywords:['арьс','туралт','улайх','хавдах'] },
  { name:'Хоолны хордлого', symptoms:['Бөөлжих','Гэдэс өвдөх','Цус алдах (цөөн биш)'], keywords:['хордлого','хордсон','хаад','хоолноос'] },
  { name:'Сэтгэл зүйн ядаргаа', symptoms:['Толгой өвдөх','Бие сулрах','Бие шартах'], keywords:['стресс','тайван биш','сэтгэл','сэтгэл гутрал'] },
  { name:'Аллерги', symptoms:['Ханиалгах','Арьсны тууралт','Хөлрөх'], keywords:['харшил','харшилж','цагаан','цэцэг'] },
  { name:'Мигрень/Толгойн өвчин', symptoms:['Толгой өвдөх','Ганцаардал','Бие сулрах'], keywords:['толгой','мигрень','дунд'] },
  { name:'Уушгины халдвар', symptoms:['Амьсгал давчдах','Ханиалгах','Халуурах'], keywords:['ушги','тамхи','нийлсэн','залгиур'] },
  { name:'Гуурсан хоолойн үрэвсэл', symptoms:['Амьсгал давчдах','Ханиалгах','Хоолой өвдөх'], keywords:['ууц','ороогоор','гуурс'] }
];

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  renderSymptomList(symptoms);
  setupSearch();
  document.getElementById('analyze-btn').addEventListener('click', analyze);
  updateAIModeLabel();
  setupSettings();
});

function setupSettings(){
  document.getElementById('result-count');
  document.getElementById('sensitivity');
}

function getSettings(){
  return {
    count: parseInt(document.getElementById('result-count')?.value || 5,10),
    sensitivity: parseFloat(document.getElementById('sensitivity')?.value || 1)
  };
}

function getConfidenceByRank(rank, total){
  if(total === 1) return 100;
  if(total === 2) return rank === 1 ? 60 : 40;
  if(total === 3) return [60, 25, 15][rank - 1];
  return null;
}

function updateAIModeLabel(){
  const hint = document.querySelector('.analyze-wrap .hint');
  if(!hint) return;
  hint.textContent = 'Локал шинжилгээний алгоритм — render хийхэд шууд тохиромжтой.';
}

function renderSymptomList(list){
  const container = document.getElementById('symptom-list');
  container.innerHTML = '';
  list.forEach((s, idx)=>{
    const div = document.createElement('div');
    div.className = 'symptom-item';
    div.innerHTML = `
      <label>
        <input type="checkbox" data-symptom-index="${idx}" value="${s}"> <span>${s}</span>
      </label>
    `;
    container.appendChild(div);
  });
}

function setupSearch(){
  const input = document.getElementById('symptom-search');
  input.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = symptoms.filter(s=>s.toLowerCase().includes(q));
    renderSymptomList(filtered);
  });
}

function collectForm(){
  const age = parseInt(document.getElementById('age').value) || null;
  const gender = document.querySelector('input[name="gender"]:checked')?.value || null;
  const selected = Array.from(document.querySelectorAll('#symptom-list input[type=checkbox]:checked')).map(i=>i.value);
  const durationVal = parseInt(document.getElementById('duration-value').value) || 0;
  const durationUnit = document.getElementById('duration-unit').value;
  const nlp = document.getElementById('nlp-input').value.trim();
  return {age, gender, selected, durationVal, durationUnit, nlp};
}

function simulateDiagnosis(data){
  const settings = getSettings();
  const text = (data.nlp || '').toLowerCase();
  const selectedSet = new Set(data.selected || []);

  const scored = conditionDataset.map(item => {
    let score = 12;
    score += item.symptoms.reduce((acc, symptom) => acc + (selectedSet.has(symptom) ? 25 : 0), 0);
    score += item.keywords.reduce((acc, keyword) => acc + (text.includes(keyword) ? 20 : 0), 0);
    score += Math.min(data.durationVal, 12) * 2;
    if(data.age >= 50 && /астма|хоолойн|арьсны|гэс|бөөлж/i.test(item.name)) score += 5;
    if(data.gender === 'female' && /арьсны|сэтгэл/i.test(item.name)) score += 4;
    return {...item, score: score * settings.sensitivity};
  });

  scored.sort((a,b)=>b.score-a.score);
  const topN = scored.slice(0, Math.max(3, Math.min(8, settings.count)));

  const sum = topN.reduce((acc, v)=>acc + v.score, 0) || 1;
  let results = topN.map((s,i)=>({
    rank: i+1,
    condition: s.name,
    confidence: getConfidenceByRank(i+1, topN.length) ?? Math.max(5, Math.round((s.score / sum) * 100))
  }));

  // Adjust rounding so total is at most 100
  let total = results.reduce((a,b)=>a+b.confidence,0);
  if(total > 100){
    const factor = 100 / total;
    results = results.map(r=>({ ...r, confidence: Math.max(5, Math.round(r.confidence * factor)) }));
    total = results.reduce((a,b)=>a+b.confidence,0);
    let i = 0;
    while(total < 100 && i < results.length){ results[i].confidence += 1; total++; i++; }
  }

  return results;
}

function analyze(){
  const data = collectForm();
  const resultsEl = document.getElementById('results-list');
  resultsEl.innerHTML = '';
  if(data.selected.length===0 && !data.nlp){
    resultsEl.innerHTML = `<div class="result-card glass"><p class="condition-title">Симптом сонгоно уу</p><p class="confidence">Шинж тэмдэг эсвэл тайлбарыг оруулаагүй байна.</p></div>`;
    return;
  }

  const diagnoses = simulateDiagnosis(data);

  diagnoses.forEach(d=>{
    const card = document.createElement('div');
    card.className = 'result-card glass';
    card.innerHTML = `
      <div class="badge rank">#${d.rank}</div>
      <div class="condition-title">${d.condition}</div>
      <div class="confidence">Итгэл:${d.confidence}%</div>
      <div class="progress-wrap"><div class="progress-bar" data-target="${d.confidence}"></div></div>
      <div class="note urgency" data-urgency=""></div>
    `;
    resultsEl.appendChild(card);
  });

  // Animate progress bars
  requestAnimationFrame(()=>{
    document.querySelectorAll('.progress-bar').forEach(el=>{
      const target = parseInt(el.dataset.target,10) || 0;
      el.style.width = `${target}%`;
    });
  });

  // urgency recommendation
  setTimeout(()=>{
    const noteEls = document.querySelectorAll('.result-card .note');
    noteEls.forEach((el, idx)=>{
      const rank = idx+1;
      const conf = parseInt(document.querySelectorAll('.progress-bar')[idx].dataset.target,10);
      let text = '';
      if(conf>80) text = 'Түргэн үзлэг шаардлагатай: Мэргэжлийн онош тавих хэрэгтэй.';
      else if(conf>50) text = 'Эмчид хандахыг зөвлөж байна.';
      else text = 'Мэдээлэлд үндэслэсэн ерөнхий таамаг. ажиглах болон шаардлагатай бол хандах.';
      el.textContent = text;
    });
  }, 700);
}

// Placeholder for future AI integration
async function sendToAI(apiUrl, payload){
  // Example payload: {age, gender, symptoms, nlp}
  try{
    const res = await fetch(apiUrl, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Network error');
    const json = await res.json();
    // Expected shape: [{condition, confidence, urgency}, ...]
    return json;
  }catch(err){
    console.warn('AI request failed', err);
    return null;
  }
}
