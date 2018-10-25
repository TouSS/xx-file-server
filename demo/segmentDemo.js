const Segment = require('segment')

let segment = new Segment()

// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
//segment.useDefault()
//自定义加载
segment
  // 分词模块
  // 强制分割类单词识别
  .use('URLTokenizer')            // URL识别
  .use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
  .use('PunctuationTokenizer')    // 标点符号识别
  .use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
  // 中文单词识别
  .use('DictTokenizer')           // 词典识别
  .use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后

  // 优化模块
  .use('EmailOptimizer')          // 邮箱地址识别
  .use('ChsNameOptimizer')        // 人名识别优化
  .use('DictOptimizer')           // 词典识别优化
  .use('DatetimeOptimizer')       // 日期时间识别优化

  // 字典文件
  .loadDict('dict.txt')           // 盘古词典
  .loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
  .loadDict('names.txt')          // 常见名词、人名
  .loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
  .loadSynonymDict('synonym.txt')   // 同义词
  .loadStopwordDict('stopword.txt') // 停止符

// 开始分词
let text = '中新网10月24日电 据台湾《中国时报》报道，台铁第6432车次普悠玛列车21日下午行经宜兰县苏澳新马车站时发生出轨翻覆意外，造成18人死亡、190人受伤。23日曝光的台铁内部两则主管简讯证实司机曾通报异常，台铁局长等60位一级主管第一时间就知道列车出问题，却未按规定派人上车、协助控制列车行驶，且因宜兰站没有普悠玛列车可供替换，台铁“赌运气”打算到花莲再换车，导致悲剧发生，而从第一封简讯发出到列车翻覆仅53分钟。据了解，21日下午，司机尤振仲在新北树林站发现列车控制及监控系统(TCMS)警示灯异常，仍然发车，到了瑞芳站，发现动力异常。下午3时57分，尤振仲在双溪站第一次报告主风泵压力不足，停驶熄灯两分钟并广播通知列车异常。这时台铁内部发出第一次简讯：自双溪站起，火车头动力切断，沿途行驶缓慢，晚14分钟通过龟山站，计划于宜兰站检修。尤振仲在大溪站关闭列车自动防护系统(ATP)后，下午4时34分在宜兰第二次报告主风泵压力不足。宜兰工务段检查员上车却无法修复，只好下车。'
let words = segment.doSegment(text, {
    //simple: true, //不返回词性
    stripPunctuation: true, //去除标点符号
    stripStopword: true, //去除停止符
})
words.forEach(word => {
  if(word.p == 0x00100000) {
    console.log(word.w)
  }
});