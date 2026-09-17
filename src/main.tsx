import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const languages = [
  ['en','English'], ['uz','O‘zbek'], ['ru','Русский'], ['es','Español'], ['fr','Français'],
  ['de','Deutsch'], ['zh','中文'], ['ar','العربية'], ['hi','हिन्दी'], ['pt','Português'],
  ['ja','日本語'], ['ko','한국어'], ['tr','Türkçe'], ['it','Italiano'], ['nl','Nederlands'],
  ['pl','Polski'], ['uk','Українська'], ['vi','Tiếng Việt'], ['id','Bahasa Indonesia'], ['fa','فارسی']
] as const;
type Lang = typeof languages[number][0];
type Tile = { id: number; value: number; color: string };

const copy: Record<Lang, Record<string, string>> = {
  en:{level:'Level',energy:'Energy',coins:'Coins',best:'Best',merge:'Merge & Earn',daily:'Daily reward',quests:'Quests',invite:'Invite friends',shop:'Shop',settings:'Settings',mergeHint:'Tap two matching tiles to merge',locked:'Board locked',unlock:'Watch video to unlock',referral:'Invite a friend',claim:'Claim reward',ready:'Ready to play',xp:'XP',sound:'Sound effects',language:'Language',dailyText:'Come back tomorrow for a bigger bonus!',inviteText:'Get +10 energy for every friend who joins.'},
  uz:{level:'Daraja',energy:'Energiya',coins:'Tangalar',best:'Rekord',merge:'Birlashtir va top',daily:'Kunlik mukofot',quests:'Vazifalar',invite:'Do‘stlarni taklif qilish',shop:'Do‘kon',settings:'Sozlamalar',mergeHint:'Birlashtirish uchun bir xil ikkita katakka teging',locked:'Maydon bloklandi',unlock:'Ochish uchun video ko‘ring',referral:'Do‘st taklif qilish',claim:'Mukofotni olish',ready:'O‘ynashga tayyor',xp:'XP',sound:'Ovoz effektlari',language:'Til',dailyText:'Kattaroq bonus uchun ertaga qayting!',inviteText:'Har bir qo‘shilgan do‘st uchun +10 energiya oling.'},
  ru:{level:'Уровень',energy:'Энергия',coins:'Монеты',best:'Рекорд',merge:'Объедини и заработай',daily:'Ежедневная награда',quests:'Задания',invite:'Пригласить друзей',shop:'Магазин',settings:'Настройки',mergeHint:'Нажмите на две одинаковые плитки',locked:'Поле заблокировано',unlock:'Посмотрите видео, чтобы открыть',referral:'Пригласить друга',claim:'Забрать награду',ready:'Готово к игре',xp:'XP',sound:'Звуки',language:'Язык',dailyText:'Возвращайтесь завтра за большим бонусом!',inviteText:'Получайте +10 энергии за каждого друга.'},
  es:{level:'Nivel',energy:'Energía',coins:'Monedas',best:'Récord',merge:'Combina y gana',daily:'Recompensa diaria',quests:'Misiones',invite:'Invitar amigos',shop:'Tienda',settings:'Ajustes',mergeHint:'Toca dos fichas iguales para combinar',locked:'Tablero bloqueado',unlock:'Mira un vídeo para desbloquear',referral:'Invitar a un amigo',claim:'Reclamar recompensa',ready:'Listo para jugar',xp:'XP',sound:'Efectos de sonido',language:'Idioma',dailyText:'¡Vuelve mañana para un bonus mayor!',inviteText:'Obtén +10 de energía por cada amigo.'},
  fr:{level:'Niveau',energy:'Énergie',coins:'Pièces',best:'Record',merge:'Fusionne et gagne',daily:'Récompense du jour',quests:'Quêtes',invite:'Inviter des amis',shop:'Boutique',settings:'Réglages',mergeHint:'Touchez deux tuiles identiques',locked:'Plateau verrouillé',unlock:'Regardez une vidéo pour débloquer',referral:'Inviter un ami',claim:'Récupérer',ready:'Prêt à jouer',xp:'XP',sound:'Effets sonores',language:'Langue',dailyText:'Revenez demain pour un bonus plus grand !',inviteText:'Gagnez +10 énergie par ami.'},
  de:{level:'Level',energy:'Energie',coins:'Münzen',best:'Rekord',merge:'Kombinieren & verdienen',daily:'Tagesbonus',quests:'Aufgaben',invite:'Freunde einladen',shop:'Shop',settings:'Einstellungen',mergeHint:'Tippe zwei gleiche Kacheln an',locked:'Spielfeld gesperrt',unlock:'Video ansehen zum Entsperren',referral:'Freund einladen',claim:'Bonus abholen',ready:'Bereit zum Spielen',xp:'XP',sound:'Soundeffekte',language:'Sprache',dailyText:'Komm morgen für einen größeren Bonus zurück!',inviteText:'Erhalte +10 Energie pro Freund.'},
  zh:{level:'等级',energy:'能量',coins:'金币',best:'最高分',merge:'合并赚取',daily:'每日奖励',quests:'任务',invite:'邀请好友',shop:'商店',settings:'设置',mergeHint:'点击两个相同的方块进行合并',locked:'棋盘已锁定',unlock:'观看视频解锁',referral:'邀请好友',claim:'领取奖励',ready:'准备开始',xp:'经验',sound:'音效',language:'语言',dailyText:'明天回来领取更大奖励！',inviteText:'每邀请一位好友获得+10能量。'},
  ar:{level:'المستوى',energy:'الطاقة',coins:'العملات',best:'الأفضل',merge:'ادمج واربح',daily:'المكافأة اليومية',quests:'المهام',invite:'دعوة الأصدقاء',shop:'المتجر',settings:'الإعدادات',mergeHint:'اضغط على قطعتين متطابقتين للدمج',locked:'اللوحة مقفلة',unlock:'شاهد الفيديو للفتح',referral:'دعوة صديق',claim:'استلام المكافأة',ready:'جاهز للعب',xp:'XP',sound:'المؤثرات الصوتية',language:'اللغة',dailyText:'عد غداً لمكافأة أكبر!',inviteText:'احصل على +10 طاقة لكل صديق.'},
  hi:{level:'स्तर',energy:'ऊर्जा',coins:'सिक्के',best:'सर्वश्रेष्ठ',merge:'मर्ज करें और कमाएं',daily:'दैनिक पुरस्कार',quests:'क्वेस्ट',invite:'दोस्तों को बुलाएं',shop:'दुकान',settings:'सेटिंग्स',mergeHint:'मिलान वाली दो टाइल पर टैप करें',locked:'बोर्ड लॉक है',unlock:'अनलॉक करने के लिए वीडियो देखें',referral:'दोस्त बुलाएं',claim:'पुरस्कार लें',ready:'खेलने के लिए तैयार',xp:'XP',sound:'ध्वनि प्रभाव',language:'भाषा',dailyText:'बड़े बोनस के लिए कल वापस आएं!',inviteText:'हर दोस्त के लिए +10 ऊर्जा पाएं।'},
};
const fallback = copy.en;
for (const [code] of languages) if (!copy[code]) copy[code] = fallback;
const colors = ['#72e6b1','#6ca8ff','#c88cff','#ffcf70','#ff7d9c','#66d9e8'];
const initialTiles = (): Tile[] => Array.from({length:36},(_,id)=>({id,value:id<8?1:0,color:colors[id%colors.length]}));

