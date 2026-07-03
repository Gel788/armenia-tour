#!/usr/bin/env python3
"""Сборка tour.ts: тексты/фото из PDF + 4-дневная программа."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ROOT / "src/data/tour.generated.json"

def main():
    with open(GENERATED, encoding="utf-8") as f:
        pdf = {s["id"]: s for s in json.load(f)}

    def loc(id_: str):
        return pdf[id_]

    sections = [
        {
            **pdf["hero"],
            "subtitle": "4 дня в сердце гор",
            "body": "Проведи незабываемые дни в гостеприимной Армении, которые ты запомнишь на всю оставшуюся жизнь. От ущелий до альпийских лугов, от лаваша в тонире до домашнего вина и коньяка.",
        },
        {
            "id": "program-intro",
            "type": "program-intro",
            "title": "Программа тура",
            "body": "Армения — страна древних монастырей, горных хребтов и кулинарных традиций, которые передаются из поколения в поколение. Тур, где каждый день — новая глава.",
            "image": "/images/photos/page02_01.jpeg",
        },
        {
            "id": "day-1",
            "type": "day-intro",
            "day": 1,
            "tag": "День 1",
            "title": "Ереван — город-легенда",
            "lead": "Заселение в отель в центре. Прогулка по Каскаду с видом на Арарат, колоритные улочки проспекта Маштоца.",
            "body": "",
            "image": "/images/photos/page02_01.jpeg",
            "highlights": [{
                "kind": "evening",
                "title": "Вечер в аутентичном ресторане",
                "description": "Ужин с живой музыкой. Дегустация хороваца, лаваша из тонира, толмы, бастурмы, суджука, домашних сыров и легендарного коньяка.",
            }],
        },
        {
            "id": "day-2",
            "type": "day-intro",
            "day": 2,
            "tag": "День 2",
            "title": "Ущелья и древние монастыри",
            "subtitle": "Хневанк · Аревацаг · Оромайр",
            "lead": "Джип-тур в Лорийскую область.",
            "body": pdf["day-1"]["body"],
            "image": pdf["khnevank"]["image"],
            "stops": [
                {"title": "Хневанк (VII в.)", "description": "Монастырь, вросший в скалу над рекой Дзорагет."},
                {"title": "Ущелье Аревацаг и скала Цицкар", "description": "Живописные виды и офф-роуд к скале Цицкар."},
                {"title": "Оромайр", "description": "«Монастырь на краю ущелья»: пешая прогулка ~5 км вдоль Дебета."},
            ],
            "highlights": [
                {"kind": "meal", "title": "Обед-пикник «маадуно»", "description": "Домашний сыр, лаваш, травы, мёд, тари и домашнее вино."},
                {"kind": "stay", "title": "Горный отель", "description": "Ночлег под звёздами — тишина, панорама и ужин с видом на хребты."},
            ],
        },
        {**loc("oromair"), "day": 2},
        {**loc("khnevank"), "day": 2},
        {**loc("arevatsag"), "day": 2},
        {
            "id": "day-3",
            "type": "day-intro",
            "day": 3,
            "tag": "День 3",
            "title": "Дилижан — «Маленькая Швейцария»",
            "subtitle": "Гора Димац · конная прогулка · вилла",
            "lead": "Переезд в Дилижанский национальный парк.",
            "body": pdf["day-2"]["body"],
            "image": pdf["dilijan"]["image"],
            "stops": [
                {"title": "Старый город Дилижан (XVII в.)", "description": "Резные балконы и каменные улочки."},
                {"title": "Гора Димац (2378 м)", "description": "Виды на Иджеванские горы и облачная дымка."},
                {"title": "Конная прогулка", "description": "Леса и луга парка с инструкторами и дрон-съёмкой."},
            ],
            "highlights": [
                {"kind": "stay", "title": "Вилла в Дилиджане", "description": "Бассейн, сауна, кинотеатр — ночёвка на сутки."},
                {"kind": "evening", "title": "Живая кухня", "description": "Ужин по семейным рецептам с организаторами."},
            ],
        },
        {**loc("dilijan"), "day": 3},
        {**loc("dimats"), "day": 3},
        {
            "id": "day-4",
            "type": "day-intro",
            "day": 4,
            "tag": "День 4",
            "title": "Севан, Гарни, Гегард — финал",
            "subtitle": "Жемчужины Армении",
            "lead": "Утром завтрак на вилле и выезд.",
            "body": pdf["day-3"]["body"],
            "image": pdf["sevan"]["image"],
            "stops": [
                {"title": "Озеро Севан", "description": "«Жемчужина» на 1900 м и Севанаванк."},
                {"title": "Гарни", "description": "Единственный языческий храм Армении."},
                {"title": "Мастер-класс по лавашу", "description": "Выпечка главного хлеба Армении в тонире."},
                {"title": "Симфония камней", "description": "Базальтовые столбы до 50 м."},
                {"title": "Гегард (XII–XIII вв.)", "description": "Монастырь в скале — объект ЮНЕСКО."},
                {"title": "Азатское водохранилище", "description": "Отражение гор в воде — лучшие кадры тура."},
            ],
            "highlights": [{
                "kind": "meal",
                "title": "Обед с форелью у Севана",
                "description": "Свежая рыба и вид на высокогорное озеро.",
            }],
        },
        {**loc("sevan"), "day": 4},
        {**loc("garni"), "day": 4},
        {**loc("geghard"), "day": 4},
        {**loc("azat"), "day": 4},
        {
            **pdf["pricing"],
            "title": "Что включено",
            "body": "Всё для комфортного путешествия — от ночлега до дрона и мастер-класса по лавашу.",
            "image": "/images/photos/page01_02.jpeg",
        },
        {
            "id": "outro",
            "type": "outro",
            "title": "4 дня, после которых",
            "subtitle": "Армения останется с вами",
            "body": "Страна древних монастырей и горных хребтов останется с вами навсегда. Готовы отправиться?",
            "image": pdf["outro"]["image"],
        },
    ]

    out = ROOT / "src/data/tour.merged.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(sections, f, ensure_ascii=False, indent=2)
    print(f"Wrote {out} ({len(sections)} sections)")

if __name__ == "__main__":
    main()
