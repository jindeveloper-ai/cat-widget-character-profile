"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "talk" | "moments" | "profile";
type Locale = "ko" | "en" | "ja";

const localeOrder: Locale[] = ["ko", "en", "ja"];
const localeBadge: Record<Locale, string> = { ko: "KO", en: "EN", ja: "JP" };

const ui = {
  ko: {
    character: "나린", editorialAria: "캐릭터 소개", kicker: "읽씹 12분째.", headline: ["황태자가", "무너졌다."], intro: ["남들 앞에서는 얼음처럼 완벽하고,", "당신 앞에서는 답장 하나에 흔들리는 사람."],
    messengerAria: "나린 캐릭터 메신저", srTitle: "읽씹을 못 견디는 황태자 나린", back: "뒤로 가기", profileView: "나린 프로필 보기", online: "지금 접속 중", language: "언어 변경", date: "오늘 자시 · 읽씹 12분째",
    heroAlt: "청회색 눈으로 카메라를 바라보는 황태자 나린", heroQuote: "“기다린 것이 아닙니다.”", heroPlace: "— 방금 전, 황태자 처소", majesty: "폐하.", busy: "…아~주 많이 바쁘신 모양입니다.", oneReply: ["답장 하나 정도는 내려주셔도", "나라가 망하진 않을 텐데요."], deleted: "메시지를 삭제했습니다", typo: "오타입니다. 실수.", read: "읽음",
    doorAlt: "황제의 처소 앞에서 기다리는 나린", detected: "현관 감지됨", atDoor: "누군가 문 앞에 있습니다.", reset: "다른 답장 보내기 ↺", quickAria: "빠른 답장", yourReply: "폐하의 답장",
    archiveTitle: ["당신만 아는", "나린의 순간들"], archiveDesc: "스크린샷의 첫 줄 순서 그대로, 11개의 장면.", swipe: "옆으로 넘겨보세요 · 01—11", listAria: "나린 이미지 미리보기 목록", select: "번 이미지 선택", large: "크게 미리보기", viewLarge: "크게 보기 ↗",
    profileAlt: "황태자 예복을 입은 나린", backTalk: "대화로 돌아가기", crownPrince: "라타나 제국 황태자", profileQuote: ["“관심 없는 척하는 데에는", "재능이 없습니다.”"], age: "나이", height: "키", blood: "혈통", bloodValue: "샴고양이 수인", scent: "향", scentValue: "복숭아 · 바닐라 · 백단향",
    everyone: "모두에게", coldPrince: ["차갑고 오만한", "얼음 황태자"], onlyYou: "오직 당신에게", needyCat: ["읽씹을 못 견디는", "샴고양이"], tags: ["#집착", "#츤데레", "#분리불안", "#궁정로맨스", "#얼음왕자"], confession: ["“폐하가 돌아서면, 체면 같은 것은", "아무래도 좋습니다.”"], cta: "위프에서 나린 만나기",
    contactTitle: "작가에게 연락하기", contactDesc: "인스타그램 DM 또는 이메일로 연락해 주세요.", navAria: "주요 메뉴", talk: "대화", moments: "순간", profile: "나린", close: "미리보기 닫기", prev: "이전 이미지", next: "다음 이미지", dialog: "이미지 미리보기",
  },
  en: {
    character: "Narin", editorialAria: "Character introduction", kicker: "Left on read. 12 minutes.", headline: ["The crown prince", "came undone."], intro: ["Perfectly cold before the world,", "shaken by a single reply from you."],
    messengerAria: "Narin character messenger", srTitle: "Narin, the crown prince who cannot stand being left on read", back: "Go back", profileView: "View Narin's profile", online: "Online now", language: "Change language", date: "Tonight · Left on read for 12 min",
    heroAlt: "Crown Prince Narin looking into the camera with blue-gray eyes", heroQuote: "“I was not waiting.”", heroPlace: "— Just now, the crown prince's chambers", majesty: "Your Majesty.", busy: "…You must be terribly busy.", oneReply: ["One reply would hardly", "bring the empire to ruin."], deleted: "A message was deleted", typo: "A typo. Nothing more.", read: "Read",
    doorAlt: "Narin waiting outside the emperor's chambers", detected: "ENTRY DETECTED", atDoor: "Someone is waiting outside.", reset: "Choose another reply ↺", quickAria: "Quick replies", yourReply: "YOUR REPLY",
    archiveTitle: ["The Narin", "only you know"], archiveDesc: "Eleven scenes, in the exact order of your first row.", swipe: "Swipe to explore · 01—11", listAria: "Narin image preview list", select: " image, select", large: " large preview", viewLarge: "View larger ↗",
    profileAlt: "Narin in imperial crown prince robes", backTalk: "Return to chat", crownPrince: "Crown Prince of Rattana", profileQuote: ["“Pretending not to care", "was never my talent.”"], age: "Age", height: "Height", blood: "Bloodline", bloodValue: "Siamese cat shifter", scent: "Scent", scentValue: "Peach · vanilla · sandalwood",
    everyone: "To everyone", coldPrince: ["Cold and proud", "the ice prince"], onlyYou: "Only to you", needyCat: ["Cannot bear silence", "a Siamese cat"], tags: ["#obsessive", "#tsundere", "#separationanxiety", "#courtromance", "#iceprince"], confession: ["“When Your Majesty turns away,", "dignity ceases to matter.”"], cta: "Meet Narin on WHIF",
    contactTitle: "Contact the creator", contactDesc: "Reach out by Instagram DM or email.", navAria: "Main navigation", talk: "Talk", moments: "Moments", profile: "Narin", close: "Close preview", prev: "Previous image", next: "Next image", dialog: "image preview",
  },
  ja: {
    character: "ナリン", editorialAria: "キャラクター紹介", kicker: "既読無視、12分目。", headline: ["皇太子が", "崩れ落ちた。"], intro: ["皆の前では氷のように完璧で、", "あなたの返信ひとつに揺らぐ人。"],
    messengerAria: "ナリン キャラクターメッセンジャー", srTitle: "既読無視に耐えられない皇太子ナリン", back: "戻る", profileView: "ナリンのプロフィールを見る", online: "オンライン", language: "言語を変更", date: "今夜 · 既読無視から12分",
    heroAlt: "青灰色の瞳でカメラを見つめる皇太子ナリン", heroQuote: "「待っていたわけではありません。」", heroPlace: "— たった今、皇太子の宮", majesty: "陛下。", busy: "…ずいぶん、お忙しいようですね。", oneReply: ["お返事のひとつで", "国が滅びるわけでもないでしょう。"], deleted: "メッセージを削除しました", typo: "誤字です。ただのミスです。", read: "既読",
    doorAlt: "皇帝の宮の前で待つナリン", detected: "玄関で感知", atDoor: "誰かが扉の前にいます。", reset: "別の返信を選ぶ ↺", quickAria: "クイック返信", yourReply: "陛下の返信",
    archiveTitle: ["あなただけが知る", "ナリンの瞬間"], archiveDesc: "スクリーンショットの一列目と同じ順番、11の場面。", swipe: "横にスワイプ · 01—11", listAria: "ナリン画像プレビュー一覧", select: "番の画像を選択", large: "を拡大表示", viewLarge: "大きく見る ↗",
    profileAlt: "皇太子の礼服を纏ったナリン", backTalk: "トークに戻る", crownPrince: "ラタナ帝国 皇太子", profileQuote: ["「興味のないふりをする才能は、", "私にはありません。」"], age: "年齢", height: "身長", blood: "血統", bloodValue: "シャム猫の獣人", scent: "香り", scentValue: "桃 · バニラ · 白檀",
    everyone: "すべての人に", coldPrince: ["冷たく傲慢な", "氷の皇太子"], onlyYou: "あなただけに", needyCat: ["既読無視に弱い", "シャム猫"], tags: ["#執着", "#ツンデレ", "#分離不安", "#宮廷ロマンス", "#氷の皇子"], confession: ["「陛下が背を向けるなら、体面など", "どうでもよいのです。」"], cta: "WHIFでナリンに会う",
    contactTitle: "作者に連絡する", contactDesc: "InstagramのDMまたはメールでご連絡ください。", navAria: "メインメニュー", talk: "トーク", moments: "瞬間", profile: "ナリン", close: "プレビューを閉じる", prev: "前の画像", next: "次の画像", dialog: "画像プレビュー",
  },
} as const;

