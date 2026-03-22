export type Character = {
  id: string;
  name: string;
  baseImageUrl: string;
  previewImageUrl?: string;
};

export type ItemAsset = {
  id: string;
  name: string;
  imageUrl: string;
};

/** 캐릭터 6명: public/assets/characters/1.png ~ 6.png */
export const CHARACTERS: Character[] = [
  { id: "1", name: "뀬둥이", baseImageUrl: "/assets/characters/1.png", previewImageUrl: "/assets/characters/1.png" },
  { id: "2", name: "와릴라", baseImageUrl: "/assets/characters/2.png", previewImageUrl: "/assets/characters/2.png" },
  { id: "3", name: "유짱", baseImageUrl: "/assets/characters/3.png", previewImageUrl: "/assets/characters/3.png" },
  { id: "4", name: "노얌이", baseImageUrl: "/assets/characters/4.png", previewImageUrl: "/assets/characters/4.png" },
  { id: "5", name: "쭌복이", baseImageUrl: "/assets/characters/5.png", previewImageUrl: "/assets/characters/5.png" },
  { id: "6", name: "티오니", baseImageUrl: "/assets/characters/6.png", previewImageUrl: "/assets/characters/6.png" },
];

/** 아이템 25개: public/assets/item/ (실제 파일명과 동일) */
export const ITEMS: ItemAsset[] = [
  { id: "7", name: "아이템 7", imageUrl: "/assets/item/7.png" },
  { id: "8", name: "아이템 8", imageUrl: "/assets/item/8.png" },
  { id: "9", name: "아이템 9", imageUrl: "/assets/item/9.png" },
  { id: "10", name: "아이템 10", imageUrl: "/assets/item/10.png" },
  { id: "11", name: "아이템 11", imageUrl: "/assets/item/11.png" },
  { id: "12", name: "아이템 12", imageUrl: "/assets/item/12.png" },
  { id: "13", name: "아이템 13", imageUrl: "/assets/item/13.png" },
  { id: "14", name: "아이템 14", imageUrl: "/assets/item/14.png" },
  { id: "15", name: "아이템 15", imageUrl: "/assets/item/15.png" },
  { id: "16", name: "아이템 16", imageUrl: "/assets/item/16.png" },
  { id: "17", name: "아이템 17", imageUrl: "/assets/item/17.png" },
  { id: "18", name: "아이템 18", imageUrl: "/assets/item/18.png" },
  { id: "19", name: "아이템 19", imageUrl: "/assets/item/19.png" },
  { id: "20", name: "아이템 20", imageUrl: "/assets/item/20.png" },
  { id: "21", name: "아이템 21", imageUrl: "/assets/item/21.png" },
  { id: "flower", name: "flower", imageUrl: "/assets/item/flower.png" },
  { id: "green", name: "green", imageUrl: "/assets/item/green.png" },
  { id: "mozice", name: "mozice", imageUrl: "/assets/item/mozice.png" },
  { id: "ring", name: "ring", imageUrl: "/assets/item/ring.png" },
  { id: "roll", name: "roll", imageUrl: "/assets/item/roll.png" },
  { id: "santa", name: "santa", imageUrl: "/assets/item/santa.png" },
  { id: "single", name: "single", imageUrl: "/assets/item/single.png" },
  { id: "sunglass", name: "sunglass", imageUrl: "/assets/item/sunglass.png" },
  { id: "weck", name: "weck", imageUrl: "/assets/item/weck.png" },
  { id: "yellow", name: "yellow", imageUrl: "/assets/item/yellow.png" },
];

export const OUTFITS = ITEMS;
