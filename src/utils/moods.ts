import type { Mood } from "../types";

export interface MoodOption {
  value: Mood;
  label: string;
  emoji: string;
}

export interface MoodGroup {
  title: string;
  options: MoodOption[];
}

export const commonMoods: MoodOption[] = [
  { value: "calm", label: "平静", emoji: "😌" },
  { value: "happy", label: "开心", emoji: "😄" },
  { value: "tired", label: "疲惫", emoji: "😴" },
  { value: "anxious", label: "焦虑", emoji: "😰" },
  { value: "grateful", label: "感激", emoji: "🥲" },
  { value: "ordinary", label: "普通", emoji: "🙂" }
];

export const moodGroups: MoodGroup[] = [
  {
    title: "笑脸",
    options: [
      { value: "face-grin", label: "嘿嘿", emoji: "😀" },
      { value: "face-smiley", label: "哈哈", emoji: "😃" },
      { value: "face-smile", label: "大笑", emoji: "😄" },
      { value: "face-beam", label: "嘻嘻", emoji: "😁" },
      { value: "face-squint", label: "斜眼笑", emoji: "😆" },
      { value: "face-sweat", label: "苦笑", emoji: "😅" },
      { value: "face-rofl", label: "笑得满地打滚", emoji: "🤣" },
      { value: "face-joy", label: "笑哭了", emoji: "😂" },
      { value: "face-slight", label: "呵呵", emoji: "🙂" },
      { value: "face-upside", label: "倒脸", emoji: "🙃" },
      { value: "face-melting", label: "融化", emoji: "🫠" },
      { value: "face-wink", label: "眨眼", emoji: "😉" },
      { value: "face-blush", label: "羞涩微笑", emoji: "😊" },
      { value: "face-halo", label: "微笑天使", emoji: "😇" }
    ]
  },
  {
    title: "喜欢",
    options: [
      { value: "face-hearts", label: "喜笑颜开", emoji: "🥰" },
      { value: "face-heart-eyes", label: "花痴", emoji: "😍" },
      { value: "face-star", label: "好崇拜哦", emoji: "🤩" },
      { value: "face-kiss", label: "飞吻", emoji: "😘" },
      { value: "face-kissing", label: "亲亲", emoji: "😗" },
      { value: "face-relaxed", label: "微笑", emoji: "☺️" },
      { value: "face-kiss-closed", label: "羞涩亲亲", emoji: "😚" },
      { value: "face-kiss-smile", label: "微笑亲亲", emoji: "😙" },
      { value: "face-tear-smile", label: "含泪的笑脸", emoji: "🥲" }
    ]
  },
  {
    title: "调皮",
    options: [
      { value: "face-yum", label: "好吃", emoji: "😋" },
      { value: "face-tongue", label: "吐舌", emoji: "😛" },
      { value: "face-wink-tongue", label: "单眼吐舌", emoji: "😜" },
      { value: "face-zany", label: "滑稽", emoji: "🤪" },
      { value: "face-squint-tongue", label: "眯眼吐舌", emoji: "😝" },
      { value: "face-money", label: "发财", emoji: "🤑" }
    ]
  },
  {
    title: "手势",
    options: [
      { value: "face-hug", label: "抱抱", emoji: "🤗" },
      { value: "face-hand-mouth", label: "不说", emoji: "🤭" },
      { value: "face-open-hand-mouth", label: "睁眼捂嘴", emoji: "🫢" },
      { value: "face-peek", label: "偷看", emoji: "🫣" },
      { value: "face-shush", label: "安静", emoji: "🤫" },
      { value: "face-thinking", label: "想一想", emoji: "🤔" },
      { value: "face-salute", label: "致敬", emoji: "🫡" }
    ]
  },
  {
    title: "无语",
    options: [
      { value: "face-zipper", label: "闭嘴", emoji: "🤐" },
      { value: "face-raised-brow", label: "挑眉", emoji: "🤨" },
      { value: "face-neutral", label: "冷漠", emoji: "😐" },
      { value: "face-expressionless", label: "无语", emoji: "😑" },
      { value: "face-no-mouth", label: "沉默", emoji: "😶" },
      { value: "face-dotted", label: "虚线脸", emoji: "🫥" },
      { value: "face-clouds", label: "迷茫", emoji: "😶‍🌫️" },
      { value: "face-smirk", label: "得意", emoji: "😏" },
      { value: "face-unamused", label: "不高兴", emoji: "😒" },
      { value: "face-eye-roll", label: "翻白眼", emoji: "🙄" },
      { value: "face-grimace", label: "龇牙咧嘴", emoji: "😬" },
      { value: "face-exhale", label: "呼气", emoji: "😮‍💨" },
      { value: "face-lying", label: "说谎", emoji: "🤥" }
    ]
  },
  {
    title: "困倦",
    options: [
      { value: "face-relieved", label: "松了口气", emoji: "😌" },
      { value: "face-pensive", label: "沉思", emoji: "😔" },
      { value: "face-sleepy", label: "困", emoji: "😪" },
      { value: "face-drool", label: "流口水", emoji: "🤤" },
      { value: "face-sleeping", label: "睡着了", emoji: "😴" }
    ]
  },
  {
    title: "不舒服",
    options: [
      { value: "face-mask", label: "感冒", emoji: "😷" },
      { value: "face-thermometer", label: "发烧", emoji: "🤒" },
      { value: "face-bandage", label: "受伤", emoji: "🤕" },
      { value: "face-nauseated", label: "恶心", emoji: "🤢" },
      { value: "face-vomit", label: "呕吐", emoji: "🤮" },
      { value: "face-sneeze", label: "打喷嚏", emoji: "🤧" },
      { value: "face-hot", label: "脸发烧", emoji: "🥵" },
      { value: "face-cold", label: "冷脸", emoji: "🥶" },
      { value: "face-woozy", label: "头昏眼花", emoji: "🥴" },
      { value: "face-dizzy", label: "晕头转向", emoji: "😵" },
      { value: "face-spiral", label: "晕", emoji: "😵‍💫" },
      { value: "face-exploding", label: "爆炸头", emoji: "🤯" }
    ]
  },
  {
    title: "装扮",
    options: [
      { value: "face-cowboy", label: "牛仔帽脸", emoji: "🤠" },
      { value: "face-party", label: "聚会笑脸", emoji: "🥳" },
      { value: "face-disguise", label: "伪装的脸", emoji: "🥸" },
      { value: "face-cool", label: "墨镜笑脸", emoji: "😎" },
      { value: "face-nerd", label: "书呆子脸", emoji: "🤓" },
      { value: "face-monocle", label: "单片眼镜", emoji: "🧐" }
    ]
  },
  {
    title: "担心",
    options: [
      { value: "face-confused", label: "困扰", emoji: "😕" },
      { value: "face-diagonal", label: "郁闷", emoji: "🫤" },
      { value: "face-worried", label: "担心", emoji: "😟" },
      { value: "face-slight-frown", label: "微微不满", emoji: "🙁" },
      { value: "face-frown", label: "不满", emoji: "☹️" },
      { value: "face-open-mouth", label: "吃惊", emoji: "😮" },
      { value: "face-hushed", label: "缄默", emoji: "😯" },
      { value: "face-astonished", label: "震惊", emoji: "😲" },
      { value: "face-flushed", label: "脸红", emoji: "😳" },
      { value: "face-pleading", label: "恳求", emoji: "🥺" },
      { value: "face-holding-tears", label: "忍住泪水", emoji: "🥹" },
      { value: "face-frowning-open", label: "啊", emoji: "😦" },
      { value: "face-anguished", label: "极度痛苦", emoji: "😧" },
      { value: "face-fearful", label: "害怕", emoji: "😨" },
      { value: "face-cold-sweat", label: "冷汗", emoji: "😰" },
      { value: "face-sad-relieved", label: "失望但如释重负", emoji: "😥" },
      { value: "face-cry", label: "哭", emoji: "😢" },
      { value: "face-sob", label: "放声大哭", emoji: "😭" },
      { value: "face-scream", label: "吓死了", emoji: "😱" },
      { value: "face-confounded", label: "困惑", emoji: "😖" },
      { value: "face-persevere", label: "痛苦", emoji: "😣" },
      { value: "face-disappointed", label: "失望", emoji: "😞" },
      { value: "face-down-sweat", label: "汗", emoji: "😓" },
      { value: "face-weary", label: "累死了", emoji: "😩" },
      { value: "face-tired", label: "累", emoji: "😫" },
      { value: "face-yawn", label: "打呵欠", emoji: "🥱" }
    ]
  },
  {
    title: "负面",
    options: [
      { value: "face-triumph", label: "傲慢", emoji: "😤" },
      { value: "face-rage", label: "怒火中烧", emoji: "😡" },
      { value: "face-angry", label: "生气", emoji: "😠" },
      { value: "face-symbols", label: "气到说不出", emoji: "🤬" },
      { value: "face-imp-smile", label: "恶魔微笑", emoji: "😈" },
      { value: "face-imp-angry", label: "生气的恶魔", emoji: "👿" },
      { value: "face-skull", label: "头骨", emoji: "💀" },
      { value: "face-crossbones", label: "骷髅", emoji: "☠️" }
    ]
  },
  {
    title: "其他表情",
    options: [
      { value: "face-poop", label: "大便", emoji: "💩" },
      { value: "face-clown", label: "小丑脸", emoji: "🤡" },
      { value: "face-ogre", label: "食人魔", emoji: "👹" },
      { value: "face-goblin", label: "小妖精", emoji: "👺" },
      { value: "face-ghost", label: "鬼", emoji: "👻" },
      { value: "face-alien", label: "外星人", emoji: "👽" },
      { value: "face-monster", label: "外星怪物", emoji: "👾" },
      { value: "face-robot", label: "机器人", emoji: "🤖" }
    ]
  },
  {
    title: "猫咪脸",
    options: [
      { value: "cat-grin", label: "大笑的猫", emoji: "😺" },
      { value: "cat-smile", label: "微笑的猫", emoji: "😸" },
      { value: "cat-joy", label: "笑出眼泪的猫", emoji: "😹" },
      { value: "cat-heart", label: "花痴的猫", emoji: "😻" },
      { value: "cat-smirk", label: "奸笑的猫", emoji: "😼" },
      { value: "cat-kiss", label: "亲亲猫", emoji: "😽" },
      { value: "cat-weary", label: "疲倦的猫", emoji: "🙀" },
      { value: "cat-cry", label: "哭泣的猫", emoji: "😿" },
      { value: "cat-angry", label: "生气的猫", emoji: "😾" }
    ]
  },
  {
    title: "猴子脸",
    options: [
      { value: "monkey-see", label: "非礼勿视", emoji: "🙈" },
      { value: "monkey-hear", label: "非礼勿听", emoji: "🙉" },
      { value: "monkey-speak", label: "非礼勿言", emoji: "🙊" }
    ]
  }
];

export const allMoodOptions = [
  ...commonMoods,
  ...moodGroups.flatMap((group) => group.options)
];

export function getMoodText(mood: Mood): string {
  const item = allMoodOptions.find((candidate) => candidate.value === mood);
  return item ? `${item.emoji} ${item.label}` : mood;
}
