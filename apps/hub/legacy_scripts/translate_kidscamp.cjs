const fs = require('fs');
let file = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/data/activities.hi.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/name: 'Biology Lab',/g, "name: 'जीव विज्ञान लैब',");
data = data.replace(/description: 'Explore the wonders of life, cells, and ecosystems in the Biology Lab.',/g, "description: 'जीव विज्ञान लैब में जीवन, कोशिकाओं और पारिस्थितिक तंत्र के अजूबों का अन्वेषण करें।',");

data = data.replace(/name: 'Erupting Volcano',/g, "name: 'ज्वालामुखी विस्फोट',");
data = data.replace(/description: 'Create an explosive volcanic eruption using kitchen chemistry! Watch the foam flow.',/g, "description: 'रसोई के रसायन विज्ञान का उपयोग करके एक विस्फोटक ज्वालामुखी बनाएं! झाग को बहते हुए देखें।',");

data = data.replace(/name: 'Nature Scavenger Hunt',/g, "name: 'प्रकृति खजाने की खोज',");
data = data.replace(/description: 'Explore the outdoors with a checklist of natural treasures to find! Perfect for parks.',/g, "description: 'खोजने के लिए प्राकृतिक खजानों की सूची के साथ बाहर का अन्वेषण करें! पार्कों के लिए बिल्कुल सही।',");

data = data.replace(/name: 'Tie-Dye T-Shirt',/g, "name: 'टाई-डाई टी-शर्ट',");
data = data.replace(/description: 'Create a groovy tie-dye shirt with swirls of color! Learn folding techniques for unique patterns.',/g, "description: 'रंगों के भंवर के साथ एक शानदार टाई-डाई शर्ट बनाएं! अद्वितीय पैटर्न के लिए तह तकनीक सीखें।',");

data = data.replace(/name: 'Finger Painting Fun',/g, "name: 'फिंगर पेंटिंग मज़ा',");
data = data.replace(/description: 'Get messy with finger paints! Create colorful artwork while developing fine motor skills.',/g, "description: 'फिंगर पेंट के साथ मज़े करें! ठीक मोटर कौशल विकसित करते हुए रंगीन कलाकृति बनाएं।',");

data = data.replace(/name: 'Marble Run Adventure',/g, "name: 'मार्बल रन एडवेंचर',");
data = data.replace(/description: 'Engineer an exciting marble run with twists, turns, and drops. Watch marbles race through your custom creation!',/g, "description: 'मोड़ और ड्रॉप के साथ एक रोमांचक मार्बल रन इंजीनियर करें। अपनी रचना के माध्यम से कंचों की दौड़ देखें!',");

data = data.replace(/name: 'Water Balloon Games',/g, "name: 'वाटर बैलून गेम्स',");
data = data.replace(/description: 'Cool off with exciting water balloon games! From toss to relay races, get ready to get wet.',/g, "description: 'रोमांचक वाटर बैलून गेम्स के साथ शांत हो जाएं! टॉस से लेकर रिले दौड़ तक, भीगने के लिए तैयार हो जाएं।',");

data = data.replace(/name: 'Balloon Rocket',/g, "name: 'बैलून रॉकेट',");
data = data.replace(/description: 'Launch a balloon across the room on a string! Learn about thrust and Newton\\'s laws in this fast-paced lab.',/g, "description: 'एक स्ट्रिंग पर कमरे के पार एक गुब्बारा लॉन्च करें! इस तेज़-तर्रार लैब में थ्रस्ट और न्यूटन के नियमों के बारे में जानें।',");

fs.writeFileSync(file, data);
console.log('Translated featured activities in activities.hi.ts');
