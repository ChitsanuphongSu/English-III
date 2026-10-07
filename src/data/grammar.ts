export interface GrammarLesson {
  id: string;
  topicId: string;
  titleEn: string;
  titleTh: string;
  unit: 'unit3' | 'unit4';
  form: string;
  useEn: string;
  useTh: string;
  signalClues: string[];
  rules: {
    heading: string;
    explanationTh: string;
    examples: { en: string; th: string; highlight?: string }[];
  }[];
  commonTraps: {
    trapTitleTh: string;
    wrongExample: string;
    correctExample: string;
    reasonTh: string;
  }[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  // ================= UNIT 3A: Multi-word Verbs =================
  {
    id: 'grammar-mwv-lesson',
    topicId: 'grammar-multiword',
    unit: 'unit3',
    titleEn: 'Multi-word Verbs (4 Types & Object Placement)',
    titleTh: 'กริยาวลี 4 ประเภท และตำแหน่งของกรรม',
    form: 'Verb + Particle(s) (Prepositions / Adverbs)',
    useEn: 'Multi-word verbs combine a base verb with one or two particles to create new meanings.',
    useTh: 'กริยาวลีที่สร้างความหมายเฉพาะ โดยแบ่งตามลักษณะการมีกรรมและตำแหน่งการวางกรรม 4 ประเภท',
    signalClues: [
      'Type 1: Intransitive (No object)',
      'Type 2: Transitive Separable (Object can go in middle or after)',
      'Type 3: Transitive Inseparable (Object MUST immediately follow)',
      'Type 4: Three-word verbs (2 prepositions + object)'
    ],
    rules: [
      {
        heading: 'Type 1: Intransitive (ไม่มีกรรม)',
        explanationTh: 'กริยาเหล่านี้กระทำโดยประธานเอง ไม่ต้องการกรรมมารองรับ ห้ามใส่ pronoun หรือ noun ตามหลังเป็นกรรมตรง เช่น wake up, go away, fall down, stay up, break up, sit down, take off (เครื่องบินขึ้น), calm down (ใจเย็นลง)',
        examples: [
          { en: 'John never wakes up early.', th: 'จอห์นไม่เคยตื่นนอนแต่เช้าเลย', highlight: 'wakes up' },
          { en: 'Anna always stays up late playing video games.', th: 'แอนนานอนดึกเสมอเพื่อเล่นเกม', highlight: 'stays up' },
          { en: 'Tom and his girlfriend broke up last week.', th: 'ทอมกับแฟนเลิกกันเมื่อสัปดาห์ก่อน', highlight: 'broke up' },
          { en: 'The plane took off on time.', th: 'เครื่องบินบินขึ้นตรงเวลา', highlight: 'took off' }
        ]
      },
      {
        heading: 'Type 2: Transitive Separable (ต้องมีกรรม คั่นกลางหรือตามหลังได้)',
        explanationTh: 'ต้องมีกรรมเสมอ โดยกรรมที่เป็นคำนามสามารถวางคั่นกลางหรือวางข้างหลังได้ แต่ถ้ากรรมเป็นสรรพนาม (Pronoun: me, him, her, it, them, us) "ต้องคั่นกลางเท่านั้น" เช่น wake sb up, take sth off, calm sb down, try sth out, figure sth out, make sth up, throw sth away, pick sth up, let sb down',
        examples: [
          { en: 'I always wake my roommate up. (OR: wake up my roommate)', th: 'ฉันปลุกรูมเมทเสมอ', highlight: 'wake my roommate up' },
          { en: 'I woke HIM up at 6 AM. (ห้าม: woke up him)', th: 'ฉันปลุกเขาตอน 6 โมงเช้า (Pronoun ต้องอยู่ตรงกลาง)', highlight: 'woke HIM up' },
          { en: 'Walking helps me figure things out.', th: 'การเดินช่วยให้ฉันหาคำตอบและคิดออก', highlight: 'figure things out' },
          { en: 'I never throw old notes away.', th: 'ฉันไม่เคยทิ้งสมุดโน้ตเก่าเลย', highlight: 'throw old notes away' },
          { en: 'We never let our team down.', th: 'พวกเราไม่เคยทำให้ทีมผิดหวัง', highlight: 'let our team down' }
        ]
      },
      {
        heading: 'Type 3: Transitive Inseparable (ต้องมีกรรมตามหลัง preposition ทันที)',
        explanationTh: 'กริยากลุ่มนี้มีกรรมเสมอ แต่กรรม "ต้องอยู่หลัง preposition ทันที" ห้ามแยกเอาคำนามหรือสรรพนามมาคั่นกลางเด็ดขาด เช่น look into sth, focus on sth, believe in sth, live for sth, be into sth, look after sb',
        examples: [
          { en: 'Alex loves to look into science facts. (ห้าม: look science facts into)', th: 'อเล็กซ์ชอบค้นคว้าหาข้อมูลวิทยาศาสตร์', highlight: 'look into science facts' },
          { en: 'Chris always focuses on his drawings.', th: 'คริสมีสมาธิจดจ่อกับภาพวาดของเขาเสมอ', highlight: 'focuses on' },
          { en: 'Grace always looks after her younger classmates. (ห้าม: looks her classmates after)', th: 'เกรซคอยดูแลรุ่นน้องเสมอ', highlight: 'looks after' }
        ]
      },
      {
        heading: 'Type 4: Three-word Verbs (มี Preposition 2 ตัว + กรรมตามหลัง)',
        explanationTh: 'ประกอบด้วยกริยา + preposition 2 ตัว และต้องมีกรรมตามหลังกริยาตัวสุดท้ายเสมอ ห้ามแยกคำ เช่น come up with sth, look down on sb, look up to sb, run out of sth, fall out with sb, go on about sth, get away with sth',
        examples: [
          { en: 'James always comes up with good ideas.', th: 'เจมส์มักจะคิดไอเดียดีๆ ออกเสมอ', highlight: 'comes up with' },
          { en: 'Kind students never look down on others.', th: 'นักเรียนที่ดีจะไม่ดูถูกผู้อื่น', highlight: 'look down on' },
          { en: 'Henry looks up to his favorite English teacher.', th: 'เฮนรี่เคารพนับถือคุณครูภาษาอังกฤษ', highlight: 'looks up to' },
          { en: 'Usually I get away with them (mistakes).', th: 'ปกติฉันมักจะรอดพ้นความผิดไปได้', highlight: 'get away with' }
        ]
      }
    ],
    commonTraps: [
      {
        trapTitleTh: 'Pronoun กับ Type 2 Multi-word Verbs',
        wrongExample: 'I always wake up him early.',
        correctExample: 'I always wake him up early.',
        reasonTh: 'กริยา Type 2 เมื่อกรรมเป็น Pronoun (him, her, it, them) ต้องวางแทรกกลางระหว่าง Verb และ Particle เสมอ'
      },
      {
        trapTitleTh: 'Type 1 vs Type 2: wake up vs wake sb up',
        wrongExample: 'John wakes up his brother at 7 AM. (ถ้าคิดว่า wake up ไม่มีกรรม)',
        correctExample: 'John wakes his brother up at 7 AM. (ใช้ Type 2 เพราะมี brother เป็นกรรม)',
        reasonTh: 'ต้องดูว่าประธานตื่นเอง (Type 1: John wakes up) หรือประธานไปปลุกคนอื่น (Type 2: John wakes sb up)'
      },
      {
        trapTitleTh: 'look up to (นับถือ) vs look down on (ดูถูก)',
        wrongExample: 'Kind people look down on their teachers.',
        correctExample: 'Kind people look up to their teachers.',
        reasonTh: 'Look up to = เคารพนับถือ / ชื่นชม, Look down on = ดูถูกเหยียดหยาม'
      }
    ]
  },

  // ================= UNIT 3B: Present Perfect vs Present Perfect Continuous =================
  {
    id: 'grammar-present-perf-lesson',
    topicId: 'grammar-present-perf',
    unit: 'unit3',
    titleEn: 'Present Perfect vs Present Perfect Continuous',
    titleTh: 'Present Perfect vs Present Perfect Continuous (ผลลัพธ์ vs ความต่อเนื่อง)',
    form: 'Present Perfect: have/has + V3  |  Present Perfect Continuous: have/has + been + V-ing',
    useEn: 'Present Perfect focuses on completed results and quantity/counts. Present Perfect Continuous focuses on the ongoing activity, duration, and time spent. Stative verbs such as know, love, and understand are generally not used in the continuous form in this comparison.',
    useTh: 'Present Perfect เน้นผลสำเร็จ/จำนวนครั้ง/ผลงานที่เสร็จสิ้น ส่วน Present Perfect Continuous เน้นกระบวนการทำอย่างต่อเนื่องและระยะเวลาที่ใช้ โดยกริยาแสดงสภาวะ เช่น know, love, understand ไม่ใช้ในรูป Continuous ในบริบทที่กำลังเปรียบเทียบนี้',
    signalClues: [
      'Present Perfect Clues: 5 times, 3 books, already, yet, ever, never, finished outcome',
      'Present Perfect Continuous Clues: for hours, since Monday, all day, the whole day, recently',
      'Stative Verbs Note: know, love, understand are not used in continuous form in this comparison'
    ],
    rules: [
      {
        heading: 'Present Perfect: เน้นผลลัพธ์ (Result) และจำนวน (Quantity/Times)',
        explanationTh: 'โฟกัสที่: ผลลัพธ์ของการกระทำที่เกิดขึ้นในอดีต และผลลัพธ์นั้นมีความสำคัญในปัจจุบัน ไม่ได้สนใจว่าใช้เวลานานแค่ไหน แต่สนใจว่า "ทำเสร็จแล้วกี่ครั้ง/กี่ชิ้น"',
        examples: [
          { en: 'I have read Harry Potter 5 times.', th: 'ฉันอ่านแฮร์รี่ พอตเตอร์ จบไปแล้ว 5 รอบ (เน้นจำนวนรอบที่สำเร็จ)', highlight: 'have read' },
          { en: 'She has finished her report.', th: 'เธอทำรายงานเสร็จเรียบร้อยแล้ว (เน้นผลลัพธ์ว่ารายงานเสร็จ)', highlight: 'has finished' },
          { en: 'I’ve written six books already.', th: 'ฉันเขียนหนังสือออกมาแล้ว 6 เล่ม (มีตัวเลขบอกผลงาน 6 เล่ม)', highlight: '’ve written' }
        ]
      },
      {
        heading: 'Present Perfect Continuous: เน้นกิจกรรม (Activity) และระยะเวลา (Duration)',
        explanationTh: 'โฟกัสที่: ความต่อเนื่องของการกระทำที่เกิดขึ้นในอดีต และยังดำเนินต่อมาถึงปัจจุบัน หรือเพิ่งสิ้นสุดลงไม่นาน โดยเน้นว่าใช้เวลาทำสิ่งนี้นานเท่าใด',
        examples: [
          { en: 'I have been reading for the whole day.', th: 'ฉันนั่งอ่านหนังสือมาทั้งวัน (เน้นกิจกรรมและความต่อเนื่อง)', highlight: 'have been reading' },
          { en: 'They have been working on this project since Monday.', th: 'พวกเขาทำงานในโปรเจกต์นี้มาตั้งแต่วันจันทร์', highlight: 'have been working' },
          { en: 'I’ve been writing for 20 years now.', th: 'ฉันเขียนหนังสือมาอย่างต่อเนื่อง 20 ปีแล้ว (และปัจจุบันยังคงเขียนอยู่)', highlight: '’ve been writing' },
          { en: 'We’ve been spending a lot of time in the last few months discussing changes.', th: 'พวกเราใช้เวลาสองสามเดือนที่ผ่านมาพูดคุยเกี่ยวกับการปรับเปลี่ยนบท', highlight: '’ve been spending' }
        ]
      },
      {
        heading: 'ข้อควรระวัง: กริยาแสดงสภาวะ (Stative Verbs ในบริบทนี้)',
        explanationTh: 'กริยาแสดงสภาวะ เช่น know, love, understand ไม่ใช้ในรูป Continuous ในบริบทที่กำลังเปรียบเทียบ Present Perfect กับ Present Perfect Continuous เช่น ต้องใช้ I’ve known her for all my life (ไม่ใช้ I’ve been knowing her)',
        examples: [
          { en: 'I’ve known her for years. (จาก Source)', th: 'ฉันรู้จักเธอมานานหลายปีแล้ว', highlight: '’ve known' },
          { en: 'I’ve known her for all my life (ไม่ใช่ I’ve been knowing her for all my life).', th: 'ตัวอย่างจากข้อสอบ Review หน้า 2', highlight: '’ve known' }
        ]
      }
    ],
    commonTraps: [
      {
        trapTitleTh: 'เห็น for years / for all my life แต่เป็นกริยา know',
        wrongExample: 'I’ve been knowing her for all my life.',
        correctExample: 'I’ve known her for all my life.',
        reasonTh: 'กริยาแสดงสภาวะ เช่น know ไม่ใช้ในรูป Continuous ในบริบทการเปรียบเทียบนี้ตาม source'
      },
      {
        trapTitleTh: 'มีจำนวนชิ้นหรือจำนวนครั้ง เช่น six books already, 5 times',
        wrongExample: 'I have been writing six books already.',
        correctExample: 'I have written six books already.',
        reasonTh: 'เมื่อบอกจำนวนผลลัพธ์ชัดเจน (six books / 5 times) ต้องใช้ Present Perfect (have written)'
      }
    ]
  },

  // ================= UNIT 4A: Habits & Accustomed =================
  {
    id: 'grammar-used-to-lesson',
    topicId: 'grammar-used-to',
    unit: 'unit4',
    titleEn: 'used to vs would vs be used to vs get used to',
    titleTh: 'การบอกนิสัยในอดีต (used to / would) และความคุ้นเคย (be/get used to)',
    form: 'used to + V.infinitive | would + action verb | be/get used to + V-ing / Noun',
    useEn: 'Expressing past repeated habits and past states vs accustomed situations.',
    useTh: 'used to ใช้กับสิ่งที่เคยทำหรือเคยเป็นในอดีตแต่ปัจจุบันเลิกแล้ว, would ใช้กับกริยาการกระทำซ้ำๆ ในอดีต, be/get used to ใช้กับความชิน/คุ้นเคย',
    signalClues: [
      'used to + Base Verb (เคย... ในอดีต แต่ปัจจุบันไม่ทำแล้ว)',
      'Negative: didn\'t use to + Base Verb (สังเกต: use ไม่มี d)',
      'Question: Did you use to + Base Verb?',
      'would + Action Verb (นิสัยการกระทำในอดีต ห้ามใช้กับ stative verbs เช่น live/be)',
      'be used to + V-ing / Noun (คุ้นเคย/ชินกับ)',
      'get used to + V-ing / Noun (เริ่มปรับตัว/เริ่มคุ้นเคย)'
    ],
    rules: [
      {
        heading: '1. used to + กริยาไม่ผัน (Infinitive)',
        explanationTh: 'เกิดขึ้นเป็นประจำในอดีต แต่ปัจจุบันไม่ได้เกิดขึ้นอีกแล้ว ใช้ได้ทั้งการกระทำและสถานะในอดีต (Past States & Habits) ในปฏิเสธ/คำถาม ใช้ didn\'t use to / Did you use to',
        examples: [
          { en: 'I used to play games every day.', th: 'เมื่อก่อนฉันเล่นเกมทุกวัน (ตอนนี้ไม่แล้ว)', highlight: 'used to play' },
          { en: 'She used to live in London.', th: 'เมื่อก่อนเธอเคยอาศัยอยู่ในลอนดอน (Past state)', highlight: 'used to live' },
          { en: 'Did you use to play games every day?', th: 'เมื่อก่อนคุณเคยเล่นเกมทุกวันไหม? (use ไม่มี d)', highlight: 'Did you use to' },
          { en: 'Not bad for someone who didn\'t use to run anywhere.', th: 'ไม่เลวเลยสำหรับคนที่ไม่เคยวิ่งไปไหนเลยเมื่อก่อน', highlight: 'didn\'t use to run' }
        ]
      },
      {
        heading: '2. would + Action Verb (กริยาการกระทำ)',
        explanationTh: 'ใช้เล่าถึงนิสัยหรือพฤติกรรมที่ทำซ้ำๆ ในอดีตได้เหมือน used to แต่ "ห้ามใช้กับกริยาสถานะ (stative verbs เช่น live, have, be)"',
        examples: [
          { en: 'I would usually make up an excuse when we were forced to do sport.', th: 'เมื่อก่อนฉันมักจะหาข้ออ้างเมื่อถูกบังคับให้เล่นกีฬา (would + make up)', highlight: 'would usually make up' }
        ]
      },
      {
        heading: '3. be used to + V-ing หรือ คำนาม (ความคุ้นเคย)',
        explanationTh: 'หมายถึง "คุ้นชิน / คุ้นเคย" กับสิ่งใดสิ่งหนึ่ง สิ่งที่ตามหลังต้องเป็น Gerund (V-ing) หรือ Noun เท่านั้น!',
        examples: [
          { en: 'I am used to the traffic in Bangkok.', th: 'ฉันคุ้นเคยกับการจราจรใน กทม. (ตามด้วย Noun)', highlight: 'am used to the traffic' },
          { en: 'He was a runner and was used to doing 50 km a week.', th: 'เขาเป็นนักวิ่งและคุ้นชินกับการวิ่ง 50 กม. ต่อสัปดาห์ (was used to + doing)', highlight: 'was used to doing' }
        ]
      },
      {
        heading: '4. get used to + V-ing หรือ คำนาม (การปรับตัวให้เริ่มคุ้นเคย)',
        explanationTh: 'ใช้เมื่อต้องการแสดงถึงการเปลี่ยนแปลงจากที่ไม่คุ้นเคย มาเป็นเริ่มคุ้นเคย',
        examples: [
          { en: 'I am getting used to the new job.', th: 'ฉันกำลังเริ่มคุ้นเคยกับงานใหม่', highlight: 'getting used to' },
          { en: 'I still haven\'t got used to running in the rain.', th: 'ฉันยังคงไม่คุ้นชินกับการวิ่งกลางสายฝน (haven\'t got used to + running)', highlight: 'haven\'t got used to running' }
        ]
      }
    ],
    commonTraps: [
      {
        trapTitleTh: 'be used to + V-ing vs used to + V1',
        wrongExample: 'He was used to do 50 km a week.',
        correctExample: 'He was used to DOING 50 km a week.',
        reasonTh: 'ถ้ามี verb to be นำหน้า (was used to) แปลว่า "คุ้นชิน" ต้องตามด้วย V-ing (doing) ไม่ใช่ V1'
      },
      {
        trapTitleTh: 'รูปปฏิเสธของ used to ในอดีต',
        wrongExample: 'He didn\'t used to run.',
        correctExample: 'He didn\'t USE to run.',
        reasonTh: 'เมื่อมี didn\'t ช่วยแล้ว คำว่า use ต้องตัดตัว d ออก เป็น didn\'t use to'
      }
    ]
  },

  // ================= UNIT 4B: Obligation & Permission =================
  {
    id: 'grammar-obligation-lesson',
    topicId: 'grammar-obligation',
    unit: 'unit4',
    titleEn: 'Obligation and Permission',
    titleTh: 'ข้อบังคับ หน้าที่ และการอนุญาต (Obligation & Permission)',
    form: 'be supposed to + V1 | be forced to + V1 | be allowed to + V1 | let sb + V.bare',
    useEn: 'Expressing obligations, permissions, expectations, and compulsions.',
    useTh: 'การบอกว่าควรทำตามหน้าที่ ถูกบังคับ ได้รับอนุญาต หรืออนุญาตให้ใครทำอะไร',
    signalClues: [
      'be supposed to + V1 (ควรจะ/ได้รับมอบหมายให้ทำ ตามกฎหรือความคาดหวัง)',
      'be forced to + V1 (ถูกบังคับให้ทำ)',
      'be allowed to + V1 (ได้รับอนุญาตให้ทำ)',
      'let + someone + bare verb (อนุญาตให้ใครทำ โดยไม่มี to)',
      'didn\'t need to + V1 (ไม่จำเป็นต้องทำในอดีต)',
      'wasn\'t allowed to + V1 (ไม่ได้รับอนุญาต)'
    ],
    rules: [
      {
        heading: '1. be supposed to + กริยาไม่ผัน (Infinitive)',
        explanationTh: 'หมายถึง "ควรจะ / มีหน้าที่ต้องทำ" ตามกฎ ระเบียบ หรือความคาดหวัง "ต้องใช้คู่กับ Verb to be เสมอ"',
        examples: [
          { en: 'He worked out a programme that I was supposed to follow.', th: 'เขาจัดโปรแกรมที่ฉันควรจะต้องปฏิบัติตาม (was supposed to follow)', highlight: 'was supposed to' }
        ]
      },
      {
        heading: '2. be forced to + กริยาไม่ผัน (Infinitive)',
        explanationTh: 'หมายถึง "ถูกบังคับให้ทำ" โดยไม่มีทางเลือกอื่น',
        examples: [
          { en: 'We hated sport when we were forced to do anything athletic.', th: 'พวกเราเกลียดกีฬาตอนที่เราถูกบังคับให้ทำกิจกรรมกีฬา', highlight: 'were forced to do' }
        ]
      },
      {
        heading: '3. let + someone + กริยาไม่ผัน (Bare Infinitive ไม่มี to)',
        explanationTh: 'กริยา let เมื่อแปลว่าปล่อยให้/อนุญาตให้ใครทำอะไร กริยาที่ตามหลัง "ห้ามมี to เด็ดขาด"',
        examples: [
          { en: 'Mark didn\'t let me relax. (ห้าม: let me to relax ❌)', th: 'มาร์คไม่ยอมปล่อยให้ฉันพักผ่อนเลย', highlight: 'let me relax' }
        ]
      },
      {
        heading: '4. didn\'t need to vs wasn\'t allowed to',
        explanationTh: 'didn\'t need to = ไม่จำเป็นต้องทำ, wasn\'t allowed to = ไม่ได้รับอนุญาต (ถูกห้าม)',
        examples: [
          { en: 'I thought I didn\'t need to do it exactly as he said.', th: 'ฉันคิดว่าฉันไม่จำเป็นต้องทำตามที่เขาบอกเป๊ะๆ', highlight: 'didn\'t need to' }
        ]
      }
    ],
    commonTraps: [
      {
        trapTitleTh: 'let someone + V.bare (ห้ามใส่ to)',
        wrongExample: 'He didn\'t let me to relax.',
        correctExample: 'He didn\'t let me relax.',
        reasonTh: 'let someone ต้องตามด้วย Bare Infinitive (กริยารูปเดิมไม่มี to)'
      },
      {
        trapTitleTh: 'supposed to ต้องมี Verb to be ข้างหน้า',
        wrongExample: 'I supposed to follow the rules.',
        correctExample: 'I WAS supposed to follow the rules.',
        reasonTh: 'be supposed to ต้องมี is/am/are/was/were อยู่ข้างหน้าเสมอ'
      }
    ]
  }
];
