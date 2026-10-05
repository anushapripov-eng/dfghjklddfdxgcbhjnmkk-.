import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Paperclip, Flag, Sun, Moon, BookOpen, Check, ChevronRight, Flame, History, MoreHorizontal, RotateCcw, Send, Settings, Sparkles, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { characterImages, type Mood, type Teacher } from "@/lib/characters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Юни и Рэй — учиться живо" },
      { name: "description", content: "Персональный учитель, который объясняет темы, тренирует и помогает расти." },
      { property: "og:title", content: "Юни и Рэй — учиться живо" },
      { property: "og:description", content: "Разбирай новые темы, проходи короткие экзамены и следи за прогрессом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Screen = "home" | "chat" | "quiz" | "result" | "history" | "settings";
type Message = { from: "user" | "teacher"; text: string };

const questions = [
  { text: "Чему равно ½ + ½?", answers: ["¼", "1", "2"], correct: 1, hint: "Две половины составляют целое." },
  { text: "Сколько будет ¾ от 20?", answers: ["12", "15", "16"], correct: 1, hint: "Раздели 20 на 4 и умножь на 3." },
  { text: "Какая дробь равна 0,5?", answers: ["½", "⅓", "⅕"], correct: 0, hint: "Половина — это пять десятых." },
];

const teacherCopy = {
  yuni: { name: "Юни", greeting: "Рад тебя видеть. Дай мне тему — и разберём её спокойно", prompt: "Что разберём? Напиши тему или пришли фото задания." },
  rei: { name: "Рэй", greeting: "Юху, ты здесь! Дай мне тему — и мы начнём прямо сейчас", prompt: "Что разбираем? Пиши тему или кидай фото задания!" },
};

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [teacher, setTeacher] = useState<Teacher>("yuni");
  const [mood, setMood] = useState<Mood>("wait");
  const [menuOpen, setMenuOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => { const t = window.localStorage.getItem("yr-theme"); if (t === "dark" || t === "light") setTheme(t); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; window.localStorage.setItem("yr-theme", theme); }, [theme]);
  const [detail, setDetail] = useState("steps");
  const [historyItems, setHistoryItems] = useState([{ topic: "Дроби и проценты", score: 4.8, date: "Сегодня" }]);

  useEffect(() => {
    const saved = window.localStorage.getItem("yuni-rei-state");
    if (!saved) return;
    try {
      const state = JSON.parse(saved) as { teacher?: Teacher; sound?: boolean; detail?: string };
      if (state.teacher) setTeacher(state.teacher);
      if (typeof state.sound === "boolean") setSound(state.sound);
      if (state.detail) setDetail(state.detail);
    } catch { /* keep defaults */ }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("yuni-rei-state", JSON.stringify({ teacher, sound, detail }));
  }, [teacher, sound, detail]);

  const copy = teacherCopy[teacher];
  const average = useMemo(() => historyItems.length ? (historyItems.reduce((sum, item) => sum + item.score, 0) / historyItems.length).toFixed(1).replace(".", ",") : "—", [historyItems]);

  function go(next: Screen) {
    setMenuOpen(false);
    setScreen(next);
  }

  function startTopic() {
    setMessages([{ from: "teacher", text: copy.prompt }]);
    setMood("listen");
    go("chat");
  }

  function sendMessage() {
    const clean = topic.trim();
    if (!clean) return;
    setMessages((old) => [...old, { from: "user", text: clean }, { from: "teacher", text: `Отличная тема. Начнём с главной идеи «${clean}», а затем сразу попробуем на простом примере.` }]);
    setTopic("");
    setMood("talk");
    window.setTimeout(() => setMood("happy"), 900);
  }

  function checkAnswer() {
    if (selected === null) return;
    setChecked(true);
    if (selected === questions[questionIndex]!.correct) {
      setScore((value) => value + 1);
      setMood("happy");
    } else setMood("sad");
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      const finalScore = Math.round(((score + (selected === questions[questionIndex]!.correct ? 0 : 0)) / questions.length) * 5 * 10) / 10;
      setHistoryItems((items) => [{ topic: "Новая тема", score: finalScore, date: "Только что" }, ...items]);
      go("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelected(null);
    setChecked(false);
    setMood("wait");
  }

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {screen === "home" && <Home teacher={teacher} mood={mood} copy={copy} average={average} menuOpen={menuOpen} setMenuOpen={setMenuOpen} startTopic={startTopic} go={go} />}
        {screen === "chat" && <Chat teacher={teacher} mood={mood} messages={messages} topic={topic} setTopic={setTopic} sendMessage={sendMessage} go={go} startQuiz={() => { setQuestionIndex(0); setSelected(null); setChecked(false); setScore(0); go("quiz"); }} />}
        {screen === "quiz" && <Quiz teacher={teacher} mood={mood} index={questionIndex} selected={selected} checked={checked} setSelected={setSelected} checkAnswer={checkAnswer} nextQuestion={nextQuestion} go={go} />}
        {screen === "result" && <Result teacher={teacher} score={score} go={go} />}
        {screen === "history" && <HistoryScreen items={historyItems} average={average} go={go} />}
        {screen === "settings" && <SettingsScreen theme={theme} setTheme={setTheme} teacher={teacher} setTeacher={setTeacher} sound={sound} setSound={setSound} detail={detail} setDetail={setDetail} reset={() => setHistoryItems([])} go={go} />}
      </div>
    </div>
  );
}

