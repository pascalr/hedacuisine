global.window = global // this looks dangerous...

global.Element = function() {}
global.gon = {}
class FormData {
}
global.FormData = FormData

export const foo = () => {
  return "bar"
}
