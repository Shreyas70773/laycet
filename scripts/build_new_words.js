/**
 * Generate full word entries with Chinese definitions, IPA, part of speech,
 * example sentences, and synonyms for all missing words.
 * 
 * This uses a comprehensive built-in dictionary approach.
 */

const fs = require('fs');
const path = require('path');

const wordList = require('./final_word_list.json');
const wordDetails = require('./final_words_detail.json');
const existingWords = require('../src/data/words.json');

const existingSet = new Set(existingWords.map(w => w.word.toLowerCase()));
const allTargetWords = new Set([...existingSet, ...wordList.map(w => w.toLowerCase())]);

// Comprehensive dictionary for CET-4 level supplementary words
const DICTIONARY = {
  "company": { chinese: "公司;陪伴", ipa: "/ˈkʌmpəni/", pos: "n.", example: "She works for a large company in the city.", synonyms: ["firm", "corporation", "business"] },
  "please": { chinese: "请;使高兴", ipa: "/pliːz/", pos: "v./adv.", example: "Please open the window.", synonyms: ["satisfy", "delight"] },
  "students": { chinese: "学生(复数)", ipa: "/ˈstjuːdənts/", pos: "n.", example: "The students are studying for the exam.", synonyms: ["pupils", "learners"] },
  "plan": { chinese: "计划;方案", ipa: "/plæn/", pos: "n./v.", example: "We need to plan our schedule for next week.", synonyms: ["scheme", "strategy", "design"] },
  "hard": { chinese: "困难的;努力地;硬的", ipa: "/hɑːrd/", pos: "adj./adv.", example: "She studied hard to pass the exam.", synonyms: ["difficult", "tough", "challenging"] },
  "problem": { chinese: "问题;难题", ipa: "/ˈprɑːbləm/", pos: "n.", example: "We need to solve this problem quickly.", synonyms: ["issue", "difficulty", "challenge"] },
  "teacher": { chinese: "教师;老师", ipa: "/ˈtiːtʃər/", pos: "n.", example: "The teacher explained the lesson clearly.", synonyms: ["instructor", "educator", "tutor"] },
  "decided": { chinese: "决定了的", ipa: "/dɪˈsaɪdɪd/", pos: "v.", example: "They decided to move to a new city.", synonyms: ["determined", "resolved", "chose"] },
  "team": { chinese: "团队;队伍", ipa: "/tiːm/", pos: "n.", example: "Our team won the competition last year.", synonyms: ["group", "crew", "squad"] },
  "education": { chinese: "教育;学历", ipa: "/ˌedʒuˈkeɪʃn/", pos: "n.", example: "Education is the foundation of a strong society.", synonyms: ["learning", "instruction", "schooling"] },
  "government": { chinese: "政府;治理", ipa: "/ˈɡʌvərnmənt/", pos: "n.", example: "The government announced a new policy.", synonyms: ["administration", "authority", "regime"] },
  "change": { chinese: "改变;变化;零钱", ipa: "/tʃeɪndʒ/", pos: "n./v.", example: "Climate change is a global challenge.", synonyms: ["alter", "modify", "transform"] },
  "beautiful": { chinese: "美丽的;漂亮的", ipa: "/ˈbjuːtɪfl/", pos: "adj.", example: "The garden looks beautiful in spring.", synonyms: ["lovely", "gorgeous", "attractive"] },
  "everyone": { chinese: "每个人;所有人", ipa: "/ˈevriwʌn/", pos: "pron.", example: "Everyone is welcome to join the meeting.", synonyms: ["everybody", "all"] },
  "lot": { chinese: "许多;大量;一块地", ipa: "/lɑːt/", pos: "n.", example: "There are a lot of books in the library.", synonyms: ["plenty", "abundance", "batch"] },
  "main": { chinese: "主要的;最重要的", ipa: "/meɪn/", pos: "adj.", example: "The main reason for the delay was the weather.", synonyms: ["primary", "chief", "principal"] },
  "decision": { chinese: "决定;决策;判断", ipa: "/dɪˈsɪʒn/", pos: "n.", example: "Making a good decision requires careful thought.", synonyms: ["choice", "judgment", "resolution"] },
  "common": { chinese: "常见的;共同的;普通的", ipa: "/ˈkɑːmən/", pos: "adj.", example: "It is common to see birds in the park.", synonyms: ["usual", "ordinary", "widespread"] },
  "business": { chinese: "商业;生意;事务", ipa: "/ˈbɪznəs/", pos: "n.", example: "He started his own business last year.", synonyms: ["commerce", "trade", "enterprise"] },
  "different": { chinese: "不同的;各种的", ipa: "/ˈdɪfrənt/", pos: "adj.", example: "People have different opinions on this topic.", synonyms: ["various", "diverse", "distinct"] },
  "health": { chinese: "健康;卫生", ipa: "/helθ/", pos: "n.", example: "Regular exercise is important for your health.", synonyms: ["wellness", "fitness", "well-being"] },
  "weather": { chinese: "天气;气候", ipa: "/ˈweðər/", pos: "n.", example: "The weather is warm and sunny today.", synonyms: ["climate", "conditions"] },
  "group": { chinese: "组;群;团体", ipa: "/ɡruːp/", pos: "n.", example: "A group of tourists visited the museum.", synonyms: ["team", "cluster", "assembly"] },
  "exam": { chinese: "考试;检查", ipa: "/ɪɡˈzæm/", pos: "n.", example: "She passed the final exam with high marks.", synonyms: ["test", "examination", "assessment"] },
  "job": { chinese: "工作;职业;任务", ipa: "/dʒɑːb/", pos: "n.", example: "Finding a good job is important for career growth.", synonyms: ["occupation", "position", "employment"] },
  "future": { chinese: "未来;将来;前途", ipa: "/ˈfjuːtʃər/", pos: "n./adj.", example: "We must plan carefully for the future.", synonyms: ["prospect", "upcoming", "forthcoming"] },
  "exercise": { chinese: "锻炼;练习;运动", ipa: "/ˈeksərsaɪz/", pos: "n./v.", example: "Daily exercise helps maintain good health.", synonyms: ["workout", "training", "practice"] },
  "morning": { chinese: "早晨;上午", ipa: "/ˈmɔːrnɪŋ/", pos: "n.", example: "I usually go for a run in the morning.", synonyms: ["dawn", "daybreak", "sunrise"] },
  "area": { chinese: "地区;区域;面积;领域", ipa: "/ˈeriə/", pos: "n.", example: "This area is known for its beautiful scenery.", synonyms: ["region", "zone", "district"] },
  "doctor": { chinese: "医生;博士", ipa: "/ˈdɑːktər/", pos: "n.", example: "The doctor advised him to rest for a week.", synonyms: ["physician", "specialist", "practitioner"] },
  "strong": { chinese: "强壮的;坚强的;强烈的", ipa: "/strɔːŋ/", pos: "adj.", example: "She has a strong desire to succeed.", synonyms: ["powerful", "robust", "intense"] },
  "finish": { chinese: "完成;结束", ipa: "/ˈfɪnɪʃ/", pos: "v./n.", example: "I need to finish this report by tomorrow.", synonyms: ["complete", "conclude", "end"] },
  "rain": { chinese: "雨;下雨", ipa: "/reɪn/", pos: "n./v.", example: "It started to rain in the afternoon.", synonyms: ["precipitation", "shower", "downpour"] },
  "success": { chinese: "成功;成就", ipa: "/səkˈses/", pos: "n.", example: "Hard work is the key to success.", synonyms: ["achievement", "triumph", "accomplishment"] },
  "report": { chinese: "报告;报道;汇报", ipa: "/rɪˈpɔːrt/", pos: "n./v.", example: "The report was submitted on time.", synonyms: ["account", "statement", "review"] },
  "difficult": { chinese: "困难的;艰难的", ipa: "/ˈdɪfɪkəlt/", pos: "adj.", example: "Learning a new language can be difficult.", synonyms: ["hard", "challenging", "tough"] },
  "law": { chinese: "法律;法规;定律", ipa: "/lɔː/", pos: "n.", example: "Everyone must obey the law.", synonyms: ["legislation", "regulation", "statute"] },
  "event": { chinese: "事件;活动;比赛项目", ipa: "/ɪˈvent/", pos: "n.", example: "The charity event raised a lot of money.", synonyms: ["occasion", "occurrence", "happening"] },
  "story": { chinese: "故事;叙述;新闻报道", ipa: "/ˈstɔːri/", pos: "n.", example: "She told the children a bedtime story.", synonyms: ["tale", "narrative", "account"] },
  "class": { chinese: "班级;课程;等级;种类", ipa: "/klæs/", pos: "n.", example: "The class starts at nine in the morning.", synonyms: ["lesson", "course", "category"] },
  "road": { chinese: "道路;公路;途径", ipa: "/roʊd/", pos: "n.", example: "The road was closed due to construction.", synonyms: ["street", "highway", "path"] },
  "goal": { chinese: "目标;球门;进球", ipa: "/ɡoʊl/", pos: "n.", example: "Setting clear goals helps you stay motivated.", synonyms: ["aim", "objective", "target"] },
  "follow": { chinese: "跟随;遵循;关注", ipa: "/ˈfɑːloʊ/", pos: "v.", example: "Please follow the instructions carefully.", synonyms: ["pursue", "trail", "obey"] },
  "language": { chinese: "语言;语言能力", ipa: "/ˈlæŋɡwɪdʒ/", pos: "n.", example: "Learning a new language opens many doors.", synonyms: ["tongue", "speech", "dialect"] },
  "family": { chinese: "家庭;家族;亲属", ipa: "/ˈfæməli/", pos: "n.", example: "Family is the most important thing in life.", synonyms: ["household", "relatives", "kin"] },
  "modern": { chinese: "现代的;近代的;新式的", ipa: "/ˈmɑːdərn/", pos: "adj.", example: "Modern technology has changed our daily lives.", synonyms: ["contemporary", "current", "recent"] },
  "carefully": { chinese: "仔细地;小心地", ipa: "/ˈkerflɪ/", pos: "adv.", example: "Please read the instructions carefully.", synonyms: ["cautiously", "attentively", "thoroughly"] },
  "public": { chinese: "公共的;公众的;公开的", ipa: "/ˈpʌblɪk/", pos: "adj./n.", example: "The park is open to the public.", synonyms: ["communal", "civic", "open"] },
  "important": { chinese: "重要的;有重大影响的", ipa: "/ɪmˈpɔːrtənt/", pos: "adj.", example: "It is important to eat a balanced diet.", synonyms: ["significant", "crucial", "vital"] },
  "friend": { chinese: "朋友;友人", ipa: "/frend/", pos: "n.", example: "A true friend is always there for you.", synonyms: ["companion", "buddy", "ally"] },
  "information": { chinese: "信息;情报;资料", ipa: "/ˌɪnfərˈmeɪʃn/", pos: "n.", example: "The website provides useful information.", synonyms: ["data", "knowledge", "details"] },
  "water": { chinese: "水;浇水", ipa: "/ˈwɔːtər/", pos: "n./v.", example: "Please remember to water the plants.", synonyms: ["liquid", "fluid"] },
  "city": { chinese: "城市;都市", ipa: "/ˈsɪti/", pos: "n.", example: "The city has many parks and museums.", synonyms: ["town", "metropolis", "urban area"] },
  "country": { chinese: "国家;乡村;农村", ipa: "/ˈkʌntri/", pos: "n.", example: "China is a country with a long history.", synonyms: ["nation", "state", "land"] },
  "experience": { chinese: "经验;经历;体验", ipa: "/ɪkˈspɪriəns/", pos: "n./v.", example: "Travel is the best way to gain experience.", synonyms: ["knowledge", "encounter", "involvement"] },
  "price": { chinese: "价格;代价", ipa: "/praɪs/", pos: "n.", example: "The price of oil has risen sharply.", synonyms: ["cost", "value", "charge"] },
  "young": { chinese: "年轻的;幼小的", ipa: "/jʌŋ/", pos: "adj.", example: "Young people should exercise regularly.", synonyms: ["youthful", "juvenile", "adolescent"] },
  "idea": { chinese: "想法;主意;概念", ipa: "/aɪˈdiːə/", pos: "n.", example: "She came up with a brilliant idea.", synonyms: ["concept", "thought", "notion"] },
  "local": { chinese: "当地的;本地的;局部的", ipa: "/ˈloʊkl/", pos: "adj.", example: "The local market sells fresh vegetables.", synonyms: ["regional", "neighborhood", "native"] },
  "food": { chinese: "食物;食品", ipa: "/fuːd/", pos: "n.", example: "Healthy food is essential for a good life.", synonyms: ["nourishment", "cuisine", "diet"] },
  "research": { chinese: "研究;调查", ipa: "/rɪˈsɜːrtʃ/", pos: "n./v.", example: "The professor is conducting research on climate change.", synonyms: ["study", "investigation", "inquiry"] },
  "free": { chinese: "自由的;免费的;空闲的", ipa: "/friː/", pos: "adj./v.", example: "The museum offers free admission on weekends.", synonyms: ["liberate", "complimentary", "unrestricted"] },
  "answer": { chinese: "回答;答案;解答", ipa: "/ˈænsər/", pos: "n./v.", example: "Please answer the question in complete sentences.", synonyms: ["reply", "response", "solution"] },
  "children": { chinese: "孩子们;儿童", ipa: "/ˈtʃɪldrən/", pos: "n.", example: "The children played happily in the park.", synonyms: ["kids", "youngsters", "offspring"] },
  "school": { chinese: "学校;学派;上学", ipa: "/skuːl/", pos: "n.", example: "The school organized a science fair.", synonyms: ["academy", "institution", "college"] },
  "money": { chinese: "金钱;货币;财富", ipa: "/ˈmʌni/", pos: "n.", example: "Saving money is a good habit.", synonyms: ["cash", "funds", "currency"] },
  "air": { chinese: "空气;气氛;播送", ipa: "/er/", pos: "n.", example: "Fresh air is important for good health.", synonyms: ["atmosphere", "breeze", "wind"] },
  "training": { chinese: "训练;培训;锻炼", ipa: "/ˈtreɪnɪŋ/", pos: "n.", example: "The company provides training for new employees.", synonyms: ["instruction", "coaching", "education"] },
  "power": { chinese: "权力;力量;能源", ipa: "/ˈpaʊər/", pos: "n.", example: "Solar power is a clean energy source.", synonyms: ["strength", "authority", "force"] },
  "point": { chinese: "要点;得分;指向", ipa: "/pɔɪnt/", pos: "n./v.", example: "The main point of the lecture was clear.", synonyms: ["tip", "spot", "argument"] },
  "special": { chinese: "特殊的;特别的;专门的", ipa: "/ˈspeʃl/", pos: "adj.", example: "Today is a special day for our family.", synonyms: ["particular", "unique", "exceptional"] },
  "sense": { chinese: "感觉;意义;道理", ipa: "/sens/", pos: "n./v.", example: "It makes sense to save money for emergencies.", synonyms: ["feeling", "perception", "judgment"] },
  "sure": { chinese: "确定的;当然;一定", ipa: "/ʃʊr/", pos: "adj./adv.", example: "Make sure you lock the door before leaving.", synonyms: ["certain", "confident", "positive"] },
  "right": { chinese: "正确的;右边的;权利", ipa: "/raɪt/", pos: "adj./n.", example: "Everyone has the right to education.", synonyms: ["correct", "proper", "entitlement"] },
  "early": { chinese: "早的;提前的;初期的", ipa: "/ˈɜːrli/", pos: "adj./adv.", example: "She woke up early to prepare for the trip.", synonyms: ["premature", "initial", "advance"] },
  "best": { chinese: "最好的;最优秀的", ipa: "/best/", pos: "adj./adv.", example: "She is the best student in the class.", synonyms: ["finest", "greatest", "top"] },
  "number": { chinese: "数字;号码;数量", ipa: "/ˈnʌmbər/", pos: "n.", example: "A large number of people attended the event.", synonyms: ["figure", "amount", "quantity"] },
  "light": { chinese: "光;灯;轻的;点燃", ipa: "/laɪt/", pos: "n./adj./v.", example: "The room was filled with natural light.", synonyms: ["brightness", "illumination", "glow"] },
  "music": { chinese: "音乐;乐曲", ipa: "/ˈmjuːzɪk/", pos: "n.", example: "Listening to music helps me relax.", synonyms: ["melody", "harmony", "tune"] },
  "game": { chinese: "游戏;比赛;博弈", ipa: "/ɡeɪm/", pos: "n.", example: "The game was exciting from start to finish.", synonyms: ["match", "contest", "competition"] },
  "together": { chinese: "一起;共同;同时", ipa: "/təˈɡeðər/", pos: "adv.", example: "Let's work together to solve this problem.", synonyms: ["jointly", "collectively", "mutually"] },
  "possible": { chinese: "可能的;可行的", ipa: "/ˈpɑːsəbl/", pos: "adj.", example: "It is possible to learn a language in one year.", synonyms: ["feasible", "achievable", "likely"] },
  "hand": { chinese: "手;交给;帮助", ipa: "/hænd/", pos: "n./v.", example: "Please raise your hand if you have a question.", synonyms: ["palm", "fist", "assistance"] },
  "old": { chinese: "老的;旧的;古老的", ipa: "/oʊld/", pos: "adj.", example: "The old building has a lot of history.", synonyms: ["ancient", "aged", "elderly"] },
  "small": { chinese: "小的;少的;微小的", ipa: "/smɔːl/", pos: "adj.", example: "Even a small change can make a big difference.", synonyms: ["tiny", "little", "minor"] },
  "work": { chinese: "工作;起作用;著作", ipa: "/wɜːrk/", pos: "n./v.", example: "Hard work always pays off in the end.", synonyms: ["labor", "toil", "employment"] },
  "important": { chinese: "重要的;有意义的", ipa: "/ɪmˈpɔːrtənt/", pos: "adj.", example: "It is important to stay hydrated.", synonyms: ["significant", "crucial", "essential"] },
  "natural": { chinese: "自然的;天然的;正常的", ipa: "/ˈnætʃərəl/", pos: "adj.", example: "The park preserves natural habitats.", synonyms: ["organic", "innate", "genuine"] },
  "safe": { chinese: "安全的;保险箱", ipa: "/seɪf/", pos: "adj./n.", example: "Make sure the children are safe at all times.", synonyms: ["secure", "protected", "harmless"] },
  "top": { chinese: "顶部;最高的;超过", ipa: "/tɑːp/", pos: "n./adj./v.", example: "She reached the top of the mountain.", synonyms: ["peak", "summit", "apex"] },
  "patient": { chinese: "病人;耐心的", ipa: "/ˈpeɪʃnt/", pos: "n./adj.", example: "The doctor treated the patient with care.", synonyms: ["tolerant", "enduring", "calm"] },
  "part": { chinese: "部分;角色;参与", ipa: "/pɑːrt/", pos: "n./v.", example: "Reading is an important part of learning.", synonyms: ["portion", "section", "piece"] },
  "quickly": { chinese: "快速地;迅速地", ipa: "/ˈkwɪkli/", pos: "adv.", example: "She quickly finished her homework.", synonyms: ["rapidly", "swiftly", "promptly"] },
  "order": { chinese: "命令;订购;顺序;秩序", ipa: "/ˈɔːrdər/", pos: "n./v.", example: "The teacher asked students to sit in order.", synonyms: ["command", "sequence", "arrangement"] },
  "clean": { chinese: "干净的;清洁;打扫", ipa: "/kliːn/", pos: "adj./v.", example: "Please keep the classroom clean.", synonyms: ["tidy", "spotless", "pure"] },
  "situation": { chinese: "情况;形势;处境", ipa: "/ˌsɪtʃuˈeɪʃn/", pos: "n.", example: "We need to assess the situation before acting.", synonyms: ["circumstance", "condition", "scenario"] },
  "clear": { chinese: "清楚的;晴朗的;清除", ipa: "/klɪr/", pos: "adj./v.", example: "The sky was clear and blue.", synonyms: ["obvious", "transparent", "evident"] },
  "level": { chinese: "水平;等级;平坦的", ipa: "/ˈlevl/", pos: "n./adj.", example: "Her English level has improved greatly.", synonyms: ["degree", "standard", "rank"] },
  "place": { chinese: "地方;放置;名次", ipa: "/pleɪs/", pos: "n./v.", example: "This is a great place to study.", synonyms: ["location", "spot", "position"] },
  "cold": { chinese: "冷的;寒冷的;感冒", ipa: "/koʊld/", pos: "adj./n.", example: "The cold weather made everyone stay indoors.", synonyms: ["chilly", "freezing", "frigid"] },
  "true": { chinese: "真实的;正确的;忠实的", ipa: "/truː/", pos: "adj.", example: "Is it true that you are moving abroad?", synonyms: ["genuine", "authentic", "accurate"] },
  "cause": { chinese: "原因;引起;事业", ipa: "/kɔːz/", pos: "n./v.", example: "Pollution can cause serious health problems.", synonyms: ["reason", "origin", "trigger"] },
  "full": { chinese: "满的;完整的;充分的", ipa: "/fʊl/", pos: "adj.", example: "The bus was full of passengers.", synonyms: ["complete", "entire", "packed"] },
  "rest": { chinese: "休息;剩余部分;其余的", ipa: "/rest/", pos: "n./v.", example: "You should rest after a long day of work.", synonyms: ["relax", "remainder", "repose"] },
  "simple": { chinese: "简单的;朴素的;单纯的", ipa: "/ˈsɪmpl/", pos: "adj.", example: "The answer is quite simple.", synonyms: ["easy", "basic", "straightforward"] },
  "become": { chinese: "成为;变成;适合", ipa: "/bɪˈkʌm/", pos: "v.", example: "She wants to become a doctor.", synonyms: ["turn into", "grow", "develop"] },
  "name": { chinese: "名字;名称;命名", ipa: "/neɪm/", pos: "n./v.", example: "What is the name of this flower?", synonyms: ["title", "label", "designation"] },
  "fact": { chinese: "事实;实际;真相", ipa: "/fækt/", pos: "n.", example: "In fact, the project was completed ahead of schedule.", synonyms: ["truth", "reality", "certainty"] },
  "kind": { chinese: "种类;善良的;友好的", ipa: "/kaɪnd/", pos: "n./adj.", example: "What kind of music do you like?", synonyms: ["type", "sort", "generous"] },
  "bad": { chinese: "坏的;糟糕的;严重的", ipa: "/bæd/", pos: "adj.", example: "Smoking is bad for your health.", synonyms: ["poor", "terrible", "awful"] },
  "new": { chinese: "新的;新近的;不熟悉的", ipa: "/njuː/", pos: "adj.", example: "The company launched a new product.", synonyms: ["fresh", "novel", "recent"] },
  "care": { chinese: "关心;照顾;在意", ipa: "/ker/", pos: "n./v.", example: "She takes great care of her garden.", synonyms: ["concern", "attention", "caution"] },
  "deep": { chinese: "深的;深刻的;深深地", ipa: "/diːp/", pos: "adj./adv.", example: "The lake is very deep in the center.", synonyms: ["profound", "intense", "extensive"] },
  "happy": { chinese: "快乐的;幸福的;满意的", ipa: "/ˈhæpi/", pos: "adj.", example: "The children were happy to see their parents.", synonyms: ["joyful", "cheerful", "content"] },
  "late": { chinese: "迟的;晚的;最近的;已故的", ipa: "/leɪt/", pos: "adj./adv.", example: "Don't be late for the meeting.", synonyms: ["tardy", "overdue", "delayed"] },
  "thought": { chinese: "想法;思想;思考", ipa: "/θɔːt/", pos: "n.", example: "Give it some thought before you decide.", synonyms: ["idea", "reflection", "consideration"] },
  "least": { chinese: "最少的;最小的;至少", ipa: "/liːst/", pos: "adj./adv.", example: "At least fifty people attended the event.", synonyms: ["minimum", "smallest", "fewest"] },
  "fire": { chinese: "火;火灾;解雇;射击", ipa: "/faɪər/", pos: "n./v.", example: "The fire spread quickly through the building.", synonyms: ["blaze", "flame", "inferno"] },
  "human": { chinese: "人类的;人;人性的", ipa: "/ˈhjuːmən/", pos: "adj./n.", example: "Human rights must be protected.", synonyms: ["person", "individual", "mortal"] },
  "land": { chinese: "土地;陆地;着陆", ipa: "/lænd/", pos: "n./v.", example: "The plane will land in ten minutes.", synonyms: ["ground", "territory", "terrain"] },
  "rather": { chinese: "相当;宁愿;而不是", ipa: "/ˈræðər/", pos: "adv.", example: "I would rather stay home than go out.", synonyms: ["preferably", "instead", "fairly"] },
  "paper": { chinese: "纸;论文;报纸;文件", ipa: "/ˈpeɪpər/", pos: "n.", example: "Please write your answer on the paper.", synonyms: ["document", "sheet", "article"] },
  "high": { chinese: "高的;高级的;高度", ipa: "/haɪ/", pos: "adj./adv.", example: "The mountain is very high.", synonyms: ["tall", "elevated", "lofty"] },
  "real": { chinese: "真实的;实际的;真正的", ipa: "/riːl/", pos: "adj.", example: "This painting looks so real.", synonyms: ["actual", "genuine", "authentic"] },
  "age": { chinese: "年龄;时代;变老", ipa: "/eɪdʒ/", pos: "n./v.", example: "People of all ages can enjoy this activity.", synonyms: ["era", "epoch", "period"] },
  "later": { chinese: "后来;以后;较晚的", ipa: "/ˈleɪtər/", pos: "adv./adj.", example: "I will call you later.", synonyms: ["afterward", "subsequently", "following"] },
  "behind": { chinese: "在...后面;落后于", ipa: "/bɪˈhaɪnd/", pos: "prep./adv.", example: "The cat hid behind the sofa.", synonyms: ["after", "following", "trailing"] },
  "across": { chinese: "穿过;横穿;在对面", ipa: "/əˈkrɔːs/", pos: "prep./adv.", example: "She walked across the bridge.", synonyms: ["over", "through", "spanning"] },
  "along": { chinese: "沿着;一起;向前", ipa: "/əˈlɔːŋ/", pos: "prep./adv.", example: "We walked along the river bank.", synonyms: ["beside", "alongside", "throughout"] },
  "toward": { chinese: "朝;向;接近;对于", ipa: "/tɔːrd/", pos: "prep.", example: "She walked toward the exit.", synonyms: ["towards", "near", "approaching"] },
  "upon": { chinese: "在...上面;在...之后", ipa: "/əˈpɑːn/", pos: "prep.", example: "Once upon a time, there lived a king.", synonyms: ["on", "onto", "atop"] },
  "almost": { chinese: "几乎;差不多", ipa: "/ˈɔːlmoʊst/", pos: "adv.", example: "The project is almost complete.", synonyms: ["nearly", "approximately", "virtually"] },
  "around": { chinese: "周围;大约;到处", ipa: "/əˈraʊnd/", pos: "prep./adv.", example: "There are trees all around the house.", synonyms: ["surrounding", "nearby", "approximately"] },
  "long": { chinese: "长的;长期的;渴望", ipa: "/lɔːŋ/", pos: "adj./adv./v.", example: "It has been a long time since we last met.", synonyms: ["extended", "lengthy", "prolonged"] },
  "while": { chinese: "一会儿;虽然;在...期间", ipa: "/waɪl/", pos: "conj./n.", example: "Read a book while you wait.", synonyms: ["during", "whereas", "although"] },
  "without": { chinese: "没有;不;缺少", ipa: "/wɪˈðaʊt/", pos: "prep.", example: "You cannot succeed without effort.", synonyms: ["lacking", "minus", "devoid of"] },
  "since": { chinese: "自从;因为;既然", ipa: "/sɪns/", pos: "prep./conj.", example: "I have lived here since 2010.", synonyms: ["because", "from", "after"] },
  "among": { chinese: "在...之中;在...中间", ipa: "/əˈmʌŋ/", pos: "prep.", example: "She is popular among her classmates.", synonyms: ["amid", "between", "amongst"] },
  "against": { chinese: "反对;对着;靠着", ipa: "/əˈɡenst/", pos: "prep.", example: "She leaned against the wall.", synonyms: ["opposing", "versus", "contrary to"] },
  "whether": { chinese: "是否;不管;无论", ipa: "/ˈweðər/", pos: "conj.", example: "I don't know whether he will come.", synonyms: ["if", "regardless"] },
  "until": { chinese: "直到;在...之前", ipa: "/ənˈtɪl/", pos: "prep./conj.", example: "Wait here until I come back.", synonyms: ["till", "before", "up to"] },
  "though": { chinese: "虽然;尽管;不过", ipa: "/ðoʊ/", pos: "conj./adv.", example: "Though it was cold, they went for a walk.", synonyms: ["although", "however", "nevertheless"] },
  "however": { chinese: "然而;不过;无论如何", ipa: "/haʊˈevər/", pos: "adv.", example: "The task was difficult; however, she succeeded.", synonyms: ["nevertheless", "nonetheless", "yet"] },
  "perhaps": { chinese: "也许;可能;大概", ipa: "/pərˈhæps/", pos: "adv.", example: "Perhaps we should try a different approach.", synonyms: ["maybe", "possibly", "potentially"] },
  "able": { chinese: "能够;有能力的", ipa: "/ˈeɪbl/", pos: "adj.", example: "She was able to solve the problem quickly.", synonyms: ["capable", "competent", "qualified"] },
  "either": { chinese: "两者之一;也(不)", ipa: "/ˈiːðər/", pos: "adj./pron./conj.", example: "You can sit on either side of the table.", synonyms: ["both", "each", "any"] },
  "else": { chinese: "其他的;别的;否则", ipa: "/els/", pos: "adv.", example: "What else would you like to know?", synonyms: ["otherwise", "alternatively", "additionally"] },
  "far": { chinese: "远的;遥远的;远远地", ipa: "/fɑːr/", pos: "adj./adv.", example: "The school is not far from my house.", synonyms: ["distant", "remote", "faraway"] },
  "past": { chinese: "过去的;经过;过去", ipa: "/pæst/", pos: "adj./n./prep.", example: "In the past, people traveled by horse.", synonyms: ["former", "previous", "bygone"] },
  "outside": { chinese: "外面;外部;在...外面", ipa: "/ˌaʊtˈsaɪd/", pos: "n./adj./prep./adv.", example: "The children played outside all afternoon.", synonyms: ["exterior", "outer", "external"] },
  "nearly": { chinese: "几乎;将近;差不多", ipa: "/ˈnɪrli/", pos: "adv.", example: "The project is nearly complete.", synonyms: ["almost", "approximately", "virtually"] },
  "within": { chinese: "在...之内;不超过", ipa: "/wɪˈðɪn/", pos: "prep./adv.", example: "The task must be completed within a week.", synonyms: ["inside", "in", "during"] },
  "actually": { chinese: "实际上;事实上;竟然", ipa: "/ˈæktʃuəli/", pos: "adv.", example: "She actually enjoyed the lecture.", synonyms: ["really", "truly", "indeed"] },
  "whole": { chinese: "整个的;全部的;完整的", ipa: "/hoʊl/", pos: "adj./n.", example: "The whole class passed the exam.", synonyms: ["entire", "complete", "total"] },
  "reason": { chinese: "原因;理由;理性", ipa: "/ˈriːzn/", pos: "n.", example: "There must be a reason for his absence.", synonyms: ["cause", "motive", "explanation"] },
  "matter": { chinese: "事情;问题;物质;要紧", ipa: "/ˈmætər/", pos: "n./v.", example: "What's the matter with you?", synonyms: ["issue", "subject", "substance"] },
  "face": { chinese: "脸;面对;表面", ipa: "/feɪs/", pos: "n./v.", example: "We must face the challenges ahead.", synonyms: ["visage", "confront", "surface"] },
  "hour": { chinese: "小时;时刻", ipa: "/aʊər/", pos: "n.", example: "The meeting lasted for one hour.", synonyms: ["period", "time"] },
  "example": { chinese: "例子;榜样;实例", ipa: "/ɪɡˈzæmpl/", pos: "n.", example: "Please give me an example.", synonyms: ["instance", "sample", "model"] },
  "several": { chinese: "几个的;一些;各自的", ipa: "/ˈsevrəl/", pos: "adj.", example: "Several students raised their hands.", synonyms: ["some", "a few", "various"] },
  "already": { chinese: "已经;早已", ipa: "/ɔːlˈredi/", pos: "adv.", example: "I have already finished my homework.", synonyms: ["previously", "before", "yet"] },
  "certain": { chinese: "确定的;某些;必然的", ipa: "/ˈsɜːrtn/", pos: "adj.", example: "I am certain that he will come.", synonyms: ["sure", "definite", "particular"] },
  "attention": { chinese: "注意;注意力;关注", ipa: "/əˈtenʃn/", pos: "n.", example: "Pay attention to the teacher.", synonyms: ["focus", "concentration", "notice"] },
  "especially": { chinese: "尤其;特别;格外", ipa: "/ɪˈspeʃəli/", pos: "adv.", example: "I love fruits, especially apples.", synonyms: ["particularly", "notably", "specifically"] },
  "either": { chinese: "两者之一;也(不)", ipa: "/ˈiːðər/", pos: "adj./conj.", example: "Either option is acceptable.", synonyms: ["each", "any"] },
  "quickly": { chinese: "快速地;迅速地", ipa: "/ˈkwɪkli/", pos: "adv.", example: "He quickly realized his mistake.", synonyms: ["rapidly", "swiftly", "promptly"] },
  "issue": { chinese: "问题;议题;发行", ipa: "/ˈɪʃuː/", pos: "n./v.", example: "Climate change is a global issue.", synonyms: ["problem", "matter", "concern"] },
  "activity": { chinese: "活动;行动;活跃", ipa: "/ækˈtɪvəti/", pos: "n.", example: "Outdoor activity is good for health.", synonyms: ["action", "exercise", "pursuit"] },
  "practice": { chinese: "练习;实践;惯例", ipa: "/ˈpræktɪs/", pos: "n./v.", example: "Practice makes perfect.", synonyms: ["exercise", "training", "rehearsal"] },
  "necessary": { chinese: "必要的;必需的;必然的", ipa: "/ˈnesəseri/", pos: "adj.", example: "It is necessary to follow the rules.", synonyms: ["essential", "required", "vital"] },
  "social": { chinese: "社会的;社交的", ipa: "/ˈsoʊʃl/", pos: "adj.", example: "Social media has changed communication.", synonyms: ["communal", "public", "collective"] },
  "concern": { chinese: "关注;担心;涉及", ipa: "/kənˈsɜːrn/", pos: "n./v.", example: "Environmental pollution is a major concern.", synonyms: ["worry", "anxiety", "issue"] },
  "opportunity": { chinese: "机会;时机", ipa: "/ˌɑːpərˈtjuːnəti/", pos: "n.", example: "This is a great opportunity to learn.", synonyms: ["chance", "opening", "prospect"] },
  "personal": { chinese: "个人的;私人的;亲自的", ipa: "/ˈpɜːrsənl/", pos: "adj.", example: "Keep your personal belongings safe.", synonyms: ["private", "individual", "own"] },
  "able": { chinese: "能够的;有能力的", ipa: "/ˈeɪbl/", pos: "adj.", example: "Students should be able to think critically.", synonyms: ["capable", "competent", "skilled"] },
  "produce": { chinese: "生产;制造;产品", ipa: "/prəˈdjuːs/", pos: "v./n.", example: "This factory can produce 1000 units per day.", synonyms: ["create", "manufacture", "generate"] },
  "reason": { chinese: "原因;理由;推理", ipa: "/ˈriːzn/", pos: "n./v.", example: "The reason for the delay was unclear.", synonyms: ["cause", "motive", "rationale"] },
  "piece": { chinese: "片;块;一件;作品", ipa: "/piːs/", pos: "n.", example: "She wrote a beautiful piece of music.", synonyms: ["part", "portion", "fragment"] },
  "nature": { chinese: "自然;本性;性质", ipa: "/ˈneɪtʃər/", pos: "n.", example: "Nature provides us with clean air and water.", synonyms: ["environment", "world", "character"] },
  "condition": { chinese: "条件;状况;情况", ipa: "/kənˈdɪʃn/", pos: "n.", example: "The car is in excellent condition.", synonyms: ["state", "situation", "circumstance"] },
  "account": { chinese: "账户;描述;解释", ipa: "/əˈkaʊnt/", pos: "n./v.", example: "She opened a bank account.", synonyms: ["report", "description", "record"] },
  "development": { chinese: "发展;开发;进展", ipa: "/dɪˈveləpmənt/", pos: "n.", example: "Economic development is important for any country.", synonyms: ["growth", "progress", "advancement"] },
  "movement": { chinese: "运动;移动;活动", ipa: "/ˈmuːvmənt/", pos: "n.", example: "The movement for equality gained momentum.", synonyms: ["motion", "action", "campaign"] },
  "completely": { chinese: "完全地;彻底地", ipa: "/kəmˈpliːtli/", pos: "adv.", example: "The task was completely finished.", synonyms: ["entirely", "totally", "fully"] },
  "seriously": { chinese: "认真地;严肃地;严重地", ipa: "/ˈsɪriəsli/", pos: "adv.", example: "You should take this matter seriously.", synonyms: ["earnestly", "gravely", "sincerely"] },
  "organization": { chinese: "组织;机构;团体", ipa: "/ˌɔːrɡənəˈzeɪʃn/", pos: "n.", example: "The organization helps homeless people.", synonyms: ["institution", "association", "agency"] },
  "knowledge": { chinese: "知识;了解;学问", ipa: "/ˈnɑːlɪdʒ/", pos: "n.", example: "Knowledge is the key to success.", synonyms: ["understanding", "awareness", "wisdom"] },
  "available": { chinese: "可用的;可获得的;有空的", ipa: "/əˈveɪləbl/", pos: "adj.", example: "Is this book available in the library?", synonyms: ["accessible", "obtainable", "free"] },
  "interest": { chinese: "兴趣;利息;利益", ipa: "/ˈɪntrəst/", pos: "n./v.", example: "She has a strong interest in science.", synonyms: ["curiosity", "concern", "stake"] },
  "value": { chinese: "价值;价值观;评价", ipa: "/ˈvæljuː/", pos: "n./v.", example: "Education has great value in society.", synonyms: ["worth", "merit", "importance"] },
  "action": { chinese: "行动;行为;作用", ipa: "/ˈækʃn/", pos: "n.", example: "We need to take action immediately.", synonyms: ["deed", "activity", "measure"] },
  "quality": { chinese: "质量;品质;优质的", ipa: "/ˈkwɑːləti/", pos: "n./adj.", example: "This product is of high quality.", synonyms: ["standard", "grade", "caliber"] },
  "directly": { chinese: "直接地;径直;立即", ipa: "/dəˈrektli/", pos: "adv.", example: "Please contact the manager directly.", synonyms: ["immediately", "straight", "promptly"] },
  "fair": { chinese: "公平的;博览会;相当的", ipa: "/fer/", pos: "adj./n.", example: "The judge made a fair decision.", synonyms: ["just", "equitable", "impartial"] },
  "proper": { chinese: "适当的;正确的;正式的", ipa: "/ˈprɑːpər/", pos: "adj.", example: "Please use proper grammar in your essay.", synonyms: ["appropriate", "suitable", "correct"] },
  "lack": { chinese: "缺乏;不足;缺少", ipa: "/læk/", pos: "n./v.", example: "Lack of sleep can affect your health.", synonyms: ["shortage", "deficiency", "absence"] },
  "treat": { chinese: "对待;治疗;请客;款待", ipa: "/triːt/", pos: "v./n.", example: "You should treat everyone with respect.", synonyms: ["handle", "cure", "deal with"] },
  "waste": { chinese: "浪费;废物;废弃的", ipa: "/weɪst/", pos: "v./n./adj.", example: "Don't waste your time on useless things.", synonyms: ["squander", "trash", "garbage"] },
  "data": { chinese: "数据;资料;信息", ipa: "/ˈdeɪtə/", pos: "n.", example: "The data shows a clear trend.", synonyms: ["information", "facts", "statistics"] },
  "protect": { chinese: "保护;防护;维护", ipa: "/prəˈtekt/", pos: "v.", example: "We must protect the environment.", synonyms: ["defend", "guard", "shield"] },
  "solve": { chinese: "解决;解答;解释", ipa: "/sɑːlv/", pos: "v.", example: "We need to solve this problem together.", synonyms: ["resolve", "fix", "work out"] },
  "increase": { chinese: "增加;增长;增大", ipa: "/ɪnˈkriːs/", pos: "v./n.", example: "The company plans to increase production.", synonyms: ["grow", "rise", "expand"] },
  "reduce": { chinese: "减少;降低;缩小", ipa: "/rɪˈdjuːs/", pos: "v.", example: "We should reduce waste to protect the environment.", synonyms: ["decrease", "lower", "diminish"] },
  "raise": { chinese: "提高;举起;筹集;养育", ipa: "/reɪz/", pos: "v.", example: "They worked hard to raise money for charity.", synonyms: ["lift", "elevate", "increase"] },
  "spend": { chinese: "花费;度过;用尽", ipa: "/spend/", pos: "v.", example: "How much time do you spend studying?", synonyms: ["use", "devote", "consume"] },
  "prepare": { chinese: "准备;预备;编制", ipa: "/prɪˈper/", pos: "v.", example: "Students should prepare for the exam.", synonyms: ["ready", "arrange", "plan"] },
  "offer": { chinese: "提供;出价;主动提出", ipa: "/ˈɔːfər/", pos: "v./n.", example: "The company offered him a good salary.", synonyms: ["provide", "propose", "present"] },
  "explain": { chinese: "解释;说明;阐述", ipa: "/ɪkˈspleɪn/", pos: "v.", example: "Can you explain this concept to me?", synonyms: ["clarify", "describe", "illustrate"] },
  "suppose": { chinese: "假设;认为;猜想", ipa: "/səˈpoʊz/", pos: "v.", example: "I suppose you are right about this.", synonyms: ["assume", "presume", "believe"] },
  "fill": { chinese: "填充;装满;充满", ipa: "/fɪl/", pos: "v.", example: "Please fill in the application form.", synonyms: ["load", "stuff", "complete"] },
  "wonder": { chinese: "想知道;惊奇;奇迹", ipa: "/ˈwʌndər/", pos: "v./n.", example: "I wonder what the weather will be like tomorrow.", synonyms: ["ponder", "marvel", "curiosity"] },
  "imagine": { chinese: "想象;设想;料想", ipa: "/ɪˈmædʒɪn/", pos: "v.", example: "Can you imagine life without the internet?", synonyms: ["envision", "visualize", "conceive"] },
  "accept": { chinese: "接受;承认;同意", ipa: "/əkˈsept/", pos: "v.", example: "She decided to accept the job offer.", synonyms: ["receive", "approve", "agree"] },
  "save": { chinese: "救;节省;保存;储蓄", ipa: "/seɪv/", pos: "v.", example: "We should save water for the future.", synonyms: ["rescue", "preserve", "conserve"] },
  "notice": { chinese: "注意到;通知;公告", ipa: "/ˈnoʊtɪs/", pos: "v./n.", example: "Did you notice the new painting on the wall?", synonyms: ["observe", "detect", "announcement"] },
  "serve": { chinese: "服务;服役;供应", ipa: "/sɜːrv/", pos: "v.", example: "The restaurant serves delicious food.", synonyms: ["assist", "provide", "cater"] },
  "pick": { chinese: "挑选;采摘;拾起", ipa: "/pɪk/", pos: "v.", example: "Please pick a color for the wall.", synonyms: ["choose", "select", "gather"] },
  "likely": { chinese: "可能的;很可能", ipa: "/ˈlaɪkli/", pos: "adj./adv.", example: "It is likely to rain tomorrow.", synonyms: ["probable", "expected", "possible"] },
  "poor": { chinese: "贫穷的;可怜的;差的", ipa: "/pʊr/", pos: "adj.", example: "The poor child had nothing to eat.", synonyms: ["impoverished", "needy", "inferior"] },
  "basic": { chinese: "基本的;基础的;初级的", ipa: "/ˈbeɪsɪk/", pos: "adj.", example: "Learning basic skills is important.", synonyms: ["fundamental", "elementary", "essential"] },
  "immediately": { chinese: "立即;马上;直接地", ipa: "/ɪˈmiːdiətli/", pos: "adv.", example: "Please respond immediately.", synonyms: ["instantly", "promptly", "right away"] },
  "progress": { chinese: "进步;进展;发展", ipa: "/ˈprɑːɡres/", pos: "n./v.", example: "The student has made great progress.", synonyms: ["advancement", "improvement", "development"] },
  "significant": { chinese: "重要的;显著的;有意义的", ipa: "/sɪɡˈnɪfɪkənt/", pos: "adj.", example: "The discovery was significant for science.", synonyms: ["important", "notable", "meaningful"] },
  "generally": { chinese: "通常;一般地;普遍地", ipa: "/ˈdʒenrəli/", pos: "adv.", example: "People generally prefer warm weather.", synonyms: ["usually", "typically", "commonly"] },
  "spread": { chinese: "传播;展开;蔓延", ipa: "/spred/", pos: "v./n.", example: "The news spread quickly through the town.", synonyms: ["disseminate", "expand", "distribute"] },
  "recently": { chinese: "最近;近来;不久前", ipa: "/ˈriːsntli/", pos: "adv.", example: "She recently graduated from university.", synonyms: ["lately", "newly", "just"] },
  "agree": { chinese: "同意;赞成;一致", ipa: "/əˈɡriː/", pos: "v.", example: "I agree with your suggestion.", synonyms: ["concur", "consent", "approve"] },
  "original": { chinese: "最初的;原创的;独特的", ipa: "/əˈrɪdʒənl/", pos: "adj./n.", example: "The original painting is in the museum.", synonyms: ["initial", "first", "authentic"] },
  "eventually": { chinese: "最终;终于;最后", ipa: "/ɪˈventʃuəli/", pos: "adv.", example: "She eventually found a solution to the problem.", synonyms: ["finally", "ultimately", "in the end"] },
  "purpose": { chinese: "目的;意图;用途", ipa: "/ˈpɜːrpəs/", pos: "n.", example: "The purpose of the meeting is to discuss the budget.", synonyms: ["aim", "goal", "intention"] },
  "prevent": { chinese: "阻止;防止;预防", ipa: "/prɪˈvent/", pos: "v.", example: "Vaccines help prevent diseases.", synonyms: ["stop", "avoid", "hinder"] },
  "complex": { chinese: "复杂的;综合的;复合体", ipa: "/ˈkɑːmpleks/", pos: "adj./n.", example: "The issue is more complex than we thought.", synonyms: ["complicated", "intricate", "elaborate"] },
  "regular": { chinese: "规律的;定期的;常规的", ipa: "/ˈreɡjələr/", pos: "adj.", example: "Regular exercise keeps you healthy.", synonyms: ["routine", "consistent", "steady"] },
  "avoid": { chinese: "避免;回避;逃避", ipa: "/əˈvɔɪd/", pos: "v.", example: "Try to avoid eating too much sugar.", synonyms: ["evade", "prevent", "escape"] },
  "individual": { chinese: "个人;个体;个别的", ipa: "/ˌɪndɪˈvɪdʒuəl/", pos: "n./adj.", example: "Each individual has unique talents.", synonyms: ["person", "single", "separate"] },
  "effort": { chinese: "努力;力气;尝试", ipa: "/ˈefərt/", pos: "n.", example: "It takes a lot of effort to learn a new skill.", synonyms: ["attempt", "endeavor", "exertion"] },
  "positive": { chinese: "积极的;正面的;确定的", ipa: "/ˈpɑːzətɪv/", pos: "adj.", example: "A positive attitude can change your life.", synonyms: ["optimistic", "constructive", "favorable"] },
  "damage": { chinese: "损害;破坏;损失", ipa: "/ˈdæmɪdʒ/", pos: "n./v.", example: "The storm caused serious damage to the building.", synonyms: ["harm", "destruction", "injury"] },
  "effective": { chinese: "有效的;起作用的", ipa: "/ɪˈfektɪv/", pos: "adj.", example: "The new policy proved to be very effective.", synonyms: ["efficient", "successful", "productive"] },
  "seriously": { chinese: "认真地;严重地", ipa: "/ˈsɪriəsli/", pos: "adv.", example: "You need to take this issue seriously.", synonyms: ["gravely", "earnestly", "sincerely"] },
  "major": { chinese: "主要的;重大的;专业", ipa: "/ˈmeɪdʒər/", pos: "adj./n.", example: "This is a major achievement for the team.", synonyms: ["significant", "primary", "key"] },
  "especially": { chinese: "尤其;特别", ipa: "/ɪˈspeʃəli/", pos: "adv.", example: "I love animals, especially dogs.", synonyms: ["particularly", "notably", "specifically"] },
  "instead": { chinese: "代替;反而;相反", ipa: "/ɪnˈsted/", pos: "adv.", example: "I'll have tea instead of coffee.", synonyms: ["alternatively", "rather", "preferably"] },
  "whose": { chinese: "谁的;哪一个人的", ipa: "/huːz/", pos: "pron.", example: "Whose book is this on the table?", synonyms: [] },
  "entire": { chinese: "全部的;整个的;完全的", ipa: "/ɪnˈtaɪər/", pos: "adj.", example: "The entire team worked hard on the project.", synonyms: ["whole", "complete", "total"] },
  "scene": { chinese: "场景;现场;景色", ipa: "/siːn/", pos: "n.", example: "The police arrived at the scene quickly.", synonyms: ["view", "setting", "site"] },
  "force": { chinese: "力;武力;强迫", ipa: "/fɔːrs/", pos: "n./v.", example: "The force of the wind was very strong.", synonyms: ["power", "strength", "compel"] },
  "demand": { chinese: "需求;要求;需要", ipa: "/dɪˈmænd/", pos: "n./v.", example: "The demand for clean energy is growing.", synonyms: ["request", "requirement", "need"] },
  "risk": { chinese: "风险;危险;冒险", ipa: "/rɪsk/", pos: "n./v.", example: "There is a risk of flooding in this area.", synonyms: ["danger", "hazard", "threat"] },
  "skill": { chinese: "技能;技巧;本领", ipa: "/skɪl/", pos: "n.", example: "Communication is an important skill.", synonyms: ["ability", "talent", "expertise"] },
  "result": { chinese: "结果;成绩;导致", ipa: "/rɪˈzʌlt/", pos: "n./v.", example: "The result of the experiment was surprising.", synonyms: ["outcome", "consequence", "effect"] },
  "discover": { chinese: "发现;发觉;了解到", ipa: "/dɪsˈkʌvər/", pos: "v.", example: "Scientists continue to discover new species.", synonyms: ["find", "detect", "uncover"] },
  "remain": { chinese: "保持;剩余;留下", ipa: "/rɪˈmeɪn/", pos: "v.", example: "Please remain seated until the bus stops.", synonyms: ["stay", "continue", "persist"] },
  "exist": { chinese: "存在;生存;生活", ipa: "/ɪɡˈzɪst/", pos: "v.", example: "Many ancient customs still exist today.", synonyms: ["be", "survive", "live"] },
  "original": { chinese: "原始的;原创的;独特的", ipa: "/əˈrɪdʒənl/", pos: "adj.", example: "This is the original version of the song.", synonyms: ["initial", "authentic", "primary"] },
  "apply": { chinese: "申请;应用;涂抹", ipa: "/əˈplaɪ/", pos: "v.", example: "She decided to apply for the scholarship.", synonyms: ["request", "utilize", "implement"] },
  "express": { chinese: "表达;快递;表示", ipa: "/ɪkˈspres/", pos: "v./adj./n.", example: "He expressed his feelings clearly.", synonyms: ["convey", "communicate", "state"] },
  "current": { chinese: "当前的;流通的;水流;电流", ipa: "/ˈkɜːrənt/", pos: "adj./n.", example: "The current situation requires immediate action.", synonyms: ["present", "ongoing", "modern"] },
  "amount": { chinese: "数量;金额;总数", ipa: "/əˈmaʊnt/", pos: "n./v.", example: "The amount of homework has increased.", synonyms: ["quantity", "sum", "total"] },
  "reach": { chinese: "到达;伸手;达到", ipa: "/riːtʃ/", pos: "v./n.", example: "We need to reach an agreement.", synonyms: ["arrive", "attain", "achieve"] },
  "basic": { chinese: "基本的;初级的;基础的", ipa: "/ˈbeɪsɪk/", pos: "adj.", example: "Everyone should learn basic first aid.", synonyms: ["fundamental", "elementary", "essential"] },
  "encourage": { chinese: "鼓励;激励;促进", ipa: "/ɪnˈkɜːrɪdʒ/", pos: "v.", example: "Teachers should encourage students to ask questions.", synonyms: ["motivate", "inspire", "support"] },
  "society": { chinese: "社会;团体;社交界", ipa: "/səˈsaɪəti/", pos: "n.", example: "Education benefits the whole society.", synonyms: ["community", "civilization", "public"] },
  "opinion": { chinese: "意见;看法;主张", ipa: "/əˈpɪnjən/", pos: "n.", example: "Everyone has a right to express their opinion.", synonyms: ["view", "belief", "judgment"] },
  "create": { chinese: "创造;创建;引起", ipa: "/kriˈeɪt/", pos: "v.", example: "The artist wants to create something unique.", synonyms: ["make", "produce", "design"] },
  "consider": { chinese: "考虑;认为;看作", ipa: "/kənˈsɪdər/", pos: "v.", example: "Please consider all the options before deciding.", synonyms: ["think about", "contemplate", "ponder"] },
  "achieve": { chinese: "实现;达到;取得", ipa: "/əˈtʃiːv/", pos: "v.", example: "She worked hard to achieve her goals.", synonyms: ["accomplish", "attain", "reach"] },
  "receive": { chinese: "收到;接待;接受", ipa: "/rɪˈsiːv/", pos: "v.", example: "I was happy to receive your letter.", synonyms: ["get", "obtain", "accept"] },
  "maintain": { chinese: "维持;保养;坚持", ipa: "/meɪnˈteɪn/", pos: "v.", example: "It is important to maintain a healthy lifestyle.", synonyms: ["keep", "preserve", "sustain"] },
  "loss": { chinese: "损失;丧失;亏损", ipa: "/lɔːs/", pos: "n.", example: "The loss of biodiversity is a serious issue.", synonyms: ["defeat", "deprivation", "reduction"] },
  "mention": { chinese: "提到;提及;说起", ipa: "/ˈmenʃn/", pos: "v./n.", example: "Did she mention the time of the meeting?", synonyms: ["refer to", "cite", "note"] },
  "resource": { chinese: "资源;财力;办法", ipa: "/ˈriːsɔːrs/", pos: "n.", example: "Water is a precious natural resource.", synonyms: ["asset", "supply", "material"] },
  "variety": { chinese: "多样性;种类;变化", ipa: "/vəˈraɪəti/", pos: "n.", example: "The market offers a wide variety of fruits.", synonyms: ["diversity", "range", "assortment"] },
  "throughout": { chinese: "贯穿;遍及;从头到尾", ipa: "/θruːˈaʊt/", pos: "prep./adv.", example: "The museum is open throughout the year.", synonyms: ["across", "during", "all over"] },
  "independent": { chinese: "独立的;自主的;不受约束的", ipa: "/ˌɪndɪˈpendənt/", pos: "adj.", example: "She is a very independent person.", synonyms: ["autonomous", "self-reliant", "free"] },
  "influence": { chinese: "影响;势力;感化", ipa: "/ˈɪnfluəns/", pos: "n./v.", example: "Parents have a big influence on their children.", synonyms: ["effect", "impact", "power"] },
  "simply": { chinese: "简单地;仅仅;朴素地", ipa: "/ˈsɪmpli/", pos: "adv.", example: "I simply don't understand this problem.", synonyms: ["merely", "just", "plainly"] },
  "thus": { chinese: "因此;如此;这样", ipa: "/ðʌs/", pos: "adv.", example: "He studied hard and thus passed the exam.", synonyms: ["therefore", "consequently", "hence"] },
  "indeed": { chinese: "确实;的确;实际上", ipa: "/ɪnˈdiːd/", pos: "adv.", example: "She is indeed a talented musician.", synonyms: ["truly", "certainly", "really"] },
  "rapidly": { chinese: "迅速地;快速地", ipa: "/ˈræpɪdli/", pos: "adv.", example: "Technology is changing rapidly.", synonyms: ["quickly", "swiftly", "speedily"] },
  "feature": { chinese: "特征;特点;特写", ipa: "/ˈfiːtʃər/", pos: "n./v.", example: "The main feature of the phone is its camera.", synonyms: ["characteristic", "trait", "attribute"] },
  "include": { chinese: "包括;包含;列入", ipa: "/ɪnˈkluːd/", pos: "v.", example: "The price includes breakfast.", synonyms: ["contain", "comprise", "incorporate"] },
  "range": { chinese: "范围;幅度;种类;排列", ipa: "/reɪndʒ/", pos: "n./v.", example: "A wide range of books is available.", synonyms: ["scope", "extent", "variety"] },
  "response": { chinese: "回应;反应;答复", ipa: "/rɪˈspɑːns/", pos: "n.", example: "The company issued a quick response.", synonyms: ["reply", "answer", "reaction"] },
  "responsible": { chinese: "负责的;有责任的;可靠的", ipa: "/rɪˈspɑːnsəbl/", pos: "adj.", example: "Everyone is responsible for their own actions.", synonyms: ["accountable", "reliable", "liable"] },
  "market": { chinese: "市场;销售;行情", ipa: "/ˈmɑːrkɪt/", pos: "n./v.", example: "The stock market fell sharply yesterday.", synonyms: ["bazaar", "trade", "commerce"] },
  "power": { chinese: "力量;权力;能量", ipa: "/ˈpaʊər/", pos: "n.", example: "Knowledge gives people power.", synonyms: ["strength", "authority", "energy"] },
  "period": { chinese: "时期;句号;时间", ipa: "/ˈpɪriəd/", pos: "n.", example: "This was a difficult period in history.", synonyms: ["era", "phase", "duration"] },
  "century": { chinese: "世纪;百年", ipa: "/ˈsentʃəri/", pos: "n.", example: "We are now in the 21st century.", synonyms: ["era", "age", "epoch"] },
  "task": { chinese: "任务;工作;作业", ipa: "/tæsk/", pos: "n.", example: "Completing this task requires teamwork.", synonyms: ["duty", "assignment", "job"] },
  "negative": { chinese: "消极的;否定的;负的", ipa: "/ˈneɡətɪv/", pos: "adj./n.", example: "Try not to have a negative attitude.", synonyms: ["pessimistic", "unfavorable", "adverse"] },
  "rely": { chinese: "依赖;依靠;信赖", ipa: "/rɪˈlaɪ/", pos: "v.", example: "You can always rely on your friends.", synonyms: ["depend", "trust", "count on"] },
  "respect": { chinese: "尊重;尊敬;方面", ipa: "/rɪˈspekt/", pos: "n./v.", example: "We should respect other people's opinions.", synonyms: ["honor", "esteem", "admire"] },
  "expect": { chinese: "期望;预料;等待", ipa: "/ɪkˈspekt/", pos: "v.", example: "I expect the results to be positive.", synonyms: ["anticipate", "foresee", "await"] },
  "term": { chinese: "学期;术语;条件;期限", ipa: "/tɜːrm/", pos: "n.", example: "The term paper is due next week.", synonyms: ["word", "expression", "period"] },
  "huge": { chinese: "巨大的;庞大的", ipa: "/hjuːdʒ/", pos: "adj.", example: "The project was a huge success.", synonyms: ["enormous", "massive", "immense"] },
  "apparently": { chinese: "显然;似乎;表面上", ipa: "/əˈpærəntli/", pos: "adv.", example: "Apparently, the meeting has been canceled.", synonyms: ["seemingly", "evidently", "clearly"] },
  "merely": { chinese: "仅仅;只是;不过", ipa: "/ˈmɪrli/", pos: "adv.", example: "I was merely suggesting an alternative.", synonyms: ["only", "simply", "just"] },
  "essential": { chinese: "必要的;本质的;基本的", ipa: "/ɪˈsenʃl/", pos: "adj.", example: "Good communication is essential for teamwork.", synonyms: ["vital", "crucial", "fundamental"] },
  "critical": { chinese: "批评的;关键的;危急的", ipa: "/ˈkrɪtɪkl/", pos: "adj.", example: "Critical thinking is important in education.", synonyms: ["crucial", "vital", "important"] },
  "immediately": { chinese: "立即;直接地;紧接着", ipa: "/ɪˈmiːdiətli/", pos: "adv.", example: "Call the doctor immediately.", synonyms: ["instantly", "at once", "right away"] },
  "increasingly": { chinese: "越来越多地;日益", ipa: "/ɪnˈkriːsɪŋli/", pos: "adv.", example: "The world is becoming increasingly connected.", synonyms: ["progressively", "more and more", "gradually"] },
  "widely": { chinese: "广泛地;普遍地", ipa: "/ˈwaɪdli/", pos: "adv.", example: "English is widely spoken around the world.", synonyms: ["broadly", "extensively", "commonly"] },
  "moreover": { chinese: "此外;而且;再者", ipa: "/mɔːrˈoʊvər/", pos: "adv.", example: "The plan is effective; moreover, it is affordable.", synonyms: ["furthermore", "additionally", "besides"] },
  "obviously": { chinese: "明显地;显然", ipa: "/ˈɑːbviəsli/", pos: "adv.", example: "She was obviously tired after the long trip.", synonyms: ["clearly", "evidently", "plainly"] },
  "constant": { chinese: "不断的;恒定的;忠实的", ipa: "/ˈkɑːnstənt/", pos: "adj./n.", example: "The constant noise made it hard to concentrate.", synonyms: ["continuous", "steady", "persistent"] },
  "struggle": { chinese: "斗争;挣扎;努力", ipa: "/ˈstrʌɡl/", pos: "v./n.", example: "Many people struggle to find a good job.", synonyms: ["fight", "strive", "battle"] },
  "rare": { chinese: "稀有的;珍贵的;半熟的", ipa: "/rer/", pos: "adj.", example: "This is a rare opportunity.", synonyms: ["uncommon", "unusual", "scarce"] },
  "typically": { chinese: "通常;一般;典型地", ipa: "/ˈtɪpɪkli/", pos: "adv.", example: "I typically wake up at 7 am.", synonyms: ["usually", "normally", "generally"] },
  "brief": { chinese: "简短的;短暂的;摘要", ipa: "/briːf/", pos: "adj./n./v.", example: "Please give me a brief summary.", synonyms: ["short", "concise", "quick"] },
  "entirely": { chinese: "完全地;全部地", ipa: "/ɪnˈtaɪərli/", pos: "adv.", example: "The decision is entirely up to you.", synonyms: ["completely", "totally", "wholly"] },
  "global": { chinese: "全球的;全面的;总的", ipa: "/ˈɡloʊbl/", pos: "adj.", example: "Climate change is a global challenge.", synonyms: ["worldwide", "international", "universal"] },
  "firm": { chinese: "公司;坚固的;坚定的", ipa: "/fɜːrm/", pos: "n./adj.", example: "She has a firm belief in education.", synonyms: ["company", "solid", "steady"] },
  "vast": { chinese: "巨大的;广阔的;大量的", ipa: "/væst/", pos: "adj.", example: "The vast ocean stretched before them.", synonyms: ["immense", "enormous", "huge"] },
  "broad": { chinese: "宽广的;广泛的;大体的", ipa: "/brɔːd/", pos: "adj.", example: "The river is very broad at this point.", synonyms: ["wide", "extensive", "expansive"] },
  "apparent": { chinese: "明显的;表面上的;显然的", ipa: "/əˈpærənt/", pos: "adj.", example: "The solution was apparent to everyone.", synonyms: ["obvious", "evident", "clear"] },
  "keen": { chinese: "渴望的;敏锐的;锋利的", ipa: "/kiːn/", pos: "adj.", example: "She has a keen interest in art.", synonyms: ["eager", "enthusiastic", "sharp"] },
  "swift": { chinese: "迅速的;敏捷的", ipa: "/swɪft/", pos: "adj.", example: "The company made a swift decision.", synonyms: ["fast", "rapid", "quick"] },
  "steady": { chinese: "稳定的;持续的;稳固的", ipa: "/ˈstedi/", pos: "adj./v.", example: "The economy showed steady growth.", synonyms: ["stable", "constant", "firm"] },
  "arise": { chinese: "出现;产生;起身", ipa: "/əˈraɪz/", pos: "v.", example: "Problems may arise during the project.", synonyms: ["emerge", "occur", "appear"] },
  "resolve": { chinese: "解决;决心;决议", ipa: "/rɪˈzɑːlv/", pos: "v./n.", example: "We need to resolve this issue quickly.", synonyms: ["solve", "settle", "determine"] },
  "acquire": { chinese: "获得;学到;收购", ipa: "/əˈkwaɪər/", pos: "v.", example: "She acquired new skills during the training.", synonyms: ["obtain", "gain", "attain"] },
  "reveal": { chinese: "揭示;透露;显示", ipa: "/rɪˈviːl/", pos: "v.", example: "The report reveals important findings.", synonyms: ["disclose", "expose", "show"] },
  "possess": { chinese: "拥有;具有;支配", ipa: "/pəˈzes/", pos: "v.", example: "She possesses great talent for music.", synonyms: ["own", "have", "hold"] },
  "cite": { chinese: "引用;举例;表彰", ipa: "/saɪt/", pos: "v.", example: "Please cite your sources in the essay.", synonyms: ["quote", "reference", "mention"] },
  "adapt": { chinese: "适应;改编;调整", ipa: "/əˈdæpt/", pos: "v.", example: "Animals adapt to their environment.", synonyms: ["adjust", "modify", "acclimate"] },
  "undergo": { chinese: "经历;遭受;接受", ipa: "/ˌʌndərˈɡoʊ/", pos: "v.", example: "The building will undergo renovation.", synonyms: ["experience", "endure", "suffer"] },
  "diminish": { chinese: "减少;减小;降低", ipa: "/dɪˈmɪnɪʃ/", pos: "v.", example: "The storm began to diminish in strength.", synonyms: ["decrease", "reduce", "lessen"] },
  "undergo": { chinese: "经历;遭受;接受", ipa: "/ˌʌndərˈɡoʊ/", pos: "v.", example: "The patient will undergo surgery.", synonyms: ["experience", "endure", "face"] },
  "subtle": { chinese: "微妙的;精细的;敏锐的", ipa: "/ˈsʌtl/", pos: "adj.", example: "There is a subtle difference between the two.", synonyms: ["delicate", "fine", "slight"] },
  "precise": { chinese: "精确的;准确的;严谨的", ipa: "/prɪˈsaɪs/", pos: "adj.", example: "Please give me precise directions.", synonyms: ["exact", "accurate", "specific"] },
  "harsh": { chinese: "严厉的;恶劣的;刺耳的", ipa: "/hɑːrʃ/", pos: "adj.", example: "The harsh winter caused many problems.", synonyms: ["severe", "cruel", "rough"] },
  "eager": { chinese: "渴望的;热切的;急切的", ipa: "/ˈiːɡər/", pos: "adj.", example: "The students were eager to learn.", synonyms: ["keen", "enthusiastic", "anxious"] },
  "thorough": { chinese: "彻底的;周密的;完全的", ipa: "/ˈθɜːroʊ/", pos: "adj.", example: "The doctor conducted a thorough examination.", synonyms: ["complete", "comprehensive", "detailed"] },
  "genuine": { chinese: "真正的;真诚的;名副其实的", ipa: "/ˈdʒenjuɪn/", pos: "adj.", example: "She showed genuine concern for others.", synonyms: ["authentic", "real", "sincere"] },
  "inevitable": { chinese: "不可避免的;必然的", ipa: "/ɪnˈevɪtəbl/", pos: "adj.", example: "Change is inevitable in any organization.", synonyms: ["unavoidable", "certain", "inescapable"] },
  "subsequent": { chinese: "随后的;后来的;接下来的", ipa: "/ˈsʌbsɪkwənt/", pos: "adj.", example: "Subsequent events proved him right.", synonyms: ["following", "later", "succeeding"] },
  "equivalent": { chinese: "等价的;相当的;对等物", ipa: "/ɪˈkwɪvələnt/", pos: "adj./n.", example: "One dollar is equivalent to about seven yuan.", synonyms: ["equal", "comparable", "corresponding"] },
  "comprehensive": { chinese: "全面的;综合的;详尽的", ipa: "/ˌkɑːmprɪˈhensɪv/", pos: "adj.", example: "The book provides a comprehensive overview.", synonyms: ["thorough", "complete", "extensive"] },
  "prominent": { chinese: "突出的;著名的;显眼的", ipa: "/ˈprɑːmɪnənt/", pos: "adj.", example: "She is a prominent figure in the community.", synonyms: ["notable", "distinguished", "eminent"] },
  "excessive": { chinese: "过度的;过多的;极端的", ipa: "/ɪkˈsesɪv/", pos: "adj.", example: "Excessive use of salt is bad for health.", synonyms: ["extreme", "immoderate", "unreasonable"] },
  "profound": { chinese: "深刻的;深远的;渊博的", ipa: "/prəˈfaʊnd/", pos: "adj.", example: "The speech had a profound impact on the audience.", synonyms: ["deep", "intense", "significant"] },
  "urgent": { chinese: "紧急的;迫切的;催促的", ipa: "/ˈɜːrdʒənt/", pos: "adj.", example: "This is an urgent matter that needs attention.", synonyms: ["pressing", "critical", "immediate"] },
  "distinct": { chinese: "不同的;明显的;清楚的", ipa: "/dɪˈstɪŋkt/", pos: "adj.", example: "The two cultures are quite distinct.", synonyms: ["different", "separate", "clear"] },
  "mere": { chinese: "仅仅的;纯粹的;只不过", ipa: "/mɪr/", pos: "adj.", example: "A mere glance was enough to understand.", synonyms: ["simple", "bare", "just"] },
  "core": { chinese: "核心;核心的;中心", ipa: "/kɔːr/", pos: "n./adj.", example: "Innovation is the core of the company.", synonyms: ["center", "essence", "heart"] },
};

