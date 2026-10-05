import reiEat from "@/assets/characters/rei-eat.webp.asset.json";
import reiHappy from "@/assets/characters/rei-happy.webp.asset.json";
import reiListen from "@/assets/characters/rei-listen.webp.asset.json";
import reiNails from "@/assets/characters/rei-nails.webp.asset.json";
import reiSad from "@/assets/characters/rei-sad.webp.asset.json";
import reiSing from "@/assets/characters/rei-sing.webp.asset.json";
import reiTalk from "@/assets/characters/rei-talk.webp.asset.json";
import reiWait from "@/assets/characters/rei-wait.webp.asset.json";
import yuniEat from "@/assets/characters/yuni-eat.webp.asset.json";
import yuniHappy from "@/assets/characters/yuni-happy.webp.asset.json";
import yuniListen from "@/assets/characters/yuni-listen.webp.asset.json";
import yuniNails from "@/assets/characters/yuni-nails.webp.asset.json";
import yuniSad from "@/assets/characters/yuni-sad.webp.asset.json";
import yuniSing from "@/assets/characters/yuni-sing.webp.asset.json";
import yuniTalk from "@/assets/characters/yuni-talk.webp.asset.json";
import yuniWait from "@/assets/characters/yuni-wait.webp.asset.json";

export type Teacher = "yuni" | "rei";
export type Mood = "wait" | "talk" | "listen" | "happy" | "sad" | "sing" | "eat" | "nails";

export const characterImages: Record<Teacher, Record<Mood, string>> = {
  yuni: {
    wait: yuniWait.url, talk: yuniTalk.url, listen: yuniListen.url, happy: yuniHappy.url,
    sad: yuniSad.url, sing: yuniSing.url, eat: yuniEat.url, nails: yuniNails.url,
  },
  rei: {
    wait: reiWait.url, talk: reiTalk.url, listen: reiListen.url, happy: reiHappy.url,
    sad: reiSad.url, sing: reiSing.url, eat: reiEat.url, nails: reiNails.url,
  },
};