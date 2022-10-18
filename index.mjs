// import { ziyue } from "./ziyue.mjs";
// const argv = process.argv;
// console.log(ziyue(argv[2] || '有朋自远方来，不亦乐乎！'))
// 异步动态加载模块
(async function() {
  const {ziyue} = await import('./ziyue.mjs');
  
  const argv = process.argv;
  console.log(ziyue(argv[2] || '巧言令色，鮮矣仁！'));
}());