const replies = {
  ko: [
    ["보고 싶었다", "보고 싶었다, 나린.", "…그런 말씀을 먼저 하시면, 제가 화낼 명분이 없어지지 않습니까."],
    ["지금 문 앞이냐", "설마 지금 처소 앞이냐?", "아닙니다. 지나가던 길이었습니다. …문은 언제 열어주실 겁니까."],
    ["귀 만져도 돼?", "들어오면 귀, 만져도 되느냐.", "이번만입니다. 싫은 건 아니지만… 다음도 허락한다는 뜻은 아닙니다."],
  ],
  en: [
    ["I missed you", "I missed you, Narin.", "…If you say that first, how am I supposed to stay angry?"],
    ["Are you outside?", "You are not outside my chambers, are you?", "No. I happened to be passing by. …When will you open the door?"],
    ["May I touch your ears?", "Come in. May I touch your ears?", "Only this once. I do not dislike it… but that is not permission for next time."],
  ],
  ja: [
    ["会いたかった", "会いたかった、ナリン。", "…先にそんなことを言われたら、私が怒る理由がなくなるではありませんか。"],
    ["今、扉の前？", "まさか今、私の宮の前にいるのか？", "違います。通りかかっただけです。…いつ扉を開けてくださるのですか。"],
    ["耳に触れてもいい？", "入ってきたら、耳に触れてもよいか？", "今回だけです。嫌ではありませんが…次も許すという意味ではありません。"],
  ],
} as const;

