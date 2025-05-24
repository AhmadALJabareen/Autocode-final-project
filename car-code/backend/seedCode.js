const mongoose = require('mongoose');
require('dotenv').config();
const Code = require('./models/Code');

// بيانات حقيقية لأكواد الأعطال الشائعة
const codesData = [
  {
    code: "P0300",
    problem: "احتراق غير منتظم في المحرك (Misfire)",
    solution: "فحص شمعات الإشعال، كابلات الإشعال، حاقنات الوقود، ضغط الوقود"
  },
  {
    code: "P0420",
    problem: "كفاءة منخفضة في المحول الحفاز (Catalytic Converter)",
    solution: "فحص المحول الحفاز، حساسات الأكسجين، وجود تسريب في العادم"
  },
  {
    code: "P0171",
    problem: "نظام الوقود فقير (Bank 1 Too Lean)",
    solution: "فحص تسريب الهواء، حساس MAF، حاقنات الوقود، ضغط الوقود"
  },
  {
    code: "P0442",
    problem: "تسريب صغير في نظام EVAP",
    solution: "فحص غطاء الوقود، صمام EVAP، أنابيب النظام"
  },
  {
    code: "P0128",
    problem: "درجة حرارة المحرك أقل من المعدل الطبيعي",
    solution: "فحص ثرموستات التبريد، حساس درجة حرارة المحرك"
  },
  {
    code: "C0201",
    problem: "مشكلة في دائرة مستشعر السرعة (ABS Wheel Speed Sensor)",
    solution: "فحص حساس السرعة، الأسلاك، موصلات ABS"
  },
  {
    code: "B0100",
    problem: "خلل في دائرة حساس الاصطدام الأمامي",
    solution: "فحص الحساس، الأسلاك، وحدة التحكم في الوسادة الهوائية"
  },
  {
    code: "U0100",
    problem: "فقدان الاتصال مع وحدة التحكم في المحرك (ECM)",
    solution: "فحص كابل CAN bus، وصالت التحكم، فيوزات ECM"
  },
  {
    code: "P0507",
    problem: "دورات المحرك الخاملة أعلى من المعدل (High Idle RPM)",
    solution: "فحص صمام IAC، تسريب الهواء، حساس TPS"
  },
  {
    code: "P0700",
    problem: "خلل في نظام نقل الحركة (Transmission Control System)",
    solution: "فحص سائل ناقل الحركة، حساسات السرعة، وصلة التحكم"
  }
];

const seedCodes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Code.deleteMany({});
    console.log('Existing codes cleared');

    const insertedCodes = await Code.insertMany(codesData);
    console.log(`${insertedCodes.length} diagnostic codes seeded`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedCodes();