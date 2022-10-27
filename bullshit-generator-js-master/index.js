import {existsSync, mkdirSync, readFile, readFileSync, writeFileSync} from 'fs'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// import {options} from './lib/cmd.js';
// import {loadCorpus, saveCorpus} from './lib/corpus.js';
import {generate} from './lib/generator.js';
import {createRandomPicker} from './lib/random.js';
import {interact} from './lib/interact.js';
import moment from 'moment'
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
// readFile('./corpus/data.json',{encoding: 'utf-8'}, (err,data) => {
//   if (!err) {
//     console.log(data)
//   } else {
//     console.error(err)
//   }
// })
// const url = import.meta.url // 获取当前脚本文件的url
// console.log(dirname(fileURLToPath(url)))
// const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json')

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadCorpus(src) {
  const path = resolve(__dirname, src)
  const data = readFileSync(path, {encoding: 'utf-8'})
  return JSON.parse(data)
}

const corpus = loadCorpus('corpus/data.json')
const pickTitle = createRandomPicker(corpus.title)
// const title = pickTitle()
// const article = generate(title, {corpus})
// console.log(article)
// console.log(`${title}      ${article.join('\n     ')}`)
function parseOptions(options = {}) {
  const argv = process.argv;
  for(let i = 2; i < argv.length; i++) {
    const cmd = argv[i - 1];
    const value = argv[i];
    if(cmd === '--title') {
      options.title = value;
    } else if(cmd === '--min') {
      options.min = Number(value);
    } else if(cmd === '--max') {
      options.max = Number(value);
    }
  }
  return options;
}
// 定义帮助的内容
const sections = [
  {
    header: '狗屁不通文章生成器',
    content: '生成随机的文章段落用于测试',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'title',
        typeLabel: '{underline string}',
        description: '文章的主题。',
      },
      {
        name: 'min',
        typeLabel: '{underline number}',
        description: '文章最小字数。',
      },
      {
        name: 'max',
        typeLabel: '{underline number}',
        description: '文章最大字数。',
      },
    ],
  },
];
const usage = commandLineUsage(sections); // 生成帮助文本
const optionDefinitions = [
  {name: 'help'}, 
  {name: 'title', type: String},
  {name: 'min', type: Number},
  {name: 'max', type: Number},
]
// const options = parseOptions();
const options = commandLineArgs(optionDefinitions);
// if ('help' in options) {
//   console.log(usage)
// } else {
  let title = options.title || createRandomPicker(corpus.title)();
  (async function () {
    if(Object.keys(options).length <= 0) {
      const answers = await interact([
        {text: '请输入文章主题', value: title},
        {text: '请输入最小字数', value: 6000},
        {text: '请输入最大字数', value: 10000},
      ]);
      title = answers[0];
      options.min = answers[1];
      options.max = answers[2];
    }
  
    const article = generate(title, {corpus, ...options});
    const output = saveCorpus(title, article);
  
    console.log(`生成成功！文章保存于：${output}`);
  }());
//   const article = generate(title, {corpus, ...options});
//   const output = saveCorpus(title, article);
//   console.log(`生成成功！文章保存于：${output}`);
// }

function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, 'output')
  const time = moment().format('ddd, hA');
  const outputFile = resolve(outputDir, `${title}${time}.txt`)
  console.log(outputFile)
  // 检查outputDir是否存在，没有则创建一个
  if(!existsSync(outputDir)) {
    mkdirSync(outputDir)
  }
  const text = `${title}    ${article.join('\n    ')}`
  writeFileSync(outputFile, text)
  return outputFile
}

// console.log('请输入一个要求和的整数，以0结束输入');
// process.stdin.setEncoding('utf8');
// let sum = 0
// process.stdin.on('readable', ()=> {
//   const chunk = process.stdin.read(); // 获取当前输入的字符，包含回车
//   console.log(chunk)
//   const n = Number(chunk.slice(0));
//   console.log(n)
//   sum+=n
//   if (n === 0) {
//     process.stdin.emit('end')
//   } 
//   process.stdin.read() // 在调用一次。返回的是null，并继续监听
// })

// process.stdin.on('end',() => {
//   console.log(`求和结果是：${sum}`)
// })

// const data = readFileSync(path,{encoding: 'utf-8'})
// console.log(data)
// const corpus = loadCorpus('corpus/data.json');
// let title = options.title || createRandomPicker(corpus.title)();

// (async function () {
//   if(Object.keys(options).length <= 0) {
//     const answers = await interact([
//       {text: '请输入文章主题', value: title},
//       {text: '请输入最小字数', value: 6000},
//       {text: '请输入最大字数', value: 10000},
//     ]);
//     title = answers[0];
//     options.min = answers[1];
//     options.max = answers[2];
//   }

//   const article = generate(title, {corpus, ...options});
//   const output = saveCorpus(title, article);

//   console.log(`生成成功！文章保存于：${output}`);
// }());