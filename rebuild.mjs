import fs from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const KEY = process.argv[2];
const pins = Object.fromEntries(JSON.parse(fs.readFileSync("korea-pins.json", "utf8")).pins.map((p) => [p.name, p]));

// P(pinName, [search candidates], extra tip, start, end): a place from the user's list
const P = (pin, q, tip, start, end) => ({ pin, q, tip, start, end });
// E(name, [search candidates], note, start, end): an existing (non-list) place
const E = (name, q, note, start, end) => ({ name, q, note, start, end });

const days = [
  {
    date: "2026-10-12", heading: "Seoul: palaces, Samcheong & beauty day",
    remove: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Insa-dong", "Season of you", "Olive Young Myeongdong Town", "N Seoul Tower"],
    places: [
      E("Gyeongbokgung Palace", ["Gyeongbokgung Palace"], "Arrive at opening. Free entry if you wear a hanbok. Tickets are needed; book ahead or buy at the gate.", "09:30"),
      P("미라벨 - mirabelle seoul", ["Mirabelle Seoul Seochon", "미라벨 서울", "mirabelle seoul"], "Seochon, just west of the palace. Good for a coffee stop."),
      P("Baar Baar", ["Baar Baar Seoul Seochon", "Baar Baar Seoul", "Baar Baar"], "Seochon, next door to Mirabelle."),
      P("National Museum of Modern and Contemporary Art, Seoul", ["National Museum of Modern and Contemporary Art Seoul"], "Samcheong-dong, an easy walk from the palace."),
      P("Minjukim", ["Minjukim Seoul Samcheong", "Minjukim Seoul", "Minjukim"], "Samcheong-dong."),
      E("Bukchon Hanok Village", ["Bukchon Hanok Village"], "Short walk from the palace. Residential area, keep voices down."),
      E("Insa-dong", ["Insadong Seoul"], "Tea houses and craft shops. Good for an afternoon break."),
      E("Season of you Seoul Personal color Analysis Yongsan", ["Season of you Seoul Personal color Analysis Yongsan"], "Personal color analysis. Reserve ahead (Naver Booking, KakaoTalk or Instagram DM) and confirm English support and the price. Come with a bare face and a plain top. Usually about 1 hour.", "14:30", "15:30"),
      E("Olive Young Myeongdong Town", ["Olive Young Myeongdong Town"], "Ask about a skin analysis or consultation at the counter, or book a skincare session at a clinic or brand store nearby.", "16:30"),
      P("Philosophy Lounge", ["Philosophy Lounge Seoul", "Philosophy Lounge"], "Central Seoul, between Myeongdong and Namsan. Good for a drink before or after the tower."),
      E("N Seoul Tower", ["N Seoul Tower"], "Go around sunset. Cable car or a walk up Namsan. Close to Myeongdong.", "18:00"),
    ],
    note: "This day has more than you can do. The list pins are grouped by area so you can skip freely: Seochon and Samcheong in the morning (Mirabelle, Baar Baar, MMCA, Minjukim), Yongsan for the color test, Myeongdong for skincare, then Philosophy Lounge and the tower. Keep the beauty appointments and drop the rest as needed.",
  },
  {
    date: "2026-10-13", heading: "Yongsan, then KTX to Busan",
    remove: ["Seoul Station", "Busan", "Gwangalli Beach"],
    places: [
      P("Doori", ["Doori Yongsan Seoul", "Doori Seoul Samgakji", "Doori"], "Mom and pop owners. Yongsan, near the museum."),
      P("Via Toledo Pasta Bar", ["Via Toledo Pasta Bar Seoul", "Via Toledo Pasta Bar"], "Yongsan/Samgakji. Lunch spot; popular, so go early or book."),
      P("National Museum of Korea", ["National Museum of Korea"], "Ichon, Yongsan. Free entry; give it 1.5-2 hours."),
      E("Seoul Station", ["Seoul Station"], "Departure. Yongsan Station also has KTX to Busan, and is closer to the museum. Arrive 20-30 min early."),
      E("Busan Station", ["Busan Station Busan", "Busan railway station"], "Arrival. Subway line 1 to Bujeon or Seomyeon is about 10-15 min."),
      P("Bujeon Market", ["Bujeon Market Busan", "Bujeon Market"], "Evening market, easy first stop after the train."),
      P("파니에 panier", ["panier Bujeon Busan", "파니에 panier", "파니에"], "Small shop in the Bujeon/Seomyeon area."),
      P("ATHWART - 어쏘워트빈티지", ["ATHWART vintage Busan", "어쏘워트빈티지", "ATHWART"], "Vintage clothing, Bujeon/Seomyeon."),
      P("BRACKET TABLE", ["Bracket Table Busan", "BRACKET TABLE"], "Restaurant supply and kitchenware store, same area."),
      P("Mulmangcho", ["Mulmangcho Busan", "물망초 부산", "Mulmangcho"], "Wine and food, vintage Korean style. Good for dinner."),
    ],
    note: "Book a KTX around 1-3 pm so you have the morning for Yongsan (Doori, Via Toledo, National Museum of Korea) and still get to Busan in time for the Bujeon shops, which close around 8 pm. Hotel: check in at Wood House (Gwangalli) after dinner, or drop bags first if you prefer.",
  },
  {
    date: "2026-10-14", heading: "Busan: Gamcheon, Nampo & Yeongdo",
    remove: ["Haedong Yonggungsa Temple", "Haeundae Beach", "Haeundae Blueline Park - Mipo Station"],
    places: [
      E("Gamcheon Culture Village", ["Gamcheon Culture Village"], "Colorful hillside village. Wear comfortable shoes, lots of stairs.", "10:00"),
      P("Blue House on The Stairs", ["Blue House on The Stairs Busan", "Blue House on the Stairs", "블루하우스온더스테어즈"], "Coffee shop in the Gamcheon area; drinks come with a mini hot air balloon."),
      P("Jagalchi Market", ["Jagalchi Market Busan, South Korea", "Jagalchi Market"], "Fresh seafood upstairs. Pick from the tanks and they cook it for you."),
      P("Gukje Market", ["Gukje Market Busan", "Gukje Market", "국제시장"], "Ceramics."),
      P("Bosu Book Street", ["Bosu Book Street Busan", "Bosu Book Street", "보수동 책방골목"], "Old-town book alley, near Gukje Market."),
      P("MonsieurBubu Coffeestand", ["MonsieurBubu Coffeestand Busan", "Monsieur Bubu Coffee Stand", "MonsieurBubu"], "Coffee stop in Nampo."),
      E("BIFF Square", ["BIFF Square"], "Street food (ssiat hotteok) and a lively evening crowd."),
      P("Huinnyeoul Culture Village", ["Huinnyeoul Culture Village Yeongdo", "Huinnyeoul Culture Village", "흰여울문화마을"], "Yeongdo cliffside village, a calmer version of Gamcheon. Take a taxi from Nampo (about 15 min)."),
      P("나드리상점", ["나드리상점 영도", "Nadri Store Yeongdo", "나드리상점"], "Gift shop in Yeongdo, near Huinnyeoul."),
      P("ARTE MUSEUM Busan", ["ARTE Museum Busan", "아르떼뮤지엄 부산"], "Immersive digital art (teamLab-style). Book a timed ticket; good for the evening."),
    ],
    note: "Route: Gamcheon and Blue House in the morning, then Nampo (Jagalchi, Gukje Market, Bosu Book Street, MonsieurBubu, BIFF), then a taxi to Yeongdo (Huinnyeoul, Nadri), and ARTE Museum in the evening if you have energy. Seokbulsa (a mountain temple) is in the north and needs a taxi; treat it as optional.",
    extra: [P("Seokbulsa", ["Seokbulsa Busan", "Seokbulsa", "석불사"], "Optional: mountain temple in the north of Busan. Needs a taxi and some climbing.")],
  },
  {
    date: "2026-10-15", heading: "Busan: Haeundae & the east coast",
    remove: ["Gamcheon Culture Village", "Jagalchi Market", "BIFF Square"],
    places: [
      P("Standard Bread Haeundae", ["Standard Bread Haeundae", "스탠다드브레드 해운대"], "Popular bread, go early. Start here.", "08:30"),
      E("Haedong Yonggungsa Temple", ["Haedong Yonggungsa Temple"], "Seaside temple in Gijang. Taxi from Haeundae about 25 min. Go before the crowds.", "09:30"),
      P("Simmian", ["Simmian Busan Haeundae", "Simmian cafe Busan", "Simmian"], "Cafe by the Blueline Park."),
      E("Haeundae Blueline Park - Mipo Station", ["Haeundae Blueline Park - Mipo Station", "Haeundae Blueline Park"], "Coastal train and sky capsule along the water. Book ahead for the sky capsule."),
      P("비비비당", ["비비비당 부산", "Bibibidang Busan", "비비비당"], "Traditional Korean tea house. Order the 15-year-old Hwangcha from Mt. Jiri or the pumpkin bingsu."),
      P("The Soga Cafe", ["The Soga Cafe Busan Haeundae", "The Soga Cafe"], "Check out the exhibit upstairs!"),
      P("SportCasual wieeinkino Busan Heritagefloss 스포트캐주얼 비아인키노 부산점 헤리티지플로스", ["SportCasual wieeinkino Busan", "스포트캐주얼 비아인키노 부산점"], "Clothing store, right next to The Soga Cafe."),
      P("Kiminu", ["Kiminu Busan Haeundae", "Kiminu"], "Furniture store in Haeundae."),
      P("조현화랑 해운대", ["조현화랑 해운대", "Cho Hyun Gallery Haeundae", "Johyun Gallery Haeundae"], "Art gallery in Haeundae."),
      E("Haeundae Beach", ["Haeundae Beach"], "Easy stop for lunch and a walk."),
      P("LUFT MANSION", ["LUFT MANSION Busan", "Luft Mansion Haeundae", "LUFT MANSION"], "Haeundae."),
      P("Dongbaekseom Hoetjip", ["Dongbaekseom Hoetjip Busan", "동백섬횟집", "Dongbaekseom Hoetjip"], "Order the assorted sashimi; local recommended. Reservations recommended. Good dinner."),
    ],
    note: "This is a long list, so pick a cluster: (1) Haedong Yonggungsa + Ahopsan Forest in the north-east (taxi), (2) Cheongsapo/Dalmaji: Blueline Park, Simmian, 비비비당, Soga Cafe, SportCasual, Kiminu, (3) Haeundae: Standard Bread, 조현화랑, LUFT, dinner at Dongbaekseom Hoetjip. Ahopsan Forest (8,000 won, needs a car or taxi) is optional.",
    extra: [P("Ahopsan Forest", ["Ahopsan Forest Busan", "Ahopsan Forest", "아홉산숲"], "Optional: 8,000 won to enter, drive to get there. Combine with Haedong Yonggungsa by taxi.")],
  },
  {
    date: "2026-10-16", heading: "Busan cafes, then fly to Jeju",
    remove: ["Gimhae International Airport", "Jeju Dongmun Market Food Street"],
    places: [
      P("Working Holiday Brunch Cafe", ["Working Holiday Brunch Cafe Busan", "Working Holiday Brunch Cafe"], "Ice cream latte. Brunch before the flight; check opening hours."),
      P("Momos Coffee Domohun Branch", ["Momos Coffee Domohun Busan", "Momos Coffee Busan", "Momos Coffee"], "Coffee stop near Gwangalli."),
      P("F1963", ["F1963 Busan", "F1963"], "Former factory turned arts and culture space (bookstore, cafe)."),
      P("OLIVE YOUNG Busan Suyeong", ["OLIVE YOUNG Busan Suyeong", "Olive Young Suyeong Busan"], "Skincare stop on the way to the airport."),
      P("OLIVE YOUNG Busan Centum", ["OLIVE YOUNG Busan Centum", "Olive Young Centum City Busan"], "Alternative Olive Young in Centum City."),
      E("Gimhae International Airport", ["Gimhae International Airport"], "Departure from Busan. Confirm the flight time and work back from it."),
      P("Kodo", ["Kodo coffee Jeju", "Kodo Jeju", "Kodo"], "Pour-over coffee near Jeju City, close to the airport. First stop after landing."),
      P("Sukseongdu Jeju Main Branch", ["Sukseongdu Jeju Main Branch", "숙성도 본점 제주", "Sukseongdo Jeju"], "Black pork. Good first dinner near the airport."),
      P("Dongmun Traditional Market", ["Dongmun Traditional Market Jeju", "Dongmun Market Jeju City"], "Mackerel and abalone. Evening market near Jeju Airport."),
      P("우무 동문시장점", ["우무 동문시장점", "Umu Dongmun Market Jeju", "Umu Jeju"], "In Dongmun Market."),
      P("Jeju Dongmun Soy Sauce Crab 제주동문간장게장", ["제주동문간장게장", "Jeju Dongmun Soy Sauce Crab"], "Marinated crab near Dongmun Market."),
      P("Abebe Bakery Jeju", ["Abebe Bakery Jeju", "아베베베이커리"], "Bakery near Dongmun Market."),
      E("Jeju Dongmun Market Food Street", ["Jeju Dongmun Market Food Street"], "Evening food market close to the airport. Good first dinner."),
    ],
    note: null,
  },
  {
    date: "2026-10-17", heading: "Jeju: east coast, Seongsan & cafes",
    remove: ["Seongsan Ilchulbong", "Manjanggul Lava Tube", "Udo"],
    places: [
      E("Seongsan Ilchulbong", ["Seongsan Ilchulbong Seogwipo-si", "Seongsan Ilchulbong"], "Sunrise peak. Check sunrise time and buy tickets on the day. About a 30 min climb. Car park at the base.", "07:00"),
      P("Jeju Glass House", ["Jeju Glass House", "글라스하우스 제주"], "Maybe, for scenery to pop by. Near Seongsan."),
      P("Yumin Art Nouveau Collection", ["Yumin Art Nouveau Collection Jeju", "Yumin Art Nouveau Collection", "유민미술관"], "Next door to Jeju Glass House."),
      E("Udo Island", ["Udo Island"], "Short ferry from Seongsan Port. Rent an e-bike to go around."),
      P("Slow Season Lover", ["Slow Season Lover Jeju", "Slow Season Lover"], "Carrot juice. Gujwa area, on the way back west."),
      E("Manjanggul Lava Tube", ["Manjanggul Lava Tube"], "Lava tube, cool inside. Bring a jacket."),
      P("Jeju Organic Tangerine Farm", ["Jeju Organic Tangerine Farm", "제주 유기농 감귤농장"], "Tangerine picking season is mid-October onward."),
      P("Jeomjeom", ["Jeomjeom Jeju", "점점 제주", "Jeomjeom"], "Corn ice cream! Near Hamdeok/Jocheon on the way back to Jeju City."),
    ],
    note: "Route east to west: Seongsan and Udo first, then Slow Season Lover, Manjanggul, the tangerine farm and Jeomjeom on the way back. If you're staying on the west side, reverse it and do Jeomjeom and the farm first.",
  },
  {
    date: "2026-10-18", heading: "Jeju: Hallasan & autumn colors",
    remove: ["Hallasan"],
    places: [
      P("Coffee Temple Jeju", ["Coffee Temple Jeju", "커피템플 제주"], "Start the day with coffee before the mountain."),
      E("Hallasan", ["Hallasan Seogwipo-si", "Hallasan"], "Autumn colors on the mid-slopes. Eorimok or Yeongsil trails are shorter options. Check trail status and reservation rules. Trailhead car parks fill early, so arrive by 7:30.", "07:30"),
      P("Jeju Stone Museum", ["Jeju Stone Museum", "Jeju Stone Park", "제주돌문화공원"], "Jeju Stone Park, on the road north of the mountain; a gentle walk after the hike."),
    ],
    note: null,
  },
  {
    date: "2026-10-19", heading: "Jeju: south coast",
    remove: ["Jusangjeolli Cliff", "Seogwipo Jeongbang Waterfall", "Seogwipo Maeil Olle Market"],
    places: [
      P("woomee", ["woomee Jeju Seogwipo", "woomee cafe Jeju", "우미 남원"], "European vibes. Nam-won, east of Seogwipo; start here."),
      E("Seogwipo Maeil Olle Market", ["Seogwipo Maeil Olle Market", "서귀포매일올레시장"], "Try black pork (heukdwaeji) and tangerine snacks."),
      E("Jeongbang Waterfall", ["Jeongbang Waterfall Seogwipo"], "Waterfall that drops directly into the sea."),
      E("Jusangjeolli Cliff", ["Jusangjeolli Cliff"], "Hexagonal basalt columns on the coast."),
    ],
    note: "You're staying at Aria in Seogwipo (Jungmun), so this is a light day near the hotel. If you have energy, the Andeok museums (Bonte, Wind Museum) on Oct 20 are a short drive west.",
  },
  {
    date: "2026-10-20", heading: "Jeju: west coast, museums & sunset",
    remove: ["Hallim Park", "Hyeopjae Beach", "수월봉"],
    places: [
      P("Wind Museum", ["Wind Museum Jeju", "바람박물관"], "Andeok area. Small museum, quick stop."),
      P("Bonte Museum", ["Bonte Museum Jeju", "본태박물관"], "Andeok, next to the Wind Museum. Tadao Ando building."),
      P("Muroi", ["Muroi Jeju", "Muroi cafe Jeju", "무로이"], "Such a cute modern coffee shop."),
      P("Don-Eogil", ["Don-Eogil Jeju", "Don Eogil Jeju", "돈어길"], "Lunch in the Seogwang area."),
      P("Osulloc Tea Museum", ["Osulloc Tea Museum"], "Matcha noodles and soft serve."),
      P("Kim Tschang-Yeul Museum of Art", ["Kim Tschang-Yeul Museum of Art", "김창열미술관"], "Water-drop paintings; a quiet museum near Hallim."),
      E("Hallim Park", ["Hallim Park, Jeju, South Korea", "Hallim Park"], "Gardens and lava caves on the west side."),
      E("Hyeopjae Beach", ["Hyeopjae Beach"], "Calm water and views of Biyangdo island."),
      E("Sunset at Suwolbong Peak Jeju", ["Sunset at Suwolbong Peak Jeju", "수월봉"], "West coast sunset viewpoint.", "18:00"),
      P("Coffee Nap Roasters Jeju", ["Coffee Nap Roasters Jeju", "커피낮잠"], "Roastery on the way back east toward Jeju City."),
    ],
    note: "A long day of options, in driving order from the south-west: Andeok (Wind Museum, Bonte, Muroi), Seogwang (Don-Eogil, Osulloc), Hallim (Kim Tschang-Yeul, Hallim Park, Hyeopjae), Suwolbong at sunset. Pick two or three museums and skip the rest.",
  },
  {
    date: "2026-10-21", heading: "Fly Jeju to Seoul: Yeouido & Hongdae",
    remove: ["Jeju International Airport", "Gimpo International Airport"],
    places: [
      E("Jeju International Airport", ["Jeju International Airport"], "Departure."),
      E("Gimpo International Airport", ["Gimpo International Airport"], "Arrival. Subway line 9 goes straight to Yeouido."),
      P("더현대 서울", ["The Hyundai Seoul", "더현대 서울"], "Namh said to go here, basement level. Yeouido; take line 9 from Gimpo, then drop bags at the hotel later."),
      P("Komfy", ["Komfy Seoul Mangwon", "Komfy Seoul", "Komfy"], "Mangwon/Hapjeong area, on the way to Hongdae."),
      P("rytm", ["rytm Seoul Hongdae", "rytm Seoul", "rytm"], "Yeonnam-dong/Hongdae area."),
      P("Sarukame", ["Sarukame Seoul", "Sarukame ramen Seoul", "Sarukame"], "Clam-based broth ramen. Good dinner near RYSE."),
    ],
    note: null,
  },
  {
    date: "2026-10-22", heading: "Seoul: Seongsu, Hannam & Dosan (shop and eat)",
    remove: ["Myeongdong Shopping Street", "Myeongdong Kyoja", "Seongsu-dong", "Hongdae Shopping Street", "Dongdaemun Design Plaza"],
    places: [
      P("Matin Kim Seongsu Store", ["Matin Kim Seongsu Store", "Matin Kim Seongsu"], "Fashion store in Seongsu."),
      P("Point of View", ["Point of View Seongsu Seoul", "Point of View Seoul stationery", "Point of View"], "Stationery!!"),
      E("Seongsu-dong", ["Seongsu-dong Seoul"], "Concept stores, cafes and fashion."),
      P("Nothing Written", ["Nothing Written Seoul Hannam", "Nothing Written Seoul", "Nothing Written"], "Hannam."),
      P("RECTO", ["RECTO Seoul Hannam", "RECTO Seoul", "RECTO"], "Hannam, next to Nothing Written."),
      P("Hyundai Card Music Library", ["Hyundai Card Music Library Seoul", "Hyundai Card Music Library"], "Hannam; a music library and cafe."),
      P("Leeum Museum of Art", ["Leeum Museum of Art Seoul", "Leeum Museum of Art"], "Namh recommends. Hannam."),
      P("NUDAKE Haus Dosan", ["NUDAKE Haus Dosan Seoul", "NUDAKE Haus Dosan"], "Dosan/Apgujeong."),
      P("96-18 Cheongdam-dong", ["Kimhekim Cheongdam Seoul", "96-18 Cheongdam-dong Seoul"], "Kimhekim store."),
      P("Kiez Seoul", ["Kiez Seoul Dosan", "Kiez Seoul", "Kiez"], "Dosan area."),
      P("Restaurant SAN", ["Restaurant SAN Seoul Dosan", "Restaurant SAN Seoul", "산 레스토랑 서울"], "Noodles!! We gotta go. Book ahead."),
      P("ZEST SEOUL", ["ZEST SEOUL Dosan", "ZEST SEOUL bar", "ZEST SEOUL"], "Jo & James says best bar. Evening."),
    ],
    note: "Route: Seongsu in the morning (Matin Kim, Point of View, Seongsu-dong), Hannam in the afternoon (Nothing Written, RECTO, Hyundai Card Music Library, Leeum), then Dosan/Apgujeong for the evening (NUDAKE, Kimhekim, Kiez, dinner at Restaurant SAN, drinks at ZEST). You don't need all of it, so pick by mood. Myeongdong and Hongdae were covered on Oct 12 and Oct 21. Museum SAN (Wonju, in Gangwon) needs an advance booking and is about 1.5-2 hours each way, so I left it out.",
  },
];

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["node_modules/wanderlog-mcp/dist/index.js"],
  env: { ...process.env },
  stderr: "ignore",
});
const client = new Client({ name: "rebuild", version: "0.0.0" });
await client.connect(transport);

