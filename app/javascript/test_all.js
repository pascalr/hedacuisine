import {foo} from './nodejs_dependencies'

import {isBlank} from './utils'

//# Ansi color code variables
//red="\e[0;91m"
//blue="\e[0;94m"
//expand_bg="\e[K"
//blue_bg="\e[0;104m${expand_bg}"
//red_bg="\e[0;101m${expand_bg}"
//green_bg="\e[0;102m${expand_bg}"
//green="\e[0;92m"
//white="\e[0;97m"
//bold="\e[1m"
//uline="\e[4m"
//reset="\e[0m"

function assertEquals(expected, current) {
  let msg = "Expected: "+expected+". Got "+current
  if (expected == current) {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color#41407246
    console.log('\x1b[0;92m%s\x1b[0m - %s', 'PASS', msg);
  } else {
    console.log('\x1b[0;92m%s\x1b[0m - %s', 'FAIL', msg);
  }
}

assertEquals(true, isBlank([]))
assertEquals(true, isBlank(""))
assertEquals(true, isBlank(null))
assertEquals(true, isBlank(undefined))
assertEquals(false, isBlank([1]))
assertEquals(false, isBlank("1"))