function Home({ teacher, mood: baseMood, copy, average, menuOpen, setMenuOpen, startTopic, go }: { teacher: Teacher; mood: Mood; copy: typeof teacherCopy.yuni; average: string; menuOpen: boolean; setMenuOpen: (v: boolean) => void; startTopic: () => void; go: (s: Screen) => void }) {
  const [poke, setPoke] = useState(false);
  const mood: Mood = poke ? "happy" : baseMood;
  return <section className="screen home-screen">
    <header className="topbar entrance entrance-one">
      <Button size="icon" variant="primary" aria-label="Профиль" className="avatar-button">{copy.name[0]}</Button>
      <div className="streak"><Flame size={16} fill="currentColor"/><strong>12</strong><span>дней</span></div>
      <div className="menu-wrap">
        <Button size="icon" variant="soft" aria-label="Открыть меню" onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal /></Button>
        {menuOpen && <div className="quick-menu entrance">
          <button onClick={() => go("history")}><History size={18}/><span>История</span><ChevronRight size={16}/></button>
          <button onClick={() => go("settings")}><Settings size={18}/><span>Настройки</span><ChevronRight size={16}/></button>
        </div>}
      </div>
    </header>

    <main className="home-main">
      <div className="speech entrance entrance-three"><p>{copy.greeting}</p><i /></div>
      <div className={`character-stage entrance entrance-two ${poke ? "poke" : ""}`} onClick={() => { setPoke(true); window.setTimeout(() => setPoke(false), 1200); }}>
        <div className="character-halo" />
        <img className="character breathing" src={characterImages[teacher][mood]} alt={`${copy.name}, ваш учитель`} />
      </div>
      <div className="chips entrance entrance-four"><button className="chip" onClick={() => go("history")} aria-label="Тем пройдено"><BookOpen size={18}/><strong>8</strong></button><button className="chip" onClick={() => go("history")} aria-label="Средний балл"><Star size={18} fill="currentColor"/><strong>{average}</strong></button></div>
    </main>
    <footer className="home-footer">
            <Button variant="primary" size="lg" className="w-full entrance entrance-seven" onClick={startTopic}>Новая тема <span className="cta-arrow"><ArrowRight size={20}/></span></Button>
    </footer>
  </section>;
}

function BackHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return <header className="page-header"><Button variant="soft" size="icon" onClick={onBack} aria-label="Назад"><ArrowLeft/></Button><h1>{title}</h1><div className="header-action">{action}</div></header>;
}

function Chat({ teacher, mood, messages, topic, setTopic, sendMessage, go, startQuiz }: { teacher: Teacher; mood: Mood; messages: Message[]; topic: string; setTopic: (v: string) => void; sendMessage: () => void; go: (s: Screen) => void; startQuiz: () => void }) {
  return <section className="screen chat-screen">
    <BackHeader title={teacherCopy[teacher].name} onBack={() => go("home")} action={<Button size="icon" variant="soft" onClick={startQuiz} aria-label="Начать экзамен"><Flag size={19}/></Button>} />
    <div className="chat-character"><img src={characterImages[teacher][mood]} alt="Учитель слушает" /></div>
    <div className="messages">
      {messages.map((message, index) => <div key={`${message.text}-${index}`} className={`message ${message.from}`}>{message.text}</div>)}
    </div>
    <form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
      <Button type="button" size="icon" variant="ghost" aria-label="Добавить фото"><Paperclip/></Button>
      <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Сообщение" aria-label="Тема для изучения" />
      {topic.trim() && <Button type="submit" size="icon" variant="primary" aria-label="Отправить"><Send size={19}/></Button>}
    </form>
  </section>;
}