function App(){
  const [lang,setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
  const [tiles,setTiles]=useState(initialTiles); const [selected,setSelected]=useState<number|null>(null);
  const [energy,setEnergy]=useState(100); const [coins,setCoins]=useState(1240); const [level,setLevel]=useState(7);
  const [xp,setXp]=useState(64); const [locked,setLocked]=useState(false); const [sound,setSound]=useState(true); const [notice,setNotice]=useState('');
  const t=copy[lang] || fallback; const rtl=lang==='ar'||lang==='fa';
  useEffect(()=>{localStorage.setItem('lang',lang)},[lang]);
  useEffect(()=>{const timer=setInterval(()=>setEnergy(e=>Math.min(100,e+1)),60000); return()=>clearInterval(timer)},[]);
  const playNote=useCallback(()=>{if(sound){const C=window.AudioContext|| (window as any).webkitAudioContext; if(C){const a=new C(),o=a.createOscillator(),g=a.createGain();o.frequency.value=220+Math.random()*440;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.035,a.currentTime);o.start();o.stop(a.currentTime+.09)}}},[sound]);
  const merge=(a:number,b:number)=>{if(energy<1){setNotice('⚡ '+t.energy+' '+t.ready);return} setTiles(ts=>ts.map(x=>x.id===a?{...x,value:Math.min(9,x.value+1),color:colors[(x.value)%colors.length]}:x.id===b?{...x,value:0}:x));setEnergy(e=>e-1);setCoins(c=>c+25);setXp(x=>{const n=x+8;if(n>=100){setLevel(l=>l+1);return n-100}return n});playNote();setNotice('+25 '+t.coins)};
  const tap=(id:number)=>{if(locked)return;if(!tiles[id].value)return;if(selected===null){setSelected(id);playNote()}else if(selected===id)setSelected(null);else if(tiles[selected].value===tiles[id].value) {merge(selected,id);setSelected(null)} else {setSelected(id);playNote()}};
  const claim=()=>{setCoins(c=>c+100);setEnergy(e=>Math.min(100,e+20));setNotice('+100 '+t.coins);};
  const invite=()=>{navigator.clipboard?.writeText('https://t.me/merge_earn_bot?start=invite');setNotice(t.inviteText)};
  const stats=useMemo(()=>[[t.level,level,'◆'],[t.energy,energy+'/100','⚡'],[t.coins,coins.toLocaleString(),'◈']], [t,level,energy,coins]);
  return <main dir={rtl?'rtl':'ltr'}><div className="app-shell">
    <header><div className="brand"><div className="logo">✦</div><div><h1>{t.merge}</h1><small>{t.ready}</small></div></div><select value={lang} onChange={e=>setLang(e.target.value as Lang)} aria-label={t.language}>{languages.map(([c,n])=><option key={c} value={c}>{n}</option>)}</select></header>
    <section className="stats">{stats.map(([label,value,icon])=><div className="stat" key={String(label)}><span>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>)}</section>
    <div className="progress"><span style={{width:`${xp}%`}}/><label>{t.xp} {xp}/100</label></div>
    <section className="game-card"><div className="game-top"><div><h2>{t.level} {level}</h2><p>{t.mergeHint}</p></div><button className="icon-btn" onClick={()=>setSound(!sound)} aria-label={t.sound}>{sound?'🔊':'🔇'}</button></div>
      <div className="grid">{tiles.map(tile=><motion.button key={tile.id} whileTap={{scale:.9}} className={`tile v${tile.value} ${selected===tile.id?'selected':''}`} onClick={()=>tap(tile.id)} aria-label={`Tile ${tile.value}`}>{tile.value>0&&<><span>{tile.value}</span><i style={{background:tile.color}}/></>}</motion.button>)}</div>
      <AnimatePresence>{notice&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="notice" onAnimationComplete={()=>setTimeout(()=>setNotice(''),1800)}>{notice}</motion.div>}</AnimatePresence>
      {locked&&<div className="lock"><strong>🔒 {t.locked}</strong><p>{t.unlock}</p><button onClick={()=>setLocked(false)}>{t.unlock}</button><button className="secondary" onClick={()=>{setLocked(false);invite()}}>{t.referral}</button></div>}
    </section>
    <section className="cards"><button className="feature" onClick={claim}><span className="feature-icon">🎁</span><div><b>{t.daily}</b><small>{t.dailyText}</small></div><em>›</em></button><button className="feature" onClick={invite}><span className="feature-icon">👥</span><div><b>{t.invite}</b><small>{t.inviteText}</small></div><em>›</em></button></section>
    <nav><button className="active">✦<span>{t.merge}</span></button><button onClick={()=>setNotice(t.quests)}>☑<span>{t.quests}</span></button><button onClick={()=>setNotice(t.shop)}>◈<span>{t.shop}</span></button><button onClick={()=>setNotice(t.settings)}>⚙<span>{t.settings}</span></button></nav>
  </div></main>
}

createRoot(document.getElementById('root')!).render(<App />);