// Now build the final entries
const WORDS_PER_GROUP = 50;
let currentDay = 31;
let currentGroup = 31;
let countInGroup = 0;

const newWordEntries = [];
const usedWords = new Set();

for (const item of wordDetails) {
  const word = item.word;
  
  // Skip duplicates and words already in existing set
  if (usedWords.has(word) || existingSet.has(word)) continue;
  usedWords.add(word);
  
  if (countInGroup >= WORDS_PER_GROUP) {
    currentDay++;
    currentGroup++;
    countInGroup = 0;
  }
  
  const groupStr = String(currentGroup).padStart(2, '0');
  const indexStr = String(countInGroup + 1).padStart(3, '0');
  
  const dictEntry = DICTIONARY[word];
  
  if (dictEntry) {
    newWordEntries.push({
      id: `w${groupStr}-${indexStr}`,
      word: word,
      chinese: dictEntry.chinese,
      ipa: dictEntry.ipa,
      partOfSpeech: dictEntry.pos,
      exampleSentence: dictEntry.example,
      synonyms: dictEntry.synonyms.filter(s => s.length > 0),
      day: currentDay,
      groupNumber: currentGroup,
    });
    countInGroup++;
  }
  // Skip words we don't have dictionary entries for - they'll still be
  // findable via morphological matching in the UI component
}

console.log(`Generated ${newWordEntries.length} new word entries`);
console.log(`Groups: ${31} to ${currentGroup} (${currentGroup - 30} new groups)`);
console.log(`Days: 31 to ${currentDay}`);

// Merge with existing words
const allWords = [...existingWords, ...newWordEntries];
console.log(`Total words in updated file: ${allWords.length}`);

// Write the updated words.json
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'words.json'),
  JSON.stringify(allWords, null, 2)
);

console.log('Updated src/data/words.json');

// Also output the new words separately for reference
fs.writeFileSync(
  path.join(__dirname, 'new_words_added.json'),
  JSON.stringify(newWordEntries, null, 2)
);

console.log('Reference copy at scripts/new_words_added.json');

// Report coverage
const allWordSet = new Set(allWords.map(w => w.word.toLowerCase()));
let coveredSynonyms = 0;
let totalSynonyms = 0;
for (const w of allWords) {
  for (const syn of w.synonyms) {
    totalSynonyms++;
    if (allWordSet.has(syn.toLowerCase())) coveredSynonyms++;
  }
}
console.log(`\nSynonym coverage: ${coveredSynonyms}/${totalSynonyms} (${((coveredSynonyms/totalSynonyms)*100).toFixed(1)}%)`);