const momentSources = Array.from({ length: 11 }, (_, index) => `/images/moment-${String(index + 1).padStart(2, "0")}.jpg`);
const momentText = {
  ko: [["허락한 건 아닙니다", "귀를 쓰다듬은 순간 · A"], ["이번만입니다", "귀를 쓰다듬은 순간 · B"], ["소매를 놓지 못한 밤", "돌아서는 당신을 붙잡고"], ["무릎 위의 샴고양이", "완전 수인화 이후"], ["기다린 것이 아닙니다", "처소 앞에서 들킨 밤"], ["혼인 칙서", "표정은 평온하게, 질투는 선명하게"], ["읽음 12분 후", "황태자의 체면이 무너지기 시작했다"], ["처소 앞, 자시", "지나가던 길이라는 변명"], ["들켜버린 진심", "차마 감추지 못한 표정"], ["사랑을 말하는 밤", "당신에게만 보여주는 얼굴"], ["질투는 품위 있게", "차가운 시선, 뜨거운 속마음"]],
  en: [["Not permission", "The moment you touched his ears · A"], ["Only this once", "The moment you touched his ears · B"], ["The sleeve he could not release", "Catching you as you turned away"], ["A Siamese cat on your lap", "After his full transformation"], ["I was not waiting", "Caught outside your chambers"], ["The marriage edict", "A calm face, unmistakable jealousy"], ["Twelve minutes after Read", "A crown prince begins to unravel"], ["Outside your door, midnight", "He was merely passing by"], ["A heart exposed", "The expression he could not hide"], ["The night he spoke of love", "A face reserved only for you"], ["Jealousy, with dignity", "A cold gaze and a burning heart"]],
  ja: [["許したわけではありません", "耳を撫でた瞬間 · A"], ["今回だけです", "耳を撫でた瞬間 · B"], ["袖を離せなかった夜", "背を向けるあなたを引き止めて"], ["膝の上のシャム猫", "完全獣人化のあと"], ["待っていたわけではありません", "宮の前で見つかった夜"], ["婚姻の勅書", "穏やかな顔、鮮明な嫉妬"], ["既読から12分", "皇太子の体面が崩れ始めた"], ["宮の前、深夜", "通りかかっただけという言い訳"], ["露わになった本心", "隠しきれなかった表情"], ["愛を語る夜", "あなただけに見せる顔"], ["嫉妬も気高く", "冷たい視線、熱い本心"]],
} as const;

function detectLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const code = language.toLowerCase().split("-")[0];
    if (code === "ko" || code === "en" || code === "ja") return code;
  }
  return "en";
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("talk");
  const [locale, setLocale] = useState<Locale>("ko");
  const [reply, setReply] = useState<number | null>(null);
  const [selectedMoment, setSelectedMoment] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const c = ui[locale];
  const messages = replies[locale];
  const moments = momentText[locale].map(([title, note], index) => ({ src: momentSources[index], title, note }));

  useEffect(() => {
    const detected = detectLocale();
    setLocale(detected);
    document.documentElement.lang = detected;
  }, []);

  useEffect(() => { screenRef.current?.scrollTo({ top: 0 }); }, [tab]);

  useEffect(() => {
    if (preview === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
      if (event.key === "ArrowLeft") setPreview((current) => current === null ? null : (current - 1 + momentSources.length) % momentSources.length);
      if (event.key === "ArrowRight") setPreview((current) => current === null ? null : (current + 1) % momentSources.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [preview]);

  const cycleLocale = () => {
    const next = localeOrder[(localeOrder.indexOf(locale) + 1) % localeOrder.length];
    setLocale(next);
    setReply(null);
    document.documentElement.lang = next;
  };

  return (
    <main className={`site-shell lang-${locale}`}>
      <section className="editorial" aria-label={c.editorialAria}>
        <div className="eyebrow"><span>WHIF ORIGINAL</span><span>01</span></div>
        <div className="editorial-copy"><p className="kicker">{c.kicker}</p><h1>{c.headline[0]}<br />{c.headline[1]}</h1><p className="intro">{c.intro[0]}<br />{c.intro[1]}</p></div>
        <div className="name-lockup"><span>NARIN</span><strong>{c.character}</strong><em>RATANA CROWN PRINCE</em></div>
      </section>

      <section className="device" aria-label={c.messengerAria}>
        <h1 className="sr-only">{c.srTitle}</h1>
        <div className="status-bar" aria-hidden="true"><span>9:41</span><span className="dynamic-island" /><span>● ᴡɪғɪ ▰</span></div>
        <header className="chat-header">
          <button className="icon-button" aria-label={c.back}>‹</button>
          <button className="profile-mini" onClick={() => setTab("profile")} aria-label={c.profileView}><img src="/images/hyeon-profile-animated.gif" alt="" /><span><strong>{c.character}</strong><small><i /> {c.online}</small></span></button>
          <button className="icon-button language-button" onClick={cycleLocale} aria-label={`${c.language}: ${localeBadge[locale]}`}>{localeBadge[locale]}</button>
        </header>

        <div className="screen" ref={screenRef} aria-live="polite">
          {tab === "talk" && <div className="talk-panel">
            <div className="date-chip">{c.date}</div>
            <article className="hero-card"><img src="/images/left-on-read.jpg" alt={c.heroAlt} /><div className="hero-shade" /><div className="hero-caption"><span className="live-pill">● LIVE</span><p>{c.heroQuote}</p><small>{c.heroPlace}</small></div></article>
            <div className="message-row"><img src="/images/hyeon-profile.png" alt="" /><div><span className="sender">{c.character}</span><p className="bubble incoming">{c.majesty}</p><p className="bubble incoming">{c.busy}</p></div></div>
            <div className="message-row compact"><span className="avatar-space" /><div><p className="bubble incoming">{c.oneReply[0]}<br />{c.oneReply[1]}</p><small className="typing-note">{c.deleted}</small></div></div>
            <div className="message-row compact"><span className="avatar-space" /><div><p className="bubble incoming thai">ขอโทษ</p><small className="bubble-note">{c.typo}</small></div></div>
            {reply !== null ? <div className="reply-scene">
              <p className="bubble outgoing">{messages[reply][1]}</p><small className="read">{c.read}</small>
              <div className="message-row"><img src="/images/hyeon-profile.png" alt="" /><div><span className="sender">{c.character}</span><p className="bubble incoming answer">{messages[reply][2]}</p></div></div>
              <figure className="door-card"><img src="/images/waiting-outside.jpg" alt={c.doorAlt} /><figcaption><span>{c.detected}</span><strong>{c.atDoor}</strong></figcaption></figure>
              <button className="reset-choice" onClick={() => setReply(null)}>{c.reset}</button>
            </div> : <div className="quick-replies" aria-label={c.quickAria}><span>{c.yourReply}</span>{messages.map((item, index) => <button key={item[0]} onClick={() => setReply(index)}>{item[0]}<b>↗</b></button>)}</div>}
          </div>}

          {tab === "moments" && <div className="moments-panel">
            <div className="panel-title"><span>PRIVATE ARCHIVE</span><h2>{c.archiveTitle[0]}<br />{c.archiveTitle[1]}</h2><p>{c.archiveDesc}</p></div>
            <div className="archive-label"><span>SCREENSHOT ORDER</span><small>{c.swipe}</small></div>
            <div className="archive-row" aria-label={c.listAria}>{moments.map((item, index) => <button key={item.src} className={selectedMoment === index ? "selected" : ""} onClick={() => setSelectedMoment(index)} aria-label={`${index + 1}${c.select}: ${item.title}`}><img src={item.src} alt="" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>
            <button className="archive-preview" onClick={() => setPreview(selectedMoment)} aria-label={`${moments[selectedMoment].title}${c.large}`}><img src={moments[selectedMoment].src} alt={moments[selectedMoment].title} /><span className="preview-index">{String(selectedMoment + 1).padStart(2, "0")} / 11</span><span className="preview-copy"><small>{moments[selectedMoment].note}</small><strong>{moments[selectedMoment].title}</strong><em>{c.viewLarge}</em></span></button>
          </div>}

          {tab === "profile" && <div className="profile-panel">
            <div className="profile-visual"><img src="/images/confession.jpg" alt={c.profileAlt} /><button onClick={() => setTab("talk")} aria-label={c.backTalk}>×</button><div><span>{c.crownPrince}</span><h2>{c.character} <em>NARIN</em></h2><p>{c.profileQuote[0]}<br />{c.profileQuote[1]}</p></div></div>
            <dl className="facts"><div><dt>{c.age}</dt><dd>28</dd></div><div><dt>{c.height}</dt><dd>186<small>cm</small></dd></div><div><dt>{c.blood}</dt><dd>{c.bloodValue}</dd></div><div><dt>{c.scent}</dt><dd>{c.scentValue}</dd></div></dl>
            <section className="duality"><span className="section-label">HIS DUALITY</span><div><article><small>{c.everyone}</small><strong>{c.coldPrince[0]}<br />{c.coldPrince[1]}</strong></article><i>×</i><article><small>{c.onlyYou}</small><strong>{c.needyCat[0]}<br />{c.needyCat[1]}</strong></article></div></section>
            <div className="tags">{c.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <blockquote>{c.confession[0]}<br />{c.confession[1]}</blockquote>
            <a className="cta" href="https://www.whif.io/characters/create" target="_blank" rel="noreferrer">{c.cta} <span>↗</span></a>
            <section className="creator-contact" aria-labelledby="creator-contact-title"><span>CREATOR CONTACT</span><h3 id="creator-contact-title">{c.contactTitle}</h3><p>{c.contactDesc}</p><div><a href="https://www.instagram.com/suji.n_creating/" target="_blank" rel="noreferrer"><small>Instagram DM</small><strong>@suji.n_creating</strong><em>↗</em></a><a href="mailto:su.jin.developer@gmail.com"><small>Email</small><strong>su.jin.developer@gmail.com</strong><em>↗</em></a></div></section>
            <p className="font-credit">SUIT · Gowun Batang / Font source: Noonnu</p>
          </div>}
        </div>

        <nav className="tab-bar" aria-label={c.navAria}><button className={tab === "talk" ? "active" : ""} onClick={() => setTab("talk")}><i className="chat-icon" /><span>{c.talk}</span></button><button className={tab === "moments" ? "active" : ""} onClick={() => setTab("moments")}><i className="moment-icon" /><span>{c.moments}</span></button><button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}><i className="person-icon" /><span>{c.profile}</span></button></nav>
        <div className="home-indicator" aria-hidden="true" />
        {preview !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${moments[preview].title} ${c.dialog}`} onClick={() => setPreview(null)}><button className="lightbox-close" onClick={() => setPreview(null)} aria-label={c.close}>×</button><button className="lightbox-arrow prev" onClick={(event) => { event.stopPropagation(); setPreview((preview - 1 + moments.length) % moments.length); }} aria-label={c.prev}>‹</button><figure onClick={(event) => event.stopPropagation()}><img src={moments[preview].src} alt={moments[preview].title} /><figcaption><span>{String(preview + 1).padStart(2, "0")} / 11</span><strong>{moments[preview].title}</strong><small>{moments[preview].note}</small></figcaption></figure><button className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); setPreview((preview + 1) % moments.length); }} aria-label={c.next}>›</button></div>}
      </section>
    </main>
  );
}
