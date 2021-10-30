// ast语法树：用对象来描述html语法的结构  虚拟dom：用对象来描述dom节点的结构
import {parseHTML} from "./parser-html"

export function compileToFunction(template) {
  // （1）解析html字符串，将html字符串变成ast语法树
  let root = parseHTML(template)
  console.log(root)
  return function render() {

  }
} 