const call = async (name, args) => {
  const r = await client.callTool({ name, arguments: { trip_key: KEY, ...args } });
  return { err: !!r.isError, text: r.content?.[0]?.text ?? "" };
};
const short = (s) => s.split("\n")[0].slice(0, 110);
const dateShort = (iso) => "Oct " + Number(iso.slice(8));

let matched = 0, fell = 0, fellNames = [];
for (const d of days) {
  console.log(`\n== ${d.date} ${d.heading}`);
  await call("wanderlog_rename_day", { day: d.date, heading: d.heading });
  const oldNotes = { "2026-10-12": "This is a full day", "2026-10-22": "Full day for shopping and eating" };
  if (oldNotes[d.date]) {
    const res = await call("wanderlog_remove_note", { day: d.date, text: oldNotes[d.date] });
    console.log(`   - old note: ${res.err ? "not found" : "removed"}`);
  }
  for (const r of d.remove) {
    const res = await call("wanderlog_remove_place", { place_ref: `${r} on ${dateShort(d.date)}` });
    console.log(`   - ${r}: ${res.err ? "not found" : "removed"}`);
  }
  const items = [...d.places, ...(d.extra ?? [])];
  for (const it of items) {
    const isPin = !!it.pin;
    const pin = isPin ? pins[it.pin] : null;
    const note = isPin ? [pin.note && `From your list: ${pin.note}.`, it.tip].filter(Boolean).join(" ") : it.note;
    const label = isPin ? it.pin : it.name;
    let done = false;
    for (const q of it.q) {
      const args = { day: d.date, place: q, note };
      if (it.start) args.start_time = it.start;
      if (it.end) args.end_time = it.end;
      const res = await call("wanderlog_add_place", args);
      if (!res.err) { console.log(`   + ${label}  ->  ${short(res.text)}`); matched++; done = true; break; }
    }
    if (!done) {
      fell++; fellNames.push(`${d.date} ${label}`);
      const text = isPin
        ? `📍 ${it.pin}. ${note} Map: https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`
        : `📍 ${label}. ${note}`;
      await call("wanderlog_add_note", { day: d.date, text });
      console.log(`   ! ${label}  (not matched, added as a note with a map link)`);
    }
  }
  if (d.note) {
    await call("wanderlog_add_note", { day: d.date, text: d.note });
    console.log("   + note");
  }
}
console.log(`\nDONE matched=${matched} fallback=${fell}`);
console.log(fellNames.join("\n"));
await client.close();
