// ast语法树：用对象来描述html语法的结构  虚拟dom：用对象来描述dom节点的结构
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{}}里面的任意字符

function start(tagName, attrs) {
  console.log("开始标签：", tagName, "属性是：", attrs)
}

function chars(text) {
  console.log("文本是：", text)
}

function end(tagName) {
  console.log('结束标签：', tagName)
}

function parseHTML(html) {
  // 不停的去解析html字符串
  while(html) {
    let textEnd = html.indexOf('<');
    if(textEnd == 0) {
      // 如果当前索引为0 肯定是一个标签：开始标签/结束标签
      let startTagMath = parseStartTag(); // 通过这个方法获取到匹配结果：标签名tagName，属性attrs
      if(startTagMath) {
        start(startTagMath.tagName, startTagMath.attrs);
        continue; // 如果开始标签匹配完毕，继续下一次匹配
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1])
        continue;
      }
    }
    let text;
    if(textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if(text) {
      advance(text.length)
      chars(text)
    }
  }
  // 前进的步数
  function advance(n) {
    html = html.substring(n)
  }
  // 解析开始标签
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除
      let end,attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 将属性进行解析
        advance(attr[0].length); // 将属性去掉
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
      }
      if(end) { // 去掉开始标签的 >
        advance(end[0].length)
        return match
      }
    }
  }
}

export function compileToFunction(template) {
  let root = parseHTML(template)
  return function render() {

  }
} 