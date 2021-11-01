// ast语法树：用对象来描述html语法的结构  虚拟dom：用对象来描述dom节点的结构
import {parseHTML} from "./parser-html"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{}}里面的任意字符
function genProps(attrs) { // 处理属性，拼接成属性的字符串
  // [{name: 'id', value: 'app'}] -> {id: app,a:1,b:2}
  let str = '';
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if(attr.name === 'style') {
      // style = 'color: red;font-size: 14px' ==> {style: {color: 'red}}
      let obj = {}
      attr.value.split(";").forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`;
}

function genChildren(el) {
  let children = el.children;
  if(children && children.length > 0) {
    return `${children.map(c=>gen(c)).join(',')}`
  } else {
    return false
  }
}

function gen(node) {
  if(node.type === 1) {
    // 元素标签
    return generate(node)
  } else {
    // 文本
    let text = node.text;
    let tokens = [];
    let match, index;
    // 每次的偏移量 buffer.split()
    let lastIndex = defaultTagRE.lastIndex = 0;
    while(match = defaultTagRE.exec(text)) {
      index = match.index;
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length;
    }
    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
    
    // a {{name}} b {{age}} c ===> _v("a"+_s(name)+"b"+_s(age)+"c")
    return `_v(${text})`
  }
}

function generate(el) {
  let children = genChildren(el);
  let code = `_c("${el.tag}", ${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  }${
    children ? `,${children}` : ''
  }
  )

  `;

  return code;
}

export function compileToFunction(template) {
  // （1）解析html字符串，将html字符串变成ast语法树
  let root = parseHTML(template)
  // console.log(root)
  // 需要将ast语法树生成最终的render函数，就是字符串拼接（模板引擎）
  let code = generate(root);
  // 核心思路就是将模板转换成下面这段字符串
  // <div id="app"><p>hello {{name}}</p> hello </div>
  // 将ast树，再次转换成js的语法
  // _c("div", {id: app}, _c("p", undefined, -v('hello' + _s(name) )), _v('hello'))
  // _c render函数 _v创建文本 name可能是个对象，要使用JSON.stringify，_s转成字符串
  // 所有的模板引擎实现 都需要new Function + with
  // let renderFn = new Function();
  let renderFn = new Function(`with(this) { return ${code}}`);
  console.log(renderFn)
  // vue的rnder 他返回的是虚拟dom
  return renderFn
} 