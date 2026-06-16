import { useMemo, useState } from 'react';

type Gender = 'male' | 'female';

type Diagnosis = {
  rank: number;
  name: string;
  score: number;
  confidence: number;
  urgency: string;
  advice: string;
};

type Condition = {
  name: string;
  symptoms: string[];
  keywords: string[];
  advice: string;
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
  'Цус алдах',
  'Нүд хорсох',
  'Нус гоожих',
  'Шээс хүрэх',
  'Булчин шөрмөс татах',
  'Шарх',
  'Ядарч сульдах',
  'Нүд улайх',
  'Гэдэс дүүрэх',
  'Шингэн хуримтлах',
  'Шүд өвдөх',
  'Хоолны дуршил буурах',
  'Нойргүйдэл',
  'Хэвлийгээр хавдах',
  'Халуун хүчтэй хөлрөх',
  'Хэвлийгээр хавдар',
  'Булчин өвдөх',
  'Хөлийн өвчин'
];

const conditionDataset: Condition[] = [
  {
    name: 'Ханиад/Томуу',
    symptoms: ['Халуурах', 'Ханиалгах', 'Хоолой өвдөх', 'Бие шартах'],
    keywords: ['ханиалгах', 'халуурах', 'өглөө', 'толгой'],
    advice: 'Амарч, ус ихээр ууна. Хэрвээ амьсгал давчдах эсвэл халууралт нэмэгдсэн бол эмчид ханд.'
  },
  {
    name: 'Грипп',
    symptoms: ['Халуурах', 'Толгой өвдөх', 'Бие шартах', 'Хөлрөх'],
    keywords: ['грипп', 'халуурах', 'бие сулрах', 'нарийвчлал'],
    advice: 'Амарч, шингэн ихээр ууж, халуун шөл ууна. Хэрвээ халууралт 38.5-аас давбал эмчид ханд.'
  },
  {
    name: 'Уушгины үрэвсэл',
    symptoms: ['Амьсгал давчдах', 'Ханиалгах', 'Халуун хүчтэй хөлрөх'],
    keywords: ['уушиг', 'амьсгал', 'харшил', 'үрэвсэл'],
    advice: 'Нарийн агаарт амьсгалаад, амрах хэрэгтэй. Амьсгал давчдах бол яаралтай эмчид ханд.'
  },
  {
    name: 'Бронхит',
    symptoms: ['Ханиалгах', 'Амьсгал давчдах', 'Нус гоожих'],
    keywords: ['бронхит', 'ханиалгах', 'хар', 'амьсгал'],
    advice: 'Чийглэг орчинд амрах, шингэн ихээр уух. Хэрвээ ханиалга удаан үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Хоолойн үрэвсэл',
    symptoms: ['Ханиалгах', 'Хоолой өвдөх', 'Нүд хорсох'],
    keywords: ['хоолой', 'хоолойн', 'харшил', 'хоолой өвдөх'],
    advice: 'Халуун шингэн ууж, хоолойг амраана. Өвдөлт их байвал эмчид ханд.'
  },
  {
    name: 'Нүдний үрэвсэл',
    symptoms: ['Нүд хорсох', 'Нүд улайх', 'Нус гоожих'],
    keywords: ['нүд', 'туур', 'хорсох', 'халдвар'],
    advice: 'Нүдийг цэвэрлэж, үрэхгүй байх. Хэрвээ хараа муудах бол нүдний эмчид ханд.'
  },
  {
    name: 'Аллерги',
    symptoms: ['Ханиалгах', 'Арьсны тууралт', 'Нус гоожих'],
    keywords: ['харшил', 'цагаан', 'цэцэг', 'тоос'],
    advice: 'Харшил үүсгэгчээс холдоно. Хэрвээ амьсгал давчдах эсвэл тууралт тархвал эмчид ханд.'
  },
  {
    name: 'Мигрень',
    symptoms: ['Толгой өвдөх', 'Ядарч сульдах', 'Нүд хорсох'],
    keywords: ['мигрень', 'толгой', 'дотор муухай', 'чимээ'],
    advice: 'Чимээгүй, харанхуй орчинд амарч, өвчин намдаах эм хэрэглэх боломжтой. Байдал сайжрахгүй бол эмчид ханд.'
  },
  {
    name: 'Гастроэнтерит',
    symptoms: ['Гэдэс өвдөх', 'Бөөлжих', 'Хэвлийдээ шөрмөс татах'],
    keywords: ['гэдэс', 'бөөлжих', 'хордлого', 'дотор муухай'],
    advice: 'Шингэн сайн ууж, хөнгөн хоол идэх. Цус гарах эсвэл хүчтэй өвдөх бол эмчид ханд.'
  },
  {
    name: 'Хоолны хордлого',
    symptoms: ['Бөөлжих', 'Гэдэс өвдөх', 'Хэвлийдээ шөрмөс татах'],
    keywords: ['хордлого', 'хордсон', 'хоолноос', 'дотор муухай'],
    advice: 'Шингэн ихээр ууж, амрах. Хэрвээ сул шингэн эсвэл цус гарвал эмчид ханд.'
  },
  {
    name: 'Өтгөн хаталт',
    symptoms: ['Гэдэс өвдөх', 'Хоолны дуршил буурах'],
    keywords: ['өтгөн', 'хатах', 'суларсан', 'дотор муухай'],
    advice: 'Ус ихээр ууж, ногоон хүнс хэрэглэ. Өвдөлт үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Суулгалт',
    symptoms: ['Гэдэс өвдөх', 'Шээс хүрэх', 'Дотор муухайрах'],
    keywords: ['суулгах', 'ус', 'хэвлий', 'цел'],
    advice: 'Шингэн сайн ууж, давсыг зохицуул. Цус гарвал эмчид ханд.'
  },
  {
    name: 'Үе мөчний өвчин',
    symptoms: ['Булчин өвдөх', 'Булчин шөрмөс татах', 'Ядарч сульдах'],
    keywords: ['булчин', 'шөрмөс', 'өглөө', 'суларсан'],
    advice: 'Дулаан жин тавиад, хөнгөн хөдөлгөөн хийнэ. Өвдөлт буурснаар эмчид хандах нь зүйтэй.'
  },
  {
    name: 'Арьсны тууралт',
    symptoms: ['Арьсны тууралт', 'Халуун хүчтэй хөлрөх', 'Улайх'],
    keywords: ['тууралт'],
    advice: 'Арьсыг цэвэр байлгаж, загатнал гарвал эмчид ханда.'
  },
  {
    name: 'Сэтгэл зүйн ядаргаа',
    symptoms: ['Ядарч сульдах', 'Толгой өвдөх', 'Бие сулрах'],
    keywords: ['стресс', 'тайван биш', 'сэтгэл', 'уурлах'],
    advice: 'Амрах, стрессийг багасгах арга хэрэглэ. Хэрвээ байдал сайжрахгүй бол мэргэжлийн тусламж ав.'
  },
  {
    name: 'Амьсгалын замын харшил',
    symptoms: ['Амьсгал давчдах', 'Ханиалгах', 'Нус гоожих'],
    keywords: ['харшил', 'амьсгал', 'нус', 'цэцэг'],
    advice: 'Цэвэр агаарт гараад, харшил үүсгэгчээс холдо. Амьсгал давчдах бол эмчид ханд.'
  },
  {
    name: 'Зүрхний хэм алдагдал',
    symptoms: ['Зүрх цохилох түргэсэх', 'Толгой өвдөх'],
    keywords: ['зүрх', 'цохилох', 'дуршил', 'хэцүү'],
    advice: 'Яаралтай эмчид үзүүлж, зүрхний хэмийг шалгуулаарай.'
  },
  {
    name: 'Цээжний шанхай',
    symptoms: ['Цус алдах', 'Толгой өвдөх', 'Зүрх цохилох түргэсэх'],
    keywords: ['цээж', 'шанхай', 'цус', 'зүрх'],
    advice: 'Энэ нь яаралтай эмчийн тусламж шаарддаг. Амьсгал давчдах бол шууд эмнэлэгт оч.'
  },
  {
    name: 'Нойргүйдэл',
    symptoms: ['Нойргүйдэл', 'Толгой өвдөх', 'Ядарч сульдах'],
    keywords: ['нойргүй', 'унтах', 'сэрэх', 'даралт'],
    advice: 'Нойрны дэглэм барьж, кофеинээс зайлсхий. Үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Ходоодны шарх',
    symptoms: ['Гэдэс өвдөх', 'Хоол боловсруулах эмгэг', 'Дотор муухайрах'],
    keywords: ['шарх', 'ходоод', 'хэвлий', 'дотор муухай'],
    advice: 'Хөнгөн хоол идэж, архи, кофе хязгаар. Өвдөх нь үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Бөөрний өвчин',
    symptoms: ['Хэвлийдээ шөрмөс татах', 'Шингэн хуримтлах', 'Хөлний өвчин'],
    keywords: ['бөөр', 'шингэн', 'хэвлий', 'арын'],
    advice: 'Шингэний хэрэглээг зохицуулж, эмчийн хяналтанд ор. Өвдөлт үргэлжилбэл ханда.'
  },
  {
    name: 'Шүдний өвчин',
    symptoms: ['Шүд өвдөх', 'Гэмтэл шарх'],
    keywords: ['шүд', 'шарх', 'өвдөх', 'сором'],
    advice: 'Шүдний эмчид үзүүлж, шаардлагатай эмчилгээ хийлгэнэ.'
  },
  {
    name: 'Цус багадалт',
    symptoms: ['Ядарч сульдах', 'Толгой эргэх', 'Амьсгал давчдах'],
    keywords: ['цус', 'багадалт', 'сул', 'ядарга'],
    advice: 'Төмөрлэг агуулсан хоол хэрэглэж, цусны шинжилгээ хийлгэнэ.'
  },
  {
    name: 'Хорт хавдар (ерөнхий)',
    symptoms: ['Ядарч сульдах', 'Бие сулрах', 'Толгой өвдөх'],
    keywords: ['хорт хавдар', 'цус', 'яс', 'жирэмсэн'],
    advice: 'Энэ нь ерөнхий таамаг. Шинжилгээ хийлгэж, эмчид ханд.'
  },
  {
    name: 'Гэдэсний дүүрэлт',
    symptoms: ['Гэдэс өвдөх', 'Дотор муухайрах', 'Хэвлийгээр хавдах'],
    keywords: ['дүүрэх', 'хавдах', 'хийтэх', 'гэдэс'],
    advice: 'Хөнгөн хоол идэж, давс багатай хоолло. Өвдөлт нэмэгдвэл эмчид ханд.'
  },
  {
    name: 'Хэвлийн үрэвсэл',
    symptoms: ['Хэвлийдээ шөрмөс татах', 'Гэдэс өвдөх', 'Суулгах'],
    keywords: ['хэвлий', 'үрэвсэл', 'шөрмөс', 'чангарах'],
    advice: 'Амарч, хөнгөн хоол иднэ. Хэрвээ өвдөлт тэсэхийн аргагүй бол эмчид ханд.'
  },
  {
    name: 'Венийн бөглөрөл',
    symptoms: ['Хөлний өвчин', 'Шингэн хуримтлах', 'Булчин өвдөх'],
    keywords: ['вен', 'бөглөрөл', 'шингэн', 'хөл'],
    advice: 'Хөлөө өндөрт өргөж, ойр ойрхон хөдөл. Өвдөлт их байвал эмчид ханд.'
  },
  {
    name: 'Толгойн даралт',
    symptoms: ['Толгой өвдөх', 'Толгой эргэх', 'Нүд улайх'],
    keywords: ['даралт', 'цус', 'зам', 'толгой'],
    advice: 'Чихэр, давс багатай хоол идэж, амарцгаана. Өвдөлт үргэлжилвэл эмчид үзүүл.'
  },
  {
    name: 'Жирэмсний шинж тэмдэг',
    symptoms: ['Дотор муухайрах', 'Хоолны дуршил буурах', 'Ядарч сульдах'],
    keywords: ['жирэмсэн', 'уншил', 'үр', 'төрөлт'],
    advice: 'Шинжилгээ хийлгэж, эмчийн хяналтанд орж, зөвлөгөө ав.'
  },
  {
    name: 'Нурууны өвчин',
    symptoms: ['Булчин өвдөх', 'Булчин шөрмөс татах', 'Ядарч сульдах'],
    keywords: ['нуруу', 'булчин', 'шөрмөс', 'өвчин'],
    advice: 'Дулаан жин тавиад, амарч, эмчид үзүүл. Өвдөлт их байвал заавал ханд.'
  },
  {
    name: 'Залгиурын ханиад',
    symptoms: ['Ханиалгах', 'Хоолой өвдөх', 'Амьсгал давчдах'],
    keywords: ['залгиур', 'ханиалгах', 'хоолой', 'ханиад'],
    advice: 'Халуун шингэн ууж, хоолойг амраана. Өвдөлт нэмэгдвэл эмчид ханд.'
  },
  {
    name: 'Шээсний замын халдвар',
    symptoms: ['Шээс хүрэх', 'Гэдэс өвдөх', 'Ядарч сульдах'],
    keywords: ['шээс', 'халдвар', 'хүрэх', 'урин'],
    advice: 'Шингэн сайн ууж, шээсний замыг цэвэр байлга. Хэрвээ шээсний цаг ихэсвэл эмчид ханд.'
  },
  {
    name: 'Бамбай булчирхайн өөрчлөлт',
    symptoms: ['Гэдэс өвдөх', 'Ядарч сульдах', 'Толгой өвдөх'],
    keywords: ['бамбай', 'булчирхай', 'жирэмсэн', 'сул'],
    advice: 'Эндокринологид үзүүлж, шаардлагатай шинжилгээ хийлгэ. Хэрвээ зүрх цохилох, жингээ алдвал яаралтай.'
  },
  {
    name: 'Нүдний хуурайшил',
    symptoms: ['Нүд хорсох', 'Нүд улайх'],
    keywords: ['нүд', 'хуурай', 'чийг', 'туур'],
    advice: 'Нүдний чийгшүүлэгч хэрэглэж, үрэхгүй байх. Хараа муудах бол эмчид ханд.'
  },
  {
    name: 'Хамар битүүрэх / синусит',
    symptoms: ['Нус гоожих', 'Толгой өвдөх', 'Амьсгал давчдах'],
    keywords: ['хамар', 'синус', 'битүүрэх', 'ханиалга'],
    advice: 'Чийглэг орчинд байж, халуун усаар амьсгал. Хэрвээ өвдөлт их байвал эмчид ханд.'
  },
  {
    name: 'Хоол боловсруулах эмгэг',
    symptoms: ['Гэдэс өвдөх', 'Хоолны дуршил буурах', 'Шингэн хуримтлах'],
    keywords: ['хоол', 'гэдэс', 'шингэн', 'тэсэх'],
    advice: 'Хөнгөн хоол идэж, ус ихээр ууна. Хэрвээ байдал сайжрахгүй бол эмчид ханд.'
  },
  {
    name: 'Булчингийн таталт',
    symptoms: ['Булчин өвдөх', 'Булчин шөрмөс татах'],
    keywords: ['булчин', 'таталт', 'шөрмөс', 'суларсан'],
    advice: 'Амарч, бүлээн жин тавиж, булчингаа тайвшруул. Хэрвээ өвдөлт их байвал эмчид ханда.'
  },
  {
    name: 'Артрит',
    symptoms: ['Булчин өвдөх', 'Үе мөчний өвчин', 'Ядарч сульдах'],
    keywords: ['артрит', 'үе', 'үрэвсэл', 'хөдөлгөөн'],
    advice: 'Үеийн хөдөлгөөнийг дэмжих дасгал хийнэ. Өвдөлт их байвал эмчид үзүүл.'
  },
  {
    name: 'Халуун амьсгал',
    symptoms: ['Амьсгал давчдах', 'Ханиалгах', 'Халуун хүчтэй хөлрөх'],
    keywords: ['амьсгал', 'уур', 'дуусах', 'ханиалга'],
    advice: 'Цэвэр агаарт гарч, амьсгалаа гүнзгий аваарай. Амьсгал давчдах бол эмчид ханд.'
  },
  {
    name: 'Цус алдалт',
    symptoms: ['Цус алдах', 'Толгой эргэх', 'Ядарч сульдах'],
    keywords: ['цус', 'алдалт', 'сул', 'ялгах'],
    advice: 'Яаралтай эмнэлэгт ханд. Цус алдалтын шалтгааныг тодруулах хэрэгтэй.'
  },
  {
    name: 'Хөлний өвчин',
    symptoms: ['Хөлийн өвчин', 'Шингэн хуримтлах', 'Булчин өвдөх'],
    keywords: ['хөл', 'өвчин', 'шингэн', 'булчин'],
    advice: 'Хөлөө өндөрт өргөөд амрааж, хүнд ачаалал багасга. Өвдөлт тархвал эмчид ханд.'
  },
  {
    name: 'Жин буурах',
    symptoms: ['Хоолны дуршил буурах', 'Ядарч сульдах'],
    keywords: ['жин', 'бурт', 'суларсан', 'хоол'],
    advice: 'Тэнцвэртэй хооллолт барьж, эмчид жингийн өөрчлөлтөө үзүүлэх нь зүйтэй.'
  },
  {
    name: 'Хүүхдийн халууралта',
    symptoms: ['Халуурах', 'Нус гоожих', 'Ханиалгах'],
    keywords: ['хүүхэд', 'халуурах', 'нус', 'ханиалга'],
    advice: 'Хүүхдийг амрааж, шингэн ихээр уулга. Хэрвээ амьсгал давчдах эсвэл цус гарбал эмчид ханд.'
  },
  {
    name: 'Тархины даралт',
    symptoms: ['Толгой өвдөх', 'Толгой эргэх', 'Нүд улайх'],
    keywords: ['даралт', 'цагаан', 'цус', 'толгой'],
    advice: 'Амрах, давс багатай хоол ид. Өвдөлт нэмэгдвэл эмчид ханд.'
  },
  {
    name: 'Тархины цус харвалт',
    symptoms: ['Толгой эргэх', 'Мэдээ алдалт', 'Толгой өвдөх'],
    keywords: ['цус харвалт', 'мэдрэхүй', 'даралт', 'цус'],
    advice: 'Энэ нь яаралтай тусламж шаардлагатай. Яаралтай эмнэлэгт оч.'
  },
  {
    name: 'Цусны даралт',
    symptoms: ['Толгой өвдөх', 'Толгой эргэх', 'Нүд улайх'],
    keywords: ['даралт', 'цус', 'тал', 'гол'],
    advice: 'Давс багатай хоол идэж, цусны даралтаа хэмж. Үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Хоол боловсруулах эмгэг',
    symptoms: ['Гэдэс өвдөх', 'Хоолны дуршил буурах', 'Шингэн хуримтлах'],
    keywords: ['хоол', 'гэдэс', 'шингэн', 'тэсэх'],
    advice: 'Хөнгөн хоол идэж, ус ихээр ууна. Байдал сайжравал эмчид ханд.'
  },
  {
    name: 'Шарлах',
    symptoms: ['Нүд улайх', 'Цус алдах', 'Ядарч сульдах'],
    keywords: ['шар', 'нүд', 'сяан', 'архи'],
    advice: 'Энэхүү шинж тэмдэг нь хүндэрч болох тул эмчид үзүүл.'
  },
  {
    name: 'Хуурай хоолой',
    symptoms: ['Хоолой өвдөх', 'Ханиалгах'],
    keywords: ['хуурай', 'хоолой', 'унжих', 'ханиалга'],
    advice: 'Чийгтэй орчинд байх, ус ихээр уух. Хэрвээ удаан үргэлжилбэл эмчид ханд.'
  },
  {
    name: 'Хоолойн хордлого',
    symptoms: ['Ханиалгах', 'Гэдэс өвдөх', 'Шарх'],
    keywords: ['хордлого', 'хоол', 'бөөлжих', 'үнэр'],
    advice: 'Шингэн ихээр ууж, амрах. Хэрвээ байдал муудах бол эмчид ханд.'
  },
  {
    name: 'Гэмтлийн дараах өвчин',
    symptoms: ['Гэмтэл шарх', 'Хөлний өвчин', 'Мэдээ алдалт'],
    keywords: ['гэмтэл', 'шарх', 'сэрвэг', 'мэдрэх'],
    advice: 'Шархыг цэвэр байлгаж, эмчийн заавраар арчилна. Хэрвээ өвдөлт нэмэгдвэл мэргэжлийн тусламж ав.'
  },
  {
    name: 'Судсан үрэвсэл',
    symptoms: ['Толгой өвдөх', 'Зүрх цохилох түргэсэх', 'Нүд улайх'],
    keywords: ['судал', 'үрэвсэл', 'цус', 'даралт'],
    advice: 'Эмчид үзүүлж, цусны шинжилгээ хийлгэнэ. Хэрвээ амьсгал давчдах бол шууд ханд.'
  },
  {
    name: 'Хэрвээшилт',
    symptoms: ['Хоолны дуршил буурах', 'Ядарч сульдах', 'Гэдэс өвдөх'],
    keywords: ['хэрвээ', 'ирэх', 'тэсэх', 'хоол'],
    advice: 'Хөнгөн хоол идэж, тулгамдсан үед эмчид ханд.'
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
  description: string,
  sensitivity: number
) => {
  const text = description.toLowerCase();
  const selectedSet = new Set(selectedSymptoms);
  const base = Math.min(duration, 14) * 2;
  const symptomWeight = 20 * sensitivity;
  const keywordWeight = 14 * sensitivity;

  const scored = conditionDataset.map((condition) => {
    let score = 18 + base;
    score += condition.symptoms.reduce(
      (sum, symptom) => sum + (selectedSet.has(symptom) ? symptomWeight : 0),
      0
    );
    score += condition.keywords.reduce(
      (sum, keyword) => sum + (text.includes(keyword) ? keywordWeight : 0),
      0
    );
    if (age && age >= 50 && /астма|хоолойн|арьсны|гэс|бөөлж|зүрх|цээж/i.test(condition.name)) score += 5;
    if (gender === 'female' && /арьсны|сэтгэл|хөх|жирэмсний/i.test(condition.name)) score += 3;
    return { name: condition.name, score, advice: condition.advice };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
};

const getConfidenceByRank = (rank: number, total: number): number | null => {
  if (total === 1) return 100;
  if (total === 2) return rank === 1 ? 60 : 40;
  if (rank === 1) return 60;
  if (rank === 2) return 25;
  if (rank === 3) return 15;
  return null;
};

export default function Home() {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('male');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [resultCount, setResultCount] = useState(3);
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
      description,
      sensitivity
    );

    const top = diagnosisScores.slice(0, Math.max(1, Math.min(3, resultCount)));
    const maxScore = top[0]?.score || 1;

    const computed = top.map((item, index) => {
      const fixedConfidence = getConfidenceByRank(index + 1, top.length);
      const confidence = fixedConfidence ?? Math.max(5, Math.round((item.score / maxScore) * 100));
      return {
        rank: index + 1,
        name: item.name,
        score: item.score,
        confidence,
        urgency: urgencyText(confidence),
        advice: item.advice
      };
    });

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
              <select value="days" onChange={() => null} disabled className="disabled-select">
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
          <p>
            Систем нь локал оношилгооны алгоритм ашиглан магадлалыг авч үзнэ. Асуудал гарвал эмчид хандаарай.
          </p>
          <div className="settings-card">
            <div>
              <label>Үр дүнгийн тоо</label>
              <select value={resultCount} onChange={(e) => setResultCount(Number(e.target.value))}>
                {[1, 2, 3].map((value) => (
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
                <p className="advice-note">{result.advice}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