function Quiz({ teacher, mood, index, selected, checked, setSelected, checkAnswer, nextQuestion, go }: { teacher: Teacher; mood: Mood; index: number; selected: number | null; checked: boolean; setSelected: (v: number) => void; checkAnswer: () => void; nextQuestion: () => void; go: (s: Screen) => void }) {
  const question = questions[index]!;
  return <section className="screen quiz-screen">
    <div className="quiz-top"><Button size="icon" variant="ghost" onClick={() => go("chat")} aria-label="Закрыть"><X/></Button><div className="progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }}/></div><span>{index + 1}/{questions.length}</span></div>
    <div className="quiz-character"><img src={characterImages[teacher][mood]} alt="Учитель" /></div>
    <main className="quiz-body"><span className="eyebrow">Быстрая проверка</span><h1>{question.text}</h1><div className="answers">
      {question.answers.map((answer, answerIndex) => {
        const isCorrect = checked && answerIndex === question.correct;
        const isWrong = checked && selected === answerIndex && !isCorrect;
        return <button key={answer} className={`answer ${selected === answerIndex ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => !checked && setSelected(answerIndex)}><span>{String.fromCharCode(65 + answerIndex)}</span>{answer}{isCorrect && <Check size={20}/>}</button>;
      })}
    </div>{checked && <div className={`feedback entrance ${selected === question.correct ? "ok" : "bad"}`}><strong>{selected === question.correct ? "Точно!" : "Почти."}</strong><span>{question.hint}</span></div>}</main>
    <footer className="sticky-action"><Button variant="primary" size="lg" className="w-full" disabled={selected === null} onClick={checked ? nextQuestion : checkAnswer}>{checked ? (index === questions.length - 1 ? "Результат" : "Дальше") : "Проверить"}</Button></footer>
  </section>;
}

function Result({ teacher, score, go }: { teacher: Teacher; score: number; go: (s: Screen) => void }) {
  const mark = Math.round((score / questions.length) * 5 * 10) / 10;
  return <section className="screen result-screen"><div className="result-burst"><Star/><Star/><Sparkles/></div><img className="result-character" src={characterImages[teacher][score >= 2 ? "happy" : "sad"]} alt="Результат"/><span className="eyebrow">Тема завершена</span><h1>{score >= 2 ? "Вот это мощно!" : "Уже ближе"}</h1><div className="score-ring"><strong>{mark}</strong><span>из 5</span></div><p>{score} правильных ответа из {questions.length}. Каждый шаг уже делает следующую тему легче.</p><div className="result-actions"><Button variant="primary" size="lg" onClick={() => go("home")}>На главную</Button><Button variant="soft" size="lg" onClick={() => go("history")}>История</Button></div></section>;
}

function HistoryScreen({ items, average, go }: { items: { topic: string; score: number; date: string }[]; average: string; go: (s: Screen) => void }) {
  return <section className="screen content-screen"><BackHeader title="История" onBack={() => go("home")} action={<div className="mini-score"><Star size={15} fill="currentColor"/>{average}</div>}/><main className="content-body"><div className="history-lead"><span className="eyebrow">Твой ритм</span><h2>{items.length ? "Ты уже в движении" : "Первый результат впереди"}</h2><div className="week-bars">{[42,68,51,82,62,90,73].map((height, i) => <i key={i} style={{height: `${height}%`}} />)}</div></div><div className="section-title"><h3>Последние темы</h3><span>{items.length}</span></div>{items.length ? items.map((item, index) => <article className="history-row" key={`${item.date}-${index}`}><div className="history-icon"><Check/></div><div><strong>{item.topic}</strong><span>{item.date}</span></div><b>{item.score}</b></article>) : <div className="empty-state"><Sparkles/><p>Заверши первую тему, и здесь появится твой прогресс.</p></div>}</main></section>;
}

function SettingsScreen({ theme, setTheme, teacher, setTeacher, sound, setSound, detail, setDetail, reset, go }: { theme: "light" | "dark"; setTheme: (v: "light" | "dark") => void; teacher: Teacher; setTeacher: (v: Teacher) => void; sound: boolean; setSound: (v: boolean) => void; detail: string; setDetail: (v: string) => void; reset: () => void; go: (s: Screen) => void }) {
  return <section className="screen content-screen"><BackHeader title="Настройки" onBack={() => go("home")} /><main className="content-body settings-body"><div className="setting-group"><label>Тема</label><div className="segmented theme-toggle">{([["light","Светлая",Sun],["dark","Тёмная",Moon]] as const).map(([v,l,Icon]) => <button key={v} className={theme === v ? "active" : ""} onClick={() => setTheme(v)}><Icon size={18}/>{l}</button>)}</div></div><div className="setting-group"><label>Учитель</label><div className="teacher-picker">{(["yuni", "rei"] as Teacher[]).map((item) => <button key={item} className={teacher === item ? "active" : ""} onClick={() => setTeacher(item)}><img src={characterImages[item].happy} alt={teacherCopy[item].name}/><span>{teacherCopy[item].name}</span>{teacher === item && <Check/>}</button>)}</div></div><div className="setting-group"><label>Как объяснять</label><div className="segmented vertical">{[["short","Коротко"],["detailed","Подробно"],["steps","Шаг за шагом"]].map(([value,label]) => <button key={value} className={detail === value ? "active" : ""} onClick={() => setDetail(value!)}>{label}{detail === value && <Check/>}</button>)}</div></div><div className="setting-row"><div><strong>Звуки и реакции</strong><span>Делают занятия живее</span></div><button className={`switch ${sound ? "on" : ""}`} onClick={() => setSound(!sound)} aria-label="Переключить звук"><i/></button></div><Button variant="danger" size="lg" onClick={() => { if (window.confirm("Сбросить весь прогресс?")) reset(); }}><RotateCcw size={19}/>Сбросить прогресс</Button></main></section>;
}