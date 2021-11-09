/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Buy new equipment to make even more electricity": "购买新设备以产生更多电力",
    "Economic Impact": "经济影响",
    "Electricty boosts electricity gain ( Don't ask me how": "电力增加电力增益（不要问我多少",
    "Employees": "员工",
    "Energy Boost": "能源提升",
    "Equipment": "设备",
    "Experts": "专家",
    "Hire employees to make more electricity": "雇用员工以产生更多电力",
    "Hire experts to boost your production": "聘请专家来提高您的产量",
    "Main": "主界面",
    "Market Pressure Vol1": "市场压力 Vol1",
    "money": "钱",
    "Refuse to sell electricity until the price goes up ( This game is slowly becoming illegal": "拒绝卖电直到价格上涨（这个游戏正在慢慢变得非法",
    "Unlock a money effect, which boosts electricty gain": "解锁金钱影响，提高电力收益",
    "Upgrades": "升级",
    "batteries": "电池",
    "Bigger Batteries": "更大的电池",
    "Buy bigger batteries": "购买更大的电池",
    "Batteries boost the money effect exponent": "电池推动金钱效应指数",
    "Battery Power": "电池力量",
    "Buying battery upgrades doesn't decrease your battery amount": "购买电池升级并不会减少您的电池电量",
    "Gain 100% of money on reset every second": "重置时每秒获得 100% 的金钱",
    "Keep money upgrades on reset": "重置时保留金钱升级",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Battery effect decreases battery cost": "电池效应降低电池成本",
    "Cost Decrease": "成本降低",
    "Batteries last longer and stock more electricity": "电池持续时间更长，储存更多电量",
    "Battery Extender": "电池扩展器",
    "Cheaper Batteries": "更便宜的电池",
    "Hire Managers": "招聘经理",
    "Hire managers to boost Employees effect": "聘请经理以提升员工效应",
    "Hire Technicians": "聘请技术员",
    "Hire technicians to boost battery effect": "聘请技术人员提高电池效果",
    "Market Pressure Vol2": "市场压力 Vol2",
    "Money effect divides battery cost at a reduced rate": "金钱效应以较低的比率划分电池成本",
    "More Upgrades": "更多升级",
    "Softcaps": "软上限",
    "Threaten to sell your electricity elsewhere if prices don't go up ( Illegal maneuvers : the return": "如果价格不上涨，则威胁要在其他地方出售电力（非法操作：回报）",
    "Unlock 3 battery upgrades": "解锁 3 次电池升级",
    "More Effects": "更多效果",
    "Cost Decrease Part 2": "成本降低第 2 部分",
    "Boost battery effect based on batteries": "基于电池的提升电池效果",
    "Battery effect reduces battery cost even more": "电池效应进一步降低电池成本",
    "Unlock the worker layer": "解锁工作层",
    "Workers": "工人",
    "Electricians": "电工",
    "Unlock a worker effect": "解锁工人效果",
    "Why Not Another Effect ?": "为什么不是另一种效果？",
    "workers": "工人",
    "Workers increase electricity gain": "工人增加电力增益",
    "Better Effect": "电池效果",
    "Triple the worker effect exponent": "三倍工人效应指数",
    "Base Booster": "基础助推器",
    "Batteries boost battery base": "电池提升电池基础",
    "Batteries boost worker gain": "电池提升工人增益",
    "Batteries cost less based on money": "电池成本更低，基于金钱",
    "Challenging": "挑战",
    "Challenges": "挑战",
    "Even More Upgrades": "更多升级",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Hardwork+": "勤奋+",
    "Hardwork": "勤奋",
    "Hardwork is more powerful and has a higher cap": "努力工作更强大，拥有更高的上限",
    "Low Demand": "需求降低",
    "Lowering Costs": "降低成本",
    "Money boosts electricity gain": "金钱增加电力收益",
    "There is a low demand of electricity, making the money gain exponent divide by 2": "电力需求低，使得货币收益指数除以2",
    "Completed": "已完成",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Batteries reset nothing": "电池什么都不重置",
    "Gain 100% of worker gain on reset every second": "每秒重置时获得 100% 的工人收益",
    "Hire Workers": "雇用工人",
    "Money boosts worker gain": "金钱促进工人收益",
    "Unlock another 3 battery upgrades": "解锁另外 3 次电池升级",
    "Unlock the first worker challenge": "解锁第一个工人挑战",
    "Worker Boost": "工人提升",
    "Workers boost battery effect": "工人提升电池效应",
    "Keep Upgrading": "不断升级",
    "Unlock yet another 5 battery upgrades": "解锁另外 5 个电池升级",
    "Batteries need maitenance, hire more workers to take care of them": "电池需要维护，雇佣更多的工人来照顾它们",
    "Maintenance": "维护",
    "New Horizons": "新视野",
    "Overcharge": "过度充电",
    "Overcharge effect also raises worker effect to the 15th power": "过度充电效果还将工人效果提高到 15 次方",
    "Overcharge your batteries, which cubes their effect": "过度充电你的电池，这会增加它们的效果",
    "Overcharge+": "过度充电+",
    "Raise Hardwork cap to 2.5": "将勤奋上限提高到 2.5",
    "Unlock a new layer": "解锁一个新层",
    "Hardwork++": "勤奋++",
    "More Challenges": "更多挑战",
    "Unlock the second worker challenge": "解锁第二个工人挑战",
    "Start": "开始",
    "Permanently unlock the buyable": "永久解锁可购买",
    "Power Outage": "电力中断",
    "There has been a power outage, which removes the battery effect, but you unlocked a buyable as replacement": "发生了停电，消除了电池效应，但您解锁了可购买的替代品",
    "Buyables": "可购买",
    "Electric Powering": "电力供应",
    "Buyable Boost": "可购买提升",
    "First money buyable's effect also reduces battery cost": "第一个金钱可购买的效果也降低了电池成本",
    "Halves the first money buyable scaling": "将第一个钱可购买的缩放比例减半",
    "Lower Scaling": "降低缩放比例",
    "Battery Booster": "电池助推器",
    "Productive Workers": "生产工人",
    "Your workers are more productive, raising their effect to the 25th power": "您的员工生产力更高，将他们的影响提高到 25 次方",
    "coal power plants": "煤炭发电厂",
    "coal power plants": "煤炭发电厂",
    "Hire more workers to take care of your coal power plants": "雇用更多工人来照顾您的燃煤电厂",
    "That Coal Ain't Burning Itself": "煤不会自己燃烧",
    "Coal power plant resets nothing": "燃煤电厂什么都不重置",
    "Coal power plant's effect also boosts worker gain": "燃煤电厂的影响也提高了工人的收益",
    "Keep battery/worker milestones and worker challenges on reset": "保留电池/工人里程碑和工人挑战重置",
    "More Power Plants = More Jobs": "更多的发电厂 = 更多的工作",
    "Unlock auto battery prestige and battery buy max": "解锁自动电池声望和电池购买最大值",
    "Maybe Ecology Is Future ?": "也许生态是未来？",
    "More Corruption = Cheaper": "更多的腐败=更便宜",
    "Need More Effects": "需要更多效果",
    "Need More Power": "需要更多电力",
    "Political Boost": "政治提升",
    "Push corrupt politicians effect hardcap to 1.75": "将腐败政客的影响硬上限推至 1.75",
    "Pushing A Little Bit Further": "进一步推动一点",
    "Raise corrucpt politicians effect to the 1.25th power and raise the hardcap to 2": "将腐败政治家效应提高到 1.25 次方并将硬上限提高到 2",
    "Raise corrupt government effect to the 10th power": "将腐败政府效果提升至 10 次方",
    "Raise electricity gain to the 1.001 th power": "将电力增益提高到 1.001 次方",
    "Really ?": "真的吗 ？",
    "Remove the 5th softcap on the corrupt politician effect": "移除腐败政客效应的第 5 个软上限",
    "Remove the 6th softcap on the corrupt politician effect and make the 17th inflation upgrade better": "去除第 6 个软上限对腐败政客的影响，让第 17 个通胀升级更好",
    "Remove the first softcap of the corrupt politician effect": "去除腐败政客效应的第一个软上限",
    "Remove the second softcap on corrupt politician effect": "取消对腐败政客影响的第二个软上限",
    "Remove the useless softcap on inflation gain and raise inflation gain to the 2500th power": "删除无用的通胀收益软上限，将通胀收益提高到 2500 次方",
    "Self-Corruption": "自我腐败",
    "Shared Corruption": "共同腐败",
    "Softcapped": "软上限",
    "Softcapped ) The End Of The Trilogy": "软上限）三部曲的结局",
    "Softcapped ) The Sequel": "软上限）续集",
    "Spread corruption to the entire world with your corrupt governments": "用你的腐败政府将腐败传播到全世界",
    "Square corrupt politician effect": "平方腐败政客效应",
    "The first sofcap of the corrupt politician effect starts later": "腐败政客效应的第一个软上限开始较晚",
    "Unlock another battery buyable": "解锁另一个电池可购买",
    "Unlock another corrupt politician effect": "解锁另一个腐败政客效应",
    "Unlock another layer": "解锁另一个层",
    "Unlock new corrupt boost upgrades and corrupt boosts are 1% cheaper": "解锁新的腐败提升升级和腐败提升便宜 1%",
    "Unlock solar power plant challenges": "解锁太阳能发电厂的挑战",
    "Upgrade Stuff Before The Next Layer": "在下一层之前升级东西",
    "Unlock the fourth nuclear challenge": "解锁第四次核挑战",
    "Who Cares About Pollution ?": "谁在乎污染？",
    "Who Cares About Radioactivity ?": "Who Cares About Radioactivity ?",
    "Why ?": "为森么 ?",
    "Why must inflation stop ?": "为什么通货膨胀必须停止？",
    "Zimbabwe": "津巴布韦",
    "Dark Energy": "暗能量",
    "Cube Inflated effect": "立方膨胀效果",
    "eee1.000e10 inflation": "eee1.000e10 通货膨胀",
    "Effects, Effects, Effects...": "效果，效果，效果...",
    "Elecrticity boosts inflation generation speed": "电力提高通货膨胀的产生速度",
    "Extra Corruption": "额外的腐败",
    "F150,000,001 inflation": "F150,000,001 通货膨胀",
    "Finally, A Boost": "最后，一个提升",
    "Gain Control": "增益控制",
    "Generation": "世代",
    "Generation also boosts corrupt politician gain": "世代也助长了腐败政客的收益",
    "Generation doesn't remove corrupt politicians anymore and unlock 3 corrupt politician upgrades and 3 corrupt government upgrades": "世代不再清除腐败政客并解锁 3 个腐败政客升级和 3 个腐败政府升级",
    "Germany": "德国",
    "GET RID OF THEM": "摆脱它们",
    "Global demand on electricity rises, the government reduces by 1 the nuclear power plant cost exponent to satisfy the demand": "全球电力需求上升，政府将核电站成本指数降低1以满足需求",
    "Go Further": "走得更远",
    "Got Some Corruption With You ?": "你有腐败吗？",
    "Hell Remastered": "地狱重制",
    "HOW MANY SOFTCAPS DO YOU NEED ?": "您需要多少个软上限？",
    "Hyperinflated Boost": "过度膨胀的助推器",
    "Hyperinflation": "恶性通货膨胀",
    "I Hate Hardcaps": "我讨厌硬上限",
    "I Just Don't Care Anymore": "我只是不在乎了",
    "I n f l a t e": "膨胀",
    "Inflated": "膨胀",
    "Inflated+": "膨胀+",
    "Inflated++": "膨胀++",
    "Inflated Corruption": "膨胀的腐败",
    "Inflated Governments": "膨胀的政府",
    "Inflated Politics": "膨胀的政治",
    "inflation": "通货膨胀",
    "Inflation boosts battery amount in the battery effect formula": "电池效应公式中的通货膨胀提升电池量",
    "Inflation boosts corrupt government gain": "通货膨胀提升腐败政府获利",
    "Inflation boosts corrupt governments again": "通货膨胀再次提升腐败政府",
    "Inflation boosts corrupt politician and corrupt government gain": "通货膨胀提升腐败政客和腐败政府获利",
    "Inflation boosts electricity gain": "通货膨胀提升电力收益",
    "Inflation boosts infation again": "通胀再次提升通胀",
    "Inflation boosts inflation gain": "通胀提升通胀收益",
    "Inflation boosts its generation speed": "通货膨胀提升其生成速度",
    "Inflation go brrr": "通货膨胀到brrr",
    "Insert Title Here": "在此处插入标题",
    "Live TV Fight, Uhh I Mean Debate": "直播电视打架，呃，我是说辩论",
    "Lose 1% of your corrupt politicians every second, but they boost corrupt government gain": "每秒失去 1% 的腐败政客，但他们会增加腐败政府的收益",
    "Make the Hyperinflation formula better and enter the i n f l a t e d era": "使恶性通货膨胀公式更好，进入 通胀 时代",
    "Make the softcap on inflation gain 250x less powerful": "使通胀软上限收益降低 250 倍",
    "And Your Money Is Adding F150,000,000% To that Amount Every Second": "你的钱每秒增加 F150,000,000%",
    "Annilihate The Softcaps": "消灭软上限",
    "Another Boost ?": "另一个提升？",
    "Another Self-Boost I Guess": "另一个自我提升我猜",
    "Back To Hell": "回到地狱",
    "Base Destroyer": "基地毁灭者",
    "Battery Powering": "电池供电",
    "Big Ol' Boost": "大的提升",
    "Boost": "提升",
    "Boost all upgrades on the row above based on inflation": "根据通货膨胀提高上一行的所有升级",
    "Boost Inflated++ and Zimbabwe based on money": "基于金钱提升 膨胀++ 和津巴布韦",
    "Boost Inflated++ based on money": "基于金钱提升 膨胀++",
    "Boost inflation gain by a factor 5": "将通胀收益提高 5 倍",
    "Boosting And Boosting Again": "提升和再次提升",
    "CAP": "上限",
    "Capitalists and communists bases are 10% weaker": "资本主义者和共产主义者的基础弱了 10%",
    "Corrupt Corruption": "贪污腐败",
    "Corrupt goverments reduces corrupt boost cost": "腐败政府降低腐败成本",
    "corrupt governments": "腐败的政府",
    "Corrupt governments boost corrupt politician gain and remove 4th softcap on corrupt politician effect": "腐败政府提高腐败政客的收益并取消对腐败政客影响的第四次软上限",
    "Corrupt governments boost inflation gain": "腐败政府提升通胀收益",
    "Corrupt governments boost share gain": "腐败的政府促进了份额增长",
    "Corrupt governments boost their own gain": "腐败的政府增加了自己的收益",
    "Corrupt governments reduce taxes, making solar power plants cheaper": "腐败的政府减税，使太阳能发电厂更便宜",
    "Corrupt Hell": "腐败地狱",
    "corrupt politicians": "腐败的政客",
    "Corrupt politician effect is cubed": "腐败的政客效应是立方的",
    "Corrupt politicians and governments start producing corruption": "腐败的政客和政府开始制造腐败",
    "Corrupt politicians boost electricity gain": "腐败政客提高电力收益",
    "Corrupt politicians boost share gain": "腐败的政客推动了份额增长",
    "Corrupt politicians corrupt other politicians": "腐败的政客腐败其他政客",
    "Corrupt politicians reduce coal power plant cost exponent": "腐败政客降低燃煤电厂成本指数",
    "Corrupt politicians reduce nuclear power plant cost exponent": "腐败政客降低核电站成本指数",
    "Corrupt politicians reduce nuclear power plant cost": "腐败政客降低核电站成本",
    "Corruption-19": "腐败-19",
    "Wall Street": "华尔街",
    "You have suffered to get here, rest and take this boost. Battery cost is divided by money": "来到这里，休息并接受这种提升，你已经受了苦。 电池成本除以金钱",
    "Upgrades+": "升级+",
    "Upgrade Boost": "升级提升",
    "Unlock shares": "解锁份额",
    "Unlock anther layer. Might become hellish again. Also multiply electricity gain by 1e2000": "解锁另一个层。 可能又要变成地狱了。 还将电力增益乘以 1e2000",
    "Unlock a third worker challenge": "解锁第三个工人挑战",
    "Unlock a nuclear power plant buyable ( Don't worry, the buyable won't reset your progress :)": "解锁核电站可购买（别担心，可购买不会重置您的进度:)",
    "Unlock a battery buyable": "解锁电池可购买",
    "Unlock 9 new upgrades": "解锁 9 项新升级",
    "The previous upgrade also boosts share gain but stronger": "之前的升级也促进了份额增长但更强",
    "The 4th One": "第四个",
    "Take It Easy": "放轻松",
    "Solar Boost": "太阳能提升",
    "Softcapped ) 4th Of The Name": "软上限 ) 名字的第 4 个",
    "Savings": "存储",
    "Rest": "休息",
    "Remove the 3rd softcap on corrupt politician effect": "删除对腐败政客影响的第三个软上限",
    "Reassemble": "重装",
    "Reduce the solar power plant cost exponent by 0.005": "将太阳能发电厂成本指数降低 0.005",
    "Pushing A Litte Bit Further Again": "再次推动一点点",
    "Pay corrupt poiticians to reduce the first battery buyable cost scaling": "付钱给腐败的政客以减少第一块电池的可购买成本缩放",
    "Now That's What I Call Being Rich": "现在这就是我所说的富有",
    "Multiply by 25000 the amount of effective Buyable Boost levels": "乘以 25000 有效可购买提升等级的数量",
    "More Investments = More Profits": "更多投资 = 更多利润",
    "Money effect no longer divides costs at a reduced rate": "货币效应不再以较低的比率分配成本",
    "Money effect also divides coal power plant's cost at a reduced rate": "货币效应也降低了燃煤电厂的成本",
    "Money boosts the corrupt politician effect": "金钱提升腐败政客效应",
    "Money boosts corrupt politician gain": "金钱提升腐败政客获利",
    "Gain 10x more shares": "获得 10 倍以上的股份",
    "Form governments with your corrupt politicians": "与腐败的政客组成政府",
    "Extra Money": "额外的钱",
    "Exponent Booster": "指数助推器",
    "Even More Investments = Even More Profits": "更多的投资=更多的利润",
    "Electricity gain is raised to the 1.025th power": "电力增益提高到 1.025 次方",
    "Electric Powering is raised to the 100,000th power": "电力供应 提升至 100,000 次方",
    "Electric Investment": "电力投资",
    "Electric Powering 2nd Generation": "第二代电力",
    "Divides battery cost by e5,522,500x and divides coal power plant cost by 1e22,090": "电池成本除以e5,522,500x，煤电厂成本除以1e22,090",
    "Cost Reducer": "成本降低器",
    "Corruption : The Return": "腐败:回归",
    "Corrupt Batteries": "电池损坏",
    "Cooling Down": "冷却",
    "Coal Mine": "煤矿",
    "Capitalists' effect also boosts electricity gain but at a reduced rate": "资本家的影响也增加了电力收益，但速度有所下降",
    "Capitaslists' effect is stronger based on money": "资本家的效应是基于金钱的",
    "Calm Down": "冷静",
    "Buy More": "购买更多",
    "Build a cooling system for your coal power plants": "为您的燃煤电厂构建冷却系统",
    "Build a better cooling system for your nuclear power plants": "为您的核电站构建更好的冷却系统",
    "Better Cooling": "更好的冷却",
    "Another One": "另一个",
    "Another easy boost to recover. Nuclear power plant cost is divided by workers": "另一个容易恢复的推动力。 核电站成本除以工人",
    "And Another": "还有一个",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Which Are Boosting Electricity Gain By ": "哪些正在提高电力收益",
    "\t\t\t\t": "",
    "Show A Layer With Buttons To Buy Max For Mobile Players : ": "显示一个带有按钮的层，为手机玩家购买 最大：",
    "Which Are Boosting Corrupt Politician Gain By ": "哪些正在推动腐败的政客获利",
    "Which Are Raising Electricity Gain To The 25.01th power And Boosting Corrupt Politician Gain By ": "哪些将电力增益提高到 25.01 次方并通过",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    " to battery effect base": "到电池效果基数",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^e([\d\.]+)$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^e([\d\.,]+)x$/,
    /^x([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^(.+) And Dividing Battery\/Coal Power Plant Cost By (.+)$/, '$1 并将电池\/煤电厂成本除以 $2'],
    [/^Add (.+)  to the money effect exponent$/, '将 $1 添加到货币效应指数'],
    [/^And Your Money Is Adding (.+) To that Amount Every Second$/, '并且您的资金每秒增加 $1'],
    [/^Boosts electricity gain by (.+) and divides battery cost by (.+)$/, '将电力增益提高 $1 并将电池成本除以 $2'],
    [/^Boosts electricity gain by (.+)$/, '将电力增益提高 $1'],
    [/^Boost Electricty Gain By (.+)$/, '将电力增益提高 $1'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^Reach (.+) workers to unlock \(You have (.+) workers$/, '达到 $1 工人即可解锁（您有 $2 工人'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Battery effect \^(.+)$/, '电池效应 \^$1'],
    [/^(.+)x And Dividing Battery Cost By (.+)x$/, '$1x 并将电池成本除以 $2x'],
    [/^Next at (.+) KWh$/, '下一个在 $1 KWh'],
    [/^Next at (.+) money$/, '下一个在 $1 钱'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Reach (.+) money to unlock \(You have (.+) money$/, '达到 $1 钱解锁（你有 $2 钱'],
	[/^([\d\.]+) batteries$/, '$1 电池'],
	[/^\/([\d\.]+)e([\d\.,]+) battery cost$/, '\/$1 电池成本'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
	[/^([\d\.]+)e([\d\.,]+) Workers$/, '$1e$2 工人'],
	[/^([\d\.]+)e([\d\.,]+) money$/, '$1e$2 钱'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+) to money effect exponent$/, '$1 到金钱效果指数'],
    [/^([\d\.]+)e([\d\.,]+) workers$/, '$1e$2 工人'],
    [/^e([\d\.]+)e([\d\.,]+) money$/, 'e$1e$2 钱'],
    [/^e([\d\.]+)e([\d\.,]+) workers$/, 'e$1e$2 工人'],
    [/^e([\d\.]+)e([\d\.,]+)\/sec$/, 'e$1e$2\/秒'],
    [/^([\d\.]+)e([\d\.,]+) corrupt governments$/, '$1e$2 腐败的政府'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.]+)e([\d\.,]+) shares$/, '$1e$2 份额'],
    [/^([\d\.]+)e([\d\.,]+) corrupt politicians$/, '$1e$2 腐败的政客'],
    [/^\*(.+) to all upgrades effects in the row above$/, '\*$1 到 上一行的所有升级效果'],
    [/^\*(.+) to corrupt politician gain$/, '\*$1 到 腐败政客 收益'],
    [/^\*(.+) to corrupt government gain$/, '\*$1 到 腐败政府 收益'],
    [/^\*(.+) to electicity gain$/, '\*$1 到 电力增益'],
    [/^\*(.+) to share gain$/, '\*$1 到 份额 收益'],
    [/^\*(.+) to inflation generation speed$/, '\*$1 到 通货膨胀产生速度'],
    [/^\*(.+) to inflation gain speed$/, '\*$1 到 通货膨胀增益速度'],
    [/^\*(.+) stronger$/, '\*$1 更强'],
    [/^(.+) to nuclear power plant cost exponent$/, '$1 到 核电站成本指数'],
    [/^(.+) to solar power plant cost$/, '$1 到 到太阳能发电厂成本'],
    [/^(.+) to nuclear power plant cost$/, '$1 到 核电站成本'],
    [/^(.+) to coal power plant cost exponent$/, '$1 到 燃煤电厂成本指数'],
    [/^(.+) solar power plants$/, '$1 太阳能发电厂'],
    [/^(.+) cheaper corrupt boosts$/, '$1 更便宜的腐败提升'],
    [/^(.+) to battery cost$/, '$1 更电池成本'],
    [/^\^(.+) to electricity gain$/, '\^$1 到 电力增益'],
    [/^\^(.+) to inflation gain$/, '\^$1 到 通货膨胀增益'],
    [/^\^(.+) to battery amount in the effect formula$/, '\^$1 到 效果公式中的电池电量'],
    [/^\^(.+) to corrupt politician and corrupt governement gain$/, '\^$1 到 腐败的政客和腐败的政府增益'],
    [/^\^(.+) to Inflated\+\+ and Zimbabwe$/, '\^$1 到 到 膨胀\+\+ 和津巴布韦'],
    [/^\^(.+) to Inflated\+\+$/, '\^$1 到 到 膨胀\+\+'],
    [/^\^(.+) to Inflated effect$/, '\^$1 到 膨胀效应'],
    [/^\^(.+) to coal power plant effect$/, '\^$1 到 燃煤电厂的影响'],
    [/^\^(.+) to nuclear power plant effect$/, '\^$1 到 核电站的影响'],
    [/^\^(.+) to the corrupt politician effect \( before softcaps$/, '\^$1 到腐败政客的影响（在软上限之前'],
    [/^([\d\.,]+) nuclear power plants$/, '$1 核电厂'],
    [/^([\d\.,]+) corrupt boosts$/, '$1 腐败提升'],
    [/^([\d\.,]+) Batteries$/, '$1 电池'],
    [/^([\d\.,]+) workers$/, '$1 工人'],
    [/^([\d\.,]+) money$/, '$1 钱'],
    [/^([\d\.,]+) batteries$/, '$1 电池'],
    [/^([\d\.,]+) capitalists$/, '$1 资本主义者'],
    [/^([\d\.,]+) communists$/, '$1 共产主义者'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^([\d\.,]+) Coal Power Plants$/, '$1 煤炭发电厂'],
    [/^([\d\.,]+) coal power plants$/, '$1 煤炭发电厂'],
    [/^\*([\d\.]+) to money gain$/, '\*$1 到钱增益'],
    [/^\*(.+) to inflation gain$/, '\*$1 到 通胀收益'],
    [/^\*(.+) to worker gain$/, '\*$1 到工人增益'],
    [/^\*([\d\.]+) to electicity gain$/, '\*$1 到电力增益'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^\*(.+) to elctricity gain$/, '\*$1 到电力增益'],
    [/^\^([\d\.]+) to battery effect$/, '\^$1 到电池效果'],
    [/^\^([\d\.]+) to Employees effect$/, '\^$1 到员工效果'],
    [/^\^([\d\.]+) battery effect$/, '\^$1 电池效果'],
    [/^([\d\.]+) Batteries : Base Cost Exp (.+)$/, '$1 电池 : 基础成本经验 $2'],
    [/^Cost: (.+) corrupt politicians$/, '成本：$1 腐败的政客'],
    [/^Cost: (.+) corrupt governments$/, '成本：$1 腐败的政府'],
    [/^Cost: (.+) inflation$/, '成本：$1 通货膨胀'],
    [/^Cost: (.+) coal power plants$/, '成本：$1 煤炭发电厂'],
    [/^Cost: (.+) batteries$/, '成本：$1 电池'],
    [/^Cost: (.+) money$/, '成本：$1 钱'],
    [/^Cost : (.+) money$/, '成本：$1 钱'],
    [/^Cost: (.+) workers$/, '成本：$1 工人'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) \/ (.+) elves$/, '成本：$1 \/ $2 精灵'],
    [/^Req: (.+) \/ (.+) money$/, '成本：$1 \/ $2 钱'],
    [/^Req: (.+) \/ (.+) workers$/, '成本：$1 \/ $2 工人'],
    [/^(.+) \/ (.+) money$/, '$1 \/ $2 钱'],
    [/^([\d\.]+)e([\d\.,]+) \/ ([\d\.]+)e([\d\.,]+) money$/, '$1e$2 \/ $3e$4 钱'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